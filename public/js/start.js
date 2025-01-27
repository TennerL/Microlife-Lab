document.addEventListener("DOMContentLoaded", (event) => {

var btnSample1 = document.getElementById("btnSample1")
let savedProjects = localStorage.getItem("savedProjects");

btnSample1.addEventListener('click', function(){
    
    const projectData = {
        id: "example-aspergillus",
        projectName: "Beispiel (Aspergillus)",
        temperature: 23,
        concentration: 100,
        moisture: 100,
        microOrganism: "aspergillus",
        countMicrobes: 10,
        simulationTimeUnit: "d",
        simulationTime: 2,
        ph: 7,
        minGermCount: 1000
    };

    if (savedProjects) {
        savedProjects = JSON.parse(savedProjects);
    } else {
        savedProjects = [];
    }

    savedProjects.push(projectData);

    localStorage.setItem("savedProjects", JSON.stringify(savedProjects));

    window.location.href = "/main";
})

});