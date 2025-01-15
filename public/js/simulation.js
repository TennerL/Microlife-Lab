
const { json } = require("express");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let projectName = urlParams.get('projectName');

let savedProjects = localStorage.getItem('savedProjects');
savedProjects = JSON.parse(savedProjects);
let selectedProject = savedProjects.find(project => project.projectName === projectName);

let microbeHistory = [];
let temperature = selectedProject.temperature;
let concentration = selectedProject.concentration;
let mutationProbability = selectedProject.mutationProbability;
let microOrganism = selectedProject.microOrganism;
let ph = selectedProject.ph;
let moisture = selectedProject.moisture;

let countMicrobes = selectedProject.countMicrobes;
let simulationTimeUnit = selectedProject.simulationTimeUnit;
let simulationTimeRaw = selectedProject.simulationTime;

let totalSimulationTime;
switch(simulationTimeUnit) {
    case "h": totalSimulationTime = simulationTimeRaw * 3600;
        break;
    case "d": totalSimulationTime = simulationTimeRaw * 86400;
        break;
    default:
}

const timeOptions = document.querySelectorAll('input[name="timeOptions"]');
let microbes = [];
let numMicrobes = countMicrobes;
let growthRate, mutationRate
let petriRadius;
let fun = false; 

///////////////////////
// Beginn Simulation //
///////////////////////

let timeInMinutes = totalSimulationTime / 60;
let timeInHours = timeInMinutes / 60;

let timeScale = 1; 

let simulationTime = 0;
let simulationActive = true; 


// Logik für die Zeitleiste 
document.addEventListener("DOMContentLoaded", (event) => {

    let interval;
    let currentIndex = 0;
    let cells;
    let timescaleDIV = document.getElementById('graphContainer');

    timescaleDIV.innerHTML = "";
    currentIndex = 0; 


    if (!isNaN(timeInHours) && timeInHours > 0) {
        let graph = "<table>";
        graph += "<tr>";
        for (let i = 0; i < timeInHours; i++) {
            graph += `<td><span class="marker">|</span></td>`;
        }
        graph += "</tr>";
        graph += "</table>";
        timescaleDIV.innerHTML = graph;
        cells = timescaleDIV.querySelectorAll("td");
    }

    interval = setInterval(() => {
        if (currentIndex > 0) {
            cells[currentIndex - 1].innerHTML = `<span class="marker">|</span>`;
        }
        if (currentIndex < cells.length) {
            cells[currentIndex].innerHTML = `<span class="cursor"></span>`;
            currentIndex++;
            
            simulationTime += 3600
            updateSimulation();

        } else {
            clearInterval(interval);
            simulationActive = false;
            console.log("Simulation beendet")
        }
    }, 1000);
});

function updateSimulation() {
    for (let i = 0; i < microbes.length; i++) {
        microbes[i].grow();
    }
    simulationTime += timeScale * 10; 
}


function setup() {
    let canvas = createCanvas(600, 600); 
    canvas.parent('canvas-container');    
    petriRadius = (width - 50) / 2; 
    
    switch(microOrganism) {
        case "candida":
                growthRate = calculateGrowthRateCandida(temperature, concentration) * timeScale; 
            break;
        case "aspergillus":
                growthRate = calculateGrowthRateAspergillusNiger(temperature, concentration) * timeScale; 
            break;
        case "penicillium":
                growthRate = calculateGrowthRatePenicilliumNotatum(temperature, concentration) * timeScale; 
            break;
        case "ecoli":
                growthRate = calculateGrowthRateEscherichiaColi(temperature, concentration) * timeScale; 
            break;
        case "staphylococcus":
                growthRate = calculateGrowthRateStaphylococcusAureus(temperature, concentration) * timeScale; 
            break;
        default:
    }
    
    mutationRate = mutationProbability * timeScale / 100;
    deathRate = 0.001 * timeScale; 
    divisionRate = 0.005 * timeScale;
   
    for (let i = 0; i < numMicrobes; i++) {
        let angle = random(TWO_PI); 
        let r = random(petriRadius - 100 / 2);
        let x = width / 2 + cos(angle) * r;
        let y = height / 2 + sin(angle) * r;
        microbes.push(new Microbe(x, y));
    }
}

// Wachstumsrate basierend auf Temperatur und Nährstoffkonzentration
function calculateGrowthRateCandida(temperature, concentration) {
    let baseGrowthRate;
    
    if (temperature <= 0 || temperature > 50) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 5) {
        baseGrowthRate = 0.001; 
    } else if (temperature >= 5 && temperature < 20) {
        baseGrowthRate = map(temperature, 5, 20, 0.01, 0.05); 
    } else if (temperature >= 20 && temperature <= 37) {
        baseGrowthRate = map(temperature, 20, 37, 0.05, 0.2); 
    } else if (temperature > 37 && temperature <= 50) {
        baseGrowthRate = map(temperature, 37, 50, 0.2, 0.01);
    }

    // Nährstoffkonzentration beeinflusst die Wachstumsrate linear (z.B. von 0 bis 100 %)
    // Konzentration in Prozent, 0 % = kein Wachstum, 100 % = volles Wachstum
    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

function calculateGrowthRateBacillusSubtilis(temperature, concentration) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 50) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 15) {
        baseGrowthRate = 0.002; 
    } else if (temperature >= 15 && temperature < 37) {
        baseGrowthRate = map(temperature, 15, 37, 0.01, 0.15); 
    } else if (temperature >= 37 && temperature <= 50) {
        baseGrowthRate = map(temperature, 37, 50, 0.15, 0.02); 
    }

    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

function calculateGrowthRateStaphylococcusAureus(temperature, concentration) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 46) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 7) {
        baseGrowthRate = 0.002; 
    } else if (temperature >= 7 && temperature < 37) {
        baseGrowthRate = map(temperature, 7, 37, 0.02, 0.25); 
    } else if (temperature >= 37 && temperature <= 46) {
        baseGrowthRate = map(temperature, 37, 46, 0.25, 0.01); 
    }

    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

function calculateGrowthRateEscherichiaColi(temperature, concentration) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 45) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 10) {
        baseGrowthRate = 0.003; 
    } else if (temperature >= 10 && temperature < 37) {
        baseGrowthRate = map(temperature, 10, 37, 0.01, 0.3); 
    } else if (temperature >= 37 && temperature <= 45) {
        baseGrowthRate = map(temperature, 37, 45, 0.3, 0.05); 
    }

    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

function calculateGrowthRatePenicilliumNotatum(temperature, concentration) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 40) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 10) {
        baseGrowthRate = 0.002; 
    } else if (temperature >= 10 && temperature < 25) {
        baseGrowthRate = map(temperature, 10, 25, 0.01, 0.08); 
    } else if (temperature >= 25 && temperature <= 35) {
        baseGrowthRate = map(temperature, 25, 35, 0.08, 0.04); 
    } else if (temperature > 35 && temperature <= 40) {
        baseGrowthRate = map(temperature, 35, 40, 0.04, 0.005);
    }

    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

function calculateGrowthRateAspergillusNiger(temperature, concentration) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 50) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 10) {
        baseGrowthRate = 0.001; 
    } else if (temperature >= 10 && temperature < 30) {
        baseGrowthRate = map(temperature, 10, 30, 0.02, 0.1); 
    } else if (temperature >= 30 && temperature <= 40) {
        baseGrowthRate = map(temperature, 30, 40, 0.1, 0.05); 
    } else if (temperature > 40 && temperature <= 50) {
        baseGrowthRate = map(temperature, 40, 50, 0.05, 0.01);
    }

    let nutrientFactor = concentration / 100;
    return baseGrowthRate * nutrientFactor;
}

