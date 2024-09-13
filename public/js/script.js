document.addEventListener('DOMContentLoaded', function() { 

     ////////////////////////////////////////////
     // Modalbox zum erstellen eines Projektes //
     ////////////////////////////////////////////
    
    btnNewProject.addEventListener("click", function() {
        document.getElementById("dlNewProject").showModal();
    })
    btnCloseNewProject.addEventListener("click", function() {
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
    const txtMoistureValue = document.getElementById('txtConcentration');
    slMoistureRange.addEventListener('input', function() {
        txtMoistureValue.value = slMoistureRange.value;
    });

    // Mutation Probability slider
    const slMutationRange = document.getElementById('slMutationRange');
    const txtMutationValue = document.getElementById('txtMutationValue');
    slMutationRange.addEventListener('input', function() {
        txtMutationValue.value = slMutationRange.value;
    });
   
    for (var i = 0; i < 0; i++) { 
        let projectBox = document.createElement("div");
        projectBox.setAttribute("class", "projects col-md-3"); 
    
        projectBox.setAttribute("id", "projectBox" + i);
        projectBox.innerHTML = "<div class='card  bg-dark text-light'><div class='card-body'><p>Projekt Nr." + i + "</p></div></div>"; 
        document.getElementById("projectContainer").appendChild(projectBox);
    }

    // function drawPetriDish() {
    //     if (document.getElementById("petriDish") === null) {
    //         const oPetriDish = document.createElement('canvas');
    //         oPetriDish.setAttribute("id", "petriDish");
    //         const ctx = oPetriDish.getContext('2d');
    //         ctx.beginPath();
    //         ctx.arc(95,50,40,0,2 * Math.PI);
    //         ctx.fillStyle = "red";
    //         ctx.fill();
    //         ctx.lineWidth = 4;
    //         ctx.strokeStyle = "blue";
    //         ctx.stroke();
    //         petriDishContainer.appendChild(oPetriDish);
    //     }
    // } drawPetriDish()

    // function boolPetriDishExists() {
    //     return document.getElementById("petriDish") !== null;
    // }

});
