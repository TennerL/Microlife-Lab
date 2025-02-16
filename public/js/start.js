document.addEventListener("DOMContentLoaded", () => {
    const btnSaveSamples = document.getElementById("btnCreateSample");
    let savedProjects = localStorage.getItem("savedProjects");
    savedProjects = JSON.parse(savedProjects) || [];

    const samples = [
        {
            id: "example-aspergillus",
            buttonId: "btnSampleDialogAspergillus",
            description: `
                Die gesundheitlich bedenkliche Mindestkeimzahl ist ca. 1000 <br>
                Es wird ein Projekt erstellt mit den idealen Umweltbedingungen für den Schimmelpilz Aspergillus Niger 
                und der Mindestkeimzahl als Grenzwert. <br><br> Fortfahren?
            `,
            projectData: {
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
                minGermCount: 1000,
            },
        },
        {
            id: "example-candida",
            buttonId: "btnSampleDialogCandida",
            description: `
                Candida Albicans, auch als Hefepilz im Volksmund bekannt, verursacht juckende Hautreizungen. <br> 
                Ideale Bedingungen sind: <br><br>
                <li> 35 - 37 °C - Nahe der menschlichen Körpertemperatur (erhöhtes Risiko im Sommer)</li>
                <li> pH-Wert 2,0 - 6,6 (viel Schwitzen, gesunde Haut hat einen pH von 4,5 - 5,5)</li>
                <li> 0,1 - 5% - Glukose und/oder Harnstoff (Schweiß) begünstigen das Wachstum </li>
                <li> Nach 24 - 48 Stunden kann sich Candida exponentiell vermehren </li> 
                <li> 1000 - 10000 - Ab einer Mindestkeimzahl von 1000 machen sich die Symptome bemerkbar </li> 
                <br><br> Fortfahren?
            `,
            projectData: {
                id: "example-candida",
                projectName: "Beispiel (Candida)",
                temperature: 26,
                concentration: 80,
                moisture: 80,
                microOrganism: "candida",
                countMicrobes: 10,
                simulationTimeUnit: "d",
                simulationTime: 2,
                ph: 4,
                minGermCount: 5000,
            },
        },
    ];

    samples.forEach((sample) => {
        const button = document.getElementById(sample.buttonId);

        if (!button) return;

        if (savedProjects.some((e) => e.id === sample.id)) {
            button.classList.add("disabled");
            button.disabled = true;
        }

        button.addEventListener("click", () => {
            document.getElementById("txtSample").innerHTML = sample.description;
            btnSaveSamples.onclick = () => saveToLocalStorage(sample.projectData);
        });
    });

    function saveToLocalStorage(projectData) {
        savedProjects.push(projectData);
        localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
        window.location.href = "/main";
    }
});