let lastLoggedHour = 0; 
function draw() {
    if (!simulationActive) {
        return;
    }

    simulationTime += timeScale * 10 / 60; 
    let currentHour = Math.floor(simulationTime / 3600); 

    if (simulationTime >= totalSimulationTime) {
        simulationActive = false; 
        logMicrobeData(microbes,currentHour, simulationActive);
        return; 
    } 

    if (currentHour > lastLoggedHour) {
        logMicrobeData(microbes, currentHour, simulationActive);
        lastLoggedHour = currentHour;
    }
  

    stroke(255);
    fill(50); 
    ellipse(width / 2, height / 2, width - 50, height - 50); 

    for (let i = 0; i < microbes.length; i++) {
        microbes[i].grow();
        microbes[i].display();
    }
    updateSimulation(); 
}

const calculateDeathRate = (age, crowding) => {
    let baseDeathRate = 0.0001 * (age/500);
    let crowdingFactor = (crowding / 2000) * 0.001;
    let tempStress = 0;
    if (temperature < 15 || temperature > 30) {
        tempStress = 0.0002;
    }
    return baseDeathRate + crowdingFactor + tempStress;
}


class Microbe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(0, 5); 
        this.growthFactor = growthRate * timeScale; 
        this.color = color(100, 255, 100, 150);
        this.maxSize = 80;
        this.age = 0;
    }

    grow() {
        this.growthFactor = growthRate * timeScale;
        let newSize = this.size + this.growthFactor;
        let distanceFromCenter = dist(this.x, this.y, width / 2, height / 2);
        this.age++;
        
        const deathProbability = calculateDeathRate(
            this.age,
            microbes.length
        );

        if (random() < deathProbability) {
            return false; 
        }     

        const  capacityFactor = 1 - (microbes.length / 2000);
        this.growthFactor *= capacityFactor;

        if (this.age > 100 && this.size > 20 && random() < divisionRate * capacityFactor){
            this.divide();
        }

        if (distanceFromCenter + newSize / 2 < petriRadius && newSize <= this.maxSize) {
            this.size = newSize;
        } else {
            this.growthFactor = 0;
        }
    
        if (mutationRate > 0 && random() < mutationRate) {
            this.size *= random(0.98, 1.02);
        }
        return true; 
    }

    divide() {
        if (microbes.length < 2000) { 
          let angle = random(TWO_PI);
          let newX = this.x + cos(angle) * this.size;
          let newY = this.y + sin(angle) * this.size;
          
          let distanceFromCenter = dist(newX, newY, width / 2, height / 2);
          if (distanceFromCenter < petriRadius) {
            microbes.push(new Microbe(newX, newY));
            this.size *= 0.7;
          }
        }
      }
    
    display() {
        if (fun) {
            fill(random(255), random(255), random(255), 150);
        } else {
            fill(this.color);
        }
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function updateSimulation() {
    for (let i = microbes.length - 1; i >= 0; i--) {
      if (!microbes[i].grow()) {
        microbes.splice(i, 1); 
      }
    }
    simulationTime += timeScale * 10;
  }


class DataBuilder {
    constructor() {
        this.data = [];
    }

    addPoint(count, hour, avgSize) {
        this.data.push({
            point: {
                count: count,
                x: hour, 
                y: avgSize 
            }
        });
    }
    toJSON() {
        return JSON.stringify({ Data: this.data }, null, 2);
    }
    printFinalResult() {
        return this.toJSON();
    }
}


var totalSimHours = totalSimulationTime / 60 / 60; 
const builder = new DataBuilder();

function logMicrobeData(microbes, currentHour, simulationActive) {

    const averageSize = microbes
        .map (microbe => microbe.size)
        .reduce((sum, size) => sum + size, 0)
        / microbes.length;
    builder.addPoint(microbes.length,currentHour, averageSize);
    
    if (!simulationActive) {
        const chartButton = document.getElementById("btnChart");
        chartButton.disabled = false; 
        chartButton.classList.add("active");
        chartButton.addEventListener("click", function() {
            window.location.href = "/chart?projectName=" + projectName;
        });

        let data = builder.toJSON();  

        if (selectedProject) {
            if (!selectedProject.simulations) {
                selectedProject.simulations = []; 
            }
            selectedProject.simulations = [{point: { count: countMicrobes, x: 0, y: 0}}, ...JSON.parse(data).Data]; 
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));  
        }
    }
}
