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
            traineeDiv.innerHTML = `
                        <p><strong>Name:</strong> ${trainee.name}</p>
                        <p><strong>Score:</strong> ${trainee.score}</p>
                        <p><strong>Comments:</strong> ${trainee.comments}</p>
                        <button onclick="editTrainee('${trainee.name}', ${trainee.score}, '${trainee.comments}')">Edit</button>
                        <button onclick="deleteTrainee('${trainee.name}')">Delete</button>
                        <button onclick="selectTrainee('${trainee.name}', ${trainee.score}, '${trainee.comments}')">Select</button>
                        <hr>`;
            resultsContainer.appendChild(traineeDiv);
        });
    }
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
            traineeDiv.innerHTML = `
                <p><strong>Name:</strong> ${trainee.name}</p>
                <p><strong>Score:</strong> ${trainee.score}</p>
                <p><strong>Comments:</strong> ${trainee.comments}</p>
                <hr>`;
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
        <form id="edit-form">
            <input type="hidden" name="csrfmiddlewaretoken" value="${document.querySelector("[name=csrfmiddlewaretoken]").value}">
            <p>
                <label>Name:</label>
                <input name="name" value="${name}" readonly>
            </p>
            <p>
                <label>Score:</label>
                <input name="score" type="number" value="${score}" min="1" max="10" required>
            </p>
            <p>
                <label>Comments:</label>
                <textarea name="comments">${comments}</textarea>
            </p>
            <button type="button" onclick="submitEdit()">Save</button>
        </form>
        `;
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