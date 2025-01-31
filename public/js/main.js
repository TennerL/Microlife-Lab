document.addEventListener('DOMContentLoaded', function() {

    ////////////////////////////////////////////
    // Modalbox zum Erstellen eines Projektes //
    ////////////////////////////////////////////
    document.getElementById("btnNewProject").addEventListener("click", function() {
        document.getElementById("dlNewProject").showModal();
    });
    document.getElementById("btnCloseNewProject").addEventListener("click", function() {
        document.getElementById("dlNewProject").close();
        window.location.reload();
    });

    // Temperatur-Slider 
    const slTemperatureRange = document.getElementById('slTemperatureRange');
    let txtTemperatureValue = document.getElementById('txtTemperatureValue');
    txtTemperatureValue.value = 50;
    slTemperatureRange.addEventListener('input', function() {
        txtTemperatureValue.value = slTemperatureRange.value;
    });

    // Konzentrations-Slider
    const slConcentrationRange = document.getElementById('slConcentrationRange');
    let txtConcentrationValue = document.getElementById('txtConcentrationValue');
    txtConcentrationValue.value = 50;
    slConcentrationRange.addEventListener('input', function() {
        txtConcentrationValue.value = slConcentrationRange.value;
    });

    // Feuchtigkeit-Slider 
    const slMoistureRange = document.getElementById('slMoistureRange');
    let txtMoistureValue = document.getElementById('txtMoistureValue');
    txtMoistureValue.value = 50;
    slMoistureRange.addEventListener('input', function() {
        txtMoistureValue.value = slMoistureRange.value;
    });

    // PH-Slider mit Vorschau der Farbe
    const slPhRange = document.getElementById('slPhRange');
    const phIndicator = document.getElementById('phIndicator');
    const txtPhValue = document.getElementById('txtPhValue');
    txtPhValue.innerHTML = slPhRange.value;
    txtPhValue.style.color = "black";
    
    const phColors = [
        "#8B0000", "#FF0000", "#FF4500", "#FFA500", "#FFD700", 
        "#FFFF00", "#ADFF2F", "#00FF00", "#40E0D0", "#87CEEB", 
        "#0000FF", "#00008B", "#8A2BE2", "#9400D3", "#4B0082"
    ];

    updateColor(parseInt(slPhRange.value));

    slPhRange.addEventListener('input', function () {
        document.getElementById('txtPhValue').innerText = slPhRange.value;
        updateColor(parseInt(slPhRange.value)); 
    });


    function updateColor(value) {
        phIndicator.style.backgroundColor = phColors[value];
    }


    // Holen der Eingabeparameterfelder beim Speichern eines Projektes 
    document.getElementById("btnSaveNewProject").addEventListener("click", function () {

        let savedProjects = localStorage.getItem("savedProjects");
        const microOrganism = document.getElementById("ddlMicroOrganisms").value;
        const projectNameInput = document.getElementById("txtProjectName");
        let projectName = projectNameInput.value.trim();
    
        const projectID = makeid(20);
        if (!projectName) {
            projectName = microOrganism + " (" + projectID + ")";
        }
        
        const temperature = document.getElementById("slTemperatureRange").value;
        const concentration = document.getElementById("slConcentrationRange").value;
        const ph = document.getElementById("txtPhValue").value;
        const moisture = document.getElementById("txtMoistureValue").value;
        const countMicrobes = document.getElementById("txtMicrobeCount").value;
        const simulationTimeUnit = document.getElementById("ddlTimeUnit").value;
        const simulationTime = document.getElementById("txtSimulationDuration").value;
        const minGermCount = document.getElementById("txtMinGermCount").value;

        if(simulationTime > 5 && simulationTimeUnit == "d"){
            alert("Die Simulationsdauer muss zwischen 1 und 5 Tagen sein.");
            return;
        }
        if(simulationTime > 600 && simulationTimeUnit == "h"){
            alert("Die Simulationsdauer muss zwischen 1 und 600 Stunden sein.");
            return;
        }
        if(countMicrobes > 100){
            alert("Die Anfangsanzahl muss zwischen 1 und 100 sein.");
            return;
        }

        const projectData = {
            id: projectID,
            projectName: projectName,
            temperature: temperature,
            concentration: concentration,
            moisture: moisture,
            microOrganism: microOrganism,
            countMicrobes: countMicrobes,
            simulationTimeUnit: simulationTimeUnit,
            simulationTime: simulationTime,
            ph: ph,
            minGermCount: minGermCount
        };

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
                    <img class="card-img-top" src="/images/${project.microOrganism}.jpg" style="height: 200px;">
                        <div class="card-body">
                            <p>${project.projectName}</p>
                            <button class="btn btn-danger" onclick="deleteProject(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                            </svg></button>
                            <button class="btn btn-primary" onclick="goToProject('${project.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                            </svg></button>
                            <button style="margin-left:95px; background-color:rgba(var(--bs-dark-rgb), var(--bs-bg-opacity)) !important;" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li class="dropdown-item">Bearbeiten</li>
                                <li class="dropdown-item">Chart-Daten</li>
                            </ul>
                        </div>
                    </div>
                `;

                projectContainer.appendChild(projectBox);

                const dropdownItems = projectBox.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.addEventListener("click", function() {
                        if(item.textContent === 'Bearbeiten'){
                            console.log("Click!");
                            editProject(project.id);
                        } else if (item.textContent === 'Chart-Daten'){
                            chartData(project.id);
                        }
                    })
                })                
            });
        } else {
            projectContainer.innerHTML = '<h5 class="centered-text">Keine gespeicherten Projekte gefunden</h5>';
            projectContainer.innerHTML += '<p class="centered-text">Bitte erstellen Sie ein Projekt!</p>'
        }
    }

    window.chartData = function(projectID) {
        let savedProjects = JSON.parse(localStorage.getItem('savedProjects')); 
        let selectedProject = savedProjects.find(project => project.id == projectID);
        if (!isEmpty(selectedProject.simulations)){
            window.location.href = "/chart?projectID="+ projectID;
        } else {
            alert("Keine Daten! \nBitte erst Simulation ausführen!");
        }
    }

    window.editProject = function(projectID) {
        let savedProjects = JSON.parse(localStorage.getItem('savedProjects')); 
        let selectedProject = savedProjects.find(project => project.id == projectID);
    
        document.getElementById("dlNewProject").showModal();    
    
        document.getElementById("txtProjectName").value = selectedProject.projectName;
        document.getElementById("slTemperatureRange").value = selectedProject.temperature;
        document.getElementById("txtTemperatureValue").value = selectedProject.temperature;
        document.getElementById("slConcentrationRange").value = selectedProject.concentration;
        document.getElementById("txtConcentrationValue").value = selectedProject.concentration;
        document.getElementById("slMoistureRange").value = selectedProject.moisture;
        document.getElementById("txtMoistureValue").value = selectedProject.moisture;
        txtPhValue.innerHTML = selectedProject.ph;
        document.getElementById("slPhRange").value = selectedProject.ph;
        document.getElementById("txtPhValue").value = selectedProject.ph;
        updateColor(parseInt(selectedProject.ph));
        document.getElementById("ddlMicroOrganisms").value = selectedProject.microOrganism;
        document.getElementById("txtMicrobeCount").value = selectedProject.countMicrobes;
        document.getElementById("ddlTimeUnit").value = selectedProject.simulationTimeUnit;
        document.getElementById("txtSimulationDuration").value = selectedProject.simulationTime;
        document.getElementById("txtMinGermCount").value = selectedProject.minGermCount;
    
        
        var divSave = document.getElementById("divSave");
        var saveButton = document.getElementById("btnSaveNewProject");
        saveButton.remove();
        var editButton = document.createElement("button");
        editButton.classList.add("btn");
        editButton.classList.add("btn-primary");   
        editButton.id = "btnEdit";
        editButton.innerHTML = "Ändern";
        divSave.appendChild(editButton);
        document.getElementById("txtWindowTitle").innerHTML = "Bearbeiten";

        
        document.getElementById("btnEdit").addEventListener("click", function() {
            selectedProject.projectName = document.getElementById("txtProjectName").value;
            selectedProject.temperature = document.getElementById("slTemperatureRange").value;
            selectedProject.concentration = document.getElementById("slConcentrationRange").value;
            selectedProject.moisture = document.getElementById("slMoistureRange").value;
            selectedProject.ph = document.getElementById("slPhRange").value;
            selectedProject.microOrganism = document.getElementById("ddlMicroOrganisms").value;
            selectedProject.countMicrobes = document.getElementById("txtMicrobeCount").value;
            selectedProject.simulationTimeUnit = document.getElementById("ddlTimeUnit").value;
            selectedProject.simulationTime = document.getElementById("txtSimulationDuration").value;
            selectedProject.minGermCount = document.getElementById("txtMinGermCount").value;

            if(selectedProject.simulationTime  > 5 && selectedProject.simulationTimeUnit == "d"){
                alert("Die Simulationsdauer muss zwischen 1 und 5 Tagen sein.");
                return;
            }
            if(selectedProject.simulationTime > 600 && selectedProject.simulationTimeUnit == "h"){
                alert("Die Simulationsdauer muss zwischen 1 und 600 Stunden sein.");
                return;
            }
            if(selectedProject.countMicrobes > 100){
                alert("Die Anfangsanzahl muss zwischen 1 und 100 sein.");
                return;
            }
    
    
            let projectIndex = savedProjects.findIndex(project => project.id == projectID);
            savedProjects[projectIndex] = selectedProject;  
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));
            document.getElementById("dlNewProject").close();
            console.log("Project updated and saved!");
            window.location.reload();
        });
    }
    

    // Funktion zum Löschen eines Projekts
    window.deleteProject = function(index) {
        let savedProjects = localStorage.getItem("savedProjects");
        

        if (confirm("Sind Sie sicher, dass sie das Projekt löschen wollen?")) {
            savedProjects = JSON.parse(savedProjects);

            savedProjects.splice(index, 1);
            localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
        }
        loadProjects();
    };

    window.goToProject = function(projectID) {
        window.location.href = "/simulation?projectID="+ projectID;
    }
    loadProjects();
});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
