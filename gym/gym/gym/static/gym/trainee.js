let numRooms = 1;
let maxTrainees = 5;
let selectedTrainees = [];


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("search-button").addEventListener("click", searchTrainee);
    document.getElementById("update-config").addEventListener("click", updateConfiguration);
    setStateForConfigurations();
});



function searchTrainee() {
    const searchInput = document.getElementById("search-input").value.trim();

    if (!searchInput) {
        alert("Please enter a trainee name.");
        return;
    }
    
    fetch(`/search-trainee/?name=${encodeURIComponent(searchInput)}`)
        .then(response => {
            if (!response.ok)
                throw new Error("Network response was not ok");

            return response.json();
        }).
        then(data => showResults(data)).
        catch(error => {
            console.error("There was an error with the fetch: ", error);
        });

    function showResults(data) {
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = "";

        if (!data.success) {
            resultsContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
            return;
        }

        const trainees = data.trainees;
        trainees.forEach(trainee => {
            const traineeDiv = document.createElement("div");
            showTrainee(traineeDiv, trainee);
            resultsContainer.appendChild(traineeDiv);
        });
    }
}


function showTrainee(div, trainee) {
    div.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${trainee.name}</h5>
                <p><strong>Score:</strong> ${trainee.score}</p>
                <p><strong>Comments:</strong> ${trainee.comments}</p>
                <div class="btn-group" role="group">
                    <button onclick="editTrainee('${trainee.name}', ${trainee.score}, '${trainee.comments}')" class="btn btn-warning btn-sm">Edit</button>
                    <button onclick="deleteTrainee('${trainee.name}')" class="btn btn-danger btn-sm">Delete</button>
                    <button onclick="selectTrainee('${trainee.name}', ${trainee.score}, '${trainee.comments}')" class="btn btn-success btn-sm">Select</button>
                </div>
            </div>
        </div>
        <hr>`;
}


function selectTrainee(name, score, comments) {
    if (selectedTrainees.length >= maxTrainees) {
        alert(`$You can only select up to ${maxTrainees} trainees.`);
        return;
    }

    if (selectedTrainees.some(trainee => trainee.name === name)) {
        alert(`${name} is already in the selected trainees list.`);
        return;
    }

    selectedTrainees.push({ name, score, comments });
    updateSelectedTraineesUI();
    markTrainee();

    function updateSelectedTraineesUI() {
        const selectedContainer = document.getElementById("selected-trainees");
        selectedContainer.innerHTML = "";

        selectedTrainees.forEach(trainee => {
            const traineeDiv = document.createElement("div");
            showTrainee(traineeDiv, trainee);
            selectedContainer.appendChild(traineeDiv);
        });
    }

    function markTrainee() {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        fetch(`/mark-selected/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ name }),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}



function deleteTrainee(name) {
    if (!confirm(`Are you sure you want to delete trainee ${name}?`)) {
        return;
    }

    const formData = new FormData();
    formData.append("name", name);

    fetch(`/delete-trainee/`, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
        },
    })
    .then(response => response.json())
    .then(data => showResult(data))
    .catch(error => console.error("Error:", error));


    function showResult(data) {
        const resultsContainer = document.getElementById("results-container");
        if (data.success) {
            resultsContainer.innerHTML = `<p style="color: green;">${data.message}</p>`;
        } else {
            resultsContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    }
}



function editTrainee(name, score, comments) {
    const resultsContainer = document.getElementById("results-container");
    if (!resultsContainer) {
        console.error("Error: 'results-container' element not found.");
        return;
    }

    resultsContainer.innerHTML = `
        <div class="card p-4">
            <h3 class="text-center mb-4">Edit Trainee</h3>
            <form id="edit-form">
                <input type="hidden" name="csrfmiddlewaretoken" value="${document.querySelector("[name=csrfmiddlewaretoken]").value}">
            
                <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input name="name" id="name" value="${name}" readonly class="form-control">
                </div>

                <div class="mb-3">
                    <label for="score" class="form-label">Score:</label>
                    <input name="score" id="score" type="number" value="${score}" min="1" max="10" required class="form-control">
                </div>

                <div class="mb-3">
                    <label for="comments" class="form-label">Comments:</label>
                    <textarea name="comments" id="comments" class="form-control">${comments}</textarea>
                </div>

                <div class="text-center">
                    <button type="button" onclick="submitEdit()" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        </div>`;
}



function submitEdit() {
    const form = document.getElementById("edit-form");
    if (!form) {
        console.error("Error: 'edit-form' element not found.");
        return;
    }

    const formData = new FormData(form);

    fetch(`/edit-trainee/`, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
        },
    })
    .then(response => response.json())
    .then(data => showResult(data))
    .catch(error => console.error("Error:", error));

    function showResult(data) {
        const resultsContainer = document.getElementById("results-container");
        if (data.success) {
            resultsContainer.innerHTML = `<p style="color: green;">${data.message}</p>`;
        } else {
            resultsContainer.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    }
}



function updateConfiguration() {
    const numRoomsInput = document.getElementById("num-rooms").value;
    const maxTraineesInput = document.getElementById("max-trainees").value;

    if (!numRoomsInput || !maxTraineesInput) {
        alert("Please provide valid inputs for both fields.");
        return;
    }

    const parsedRooms = parseInt(numRoomsInput);
    const parsedMaxTrainees = parseInt(maxTraineesInput);

    if (parsedRooms < 1 || parsedMaxTrainees < 1) {
        alert("Both values must be 1 or greater.");
        return;
    }

    numRooms = parsedRooms;
    maxTrainees = parsedMaxTrainees;

    document.getElementById("hidden-num-rooms").value = numRooms;

    alert(`Configuration updated! Rooms: ${numRooms}, Max Trainees: ${maxTrainees}`);
    setDefaultState();
}



function setStateForConfigurations() {
    document.getElementById('div_search').style.display = 'none';
    document.getElementById('div_selected_trainees').style.display = 'none';
}



function setDefaultState() {
    document.getElementById('config').style.display = 'none';
    document.getElementById('div_search').style.display = 'block';
    document.getElementById('div_selected_trainees').style.display = 'block';
}