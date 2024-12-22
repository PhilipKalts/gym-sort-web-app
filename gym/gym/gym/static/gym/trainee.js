let selectedTrainees = [];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("search-button").addEventListener("click", searchTrainee)
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
    if (selectedTrainees.length >= 20) {
        alert("You can only select up to 20 trainees.");
        return;
    }

    if (selectedTrainees.some(trainee => trainee.name === name)) {
        alert(`${name} is already in the selected trainees list.`);
        return;
    }

    selectedTrainees.push({ name, score, comments });
    updateSelectedTraineesUI();
}

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
