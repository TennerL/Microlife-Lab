document.addEventListener('DOMContentLoaded', function() {

    ////////////////////////////////////////////
    // Modalbox zum Erstellen eines Projektes //
    ////////////////////////////////////////////
    document.getElementById("btnNewProject").addEventListener("click", function() {
        document.getElementById("dlNewProject").showModal();
    });
    document.getElementById("btnCloseNewProject").addEventListener("click", function() {
        document.getElementById("dlNewProject").close();
    });

    // Temperature Slider 
    const slTemperatureRange = document.getElementById('slTemperatureRange');
    const txtTemperatureValue = document.getElementById('txtTemperatureValue');
    slTemperatureRange.addEventListener('input', function() {
        txtTemperatureValue.value = slTemperatureRange.value;
    });

    // Moisture slider
    const slMoistureRange = document.getElementById('slConcentrationRange');
    const txtMoistureValue = document.getElementById('txtConcentrationValue');
    slMoistureRange.addEventListener('input', function() {
        txtMoistureValue.value = slMoistureRange.value;
    });

    // Mutation Probability slider
    const slMutationRange = document.getElementById('slMutationRange');
    const txtMutationValue = document.getElementById('txtMutationValue');
    slMutationRange.addEventListener('input', function() {
        txtMutationValue.value = slMutationRange.value;
    });

    // Holen der Eingabeparameterfelder beim Speichern eines Projektes 
    document.getElementById("btnSaveNewProject").addEventListener("click", function () {

        const projectName = document.getElementById("txtProjectName").value;
        const temperature = document.getElementById("slTemperatureRange").value;
        const concentration = document.getElementById("slConcentrationRange").value;
        const mutationProbability = document.getElementById("slMutationRange").value;
        const moisture = document.querySelector('input[name="moistureOptions"]:checked').value;
        const microOrganism = document.getElementById("ddlMicroOrganisms").value;

        const projectData = {
            projectName: projectName,
            temperature: temperature,
            concentration: concentration,
            mutationProbability: mutationProbability,
            moisture: moisture,
            microOrganism: microOrganism
        };

        let savedProjects = localStorage.getItem("savedProjects");
        if (savedProjects) {
            savedProjects = JSON.parse(savedProjects);
        } else {
            savedProjects = [];
        }

        savedProjects.push(projectData);

        localStorage.setItem("savedProjects", JSON.stringify(savedProjects));

        loadProjects();

        document.getElementById("dlNewProject").close();
    
    });

    // Funktion zum Laden und Anzeigen der gespeicherten Projekte
    function loadProjects() {
        const savedProjects = localStorage.getItem("savedProjects");
        const projectContainer = document.getElementById("projectContainer");

        projectContainer.innerHTML = ""; // Container leeren

        if (savedProjects && JSON.parse(savedProjects).length > 0) {
            const projectsArray = JSON.parse(savedProjects);

            projectsArray.forEach((project, index) => {
                let projectBox = document.createElement("div");
                projectBox.setAttribute("class", "projects col-md-3");
                projectBox.setAttribute("id", "projectBox" + index);

                projectBox.innerHTML = `
                    <div class="card bg-dark text-light projectCard">
                        <img class="card-img-top" src="/images/coli.jpg">
                        <div class="card-body">
                            <p>${project.projectName}</p>
                            <button class="btn btn-danger" onclick="deleteProject(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                            </svg></button>
                            <button class="btn btn-primary" onclick="goToProject('${project.projectName}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                            </svg></button>
                        </div>
                    </div>
                `;
                projectContainer.appendChild(projectBox);
            });
        } else {
            projectContainer.innerHTML = '<h5 class="centered-text">Keine gespeicherten Projekte gefunden</h5>';
            projectContainer.innerHTML += '<p class="centered-text">Bitte erstellen Sie ein Projekt!</p>'
        }
    }

    // Funktion zum Löschen eines Projekts
    window.deleteProject = function(index) {
        let savedProjects = localStorage.getItem("savedProjects");

        if (savedProjects) {
            savedProjects = JSON.parse(savedProjects);

            savedProjects.splice(index, 1);
            localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
            loadProjects();
        }
    };

    window.goToProject = function(projectName) {
        window.location.href = "/simulation?projectName="+ projectName;
    }

    loadProjects();

});
