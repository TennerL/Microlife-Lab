
const { json } = require("express");

// vermeidung von Magic-Numbers
const MAX_MICROBES = 2000
const MUTATION_RATE = 0.001;
const DIVISION_SIZE_THRESHOLD = 20
const DIVISION_AGE_THRESHOLD = 100
const MAX_MICROBE_SIZE = 80
const DEATH_SIZE_REDUCTION = 0.8
const DEATH_ANIMATION_DURATION = 2000 
const SIMULATION_UPDATE_INTERVAL = 10 

const BASE_GROWTH_RATE = 0.0001
const CROWDING_FACTOR = 0.001

const MIN_MOISTURE = 0.1
const MIN_PH = 4.5
const MOISTURE_DECREASE_RATE = 0.0001
const PH_DECREASE_RATE = 0.0001




const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let projectID = urlParams.get('projectID');

let savedProjects = localStorage.getItem('savedProjects');
savedProjects = JSON.parse(savedProjects);
let selectedProject = savedProjects.find(project => project.id == projectID);

let projectName = selectedProject.projectName;
let temperature = selectedProject.temperature;
let concentration = selectedProject.concentration;
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

let microbes = [];
let numMicrobes = countMicrobes;
let growthRate;
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


document.addEventListener("DOMContentLoaded", (event) => {
        
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const labels = document.querySelectorAll('label');

    radioButtons.forEach(button => {
        button.addEventListener('change', () => {
          labels.forEach(label => {
            label.classList.remove('active');
          });
          const activeLabel = button.parentElement;
          activeLabel.classList.add('active');
          const activeButtonId = document.querySelector('input[type="radio"]:checked').id;
          switch(activeButtonId) {
            case "normal":
                timeScale = 1;
                break;
            case "fast":
                timeScale = 2;
                break;
            case "faster":
                timeScale = 3;
                break;
          }
          
          clearInterval(interval);
          startSimulation();  
        });
    });

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

    const getIntervalTime = () => {
        return 1000 / timeScale; 
    };

    function startSimulation() {
        interval = setInterval(() => {
            if (currentIndex > 0) {
                cells[currentIndex - 1].innerHTML = `<span class="marker">|</span>`;
            }
            if (currentIndex < cells.length) {
                cells[currentIndex].innerHTML = `<span class="cursor"></span>`;
                currentIndex++;
                
                simulationTime += 3600; 

            } else {
                clearInterval(interval);
                simulationActive = false;
                console.log("Simulation beendet");
            }
        }, getIntervalTime()); 
    }
    startSimulation();
});

//////////////////////////////////////
// Hilsfunktionen Verteilungsformen //
//////////////////////////////////////

// Gleichverteilung (Verteilung auf der Petrischale)
function randomUniform(min, max) {
    return Math.random() * (max - min) + min;
}

// Normalverteilung (Box-Muller-Methode)
// Für Wachstumsraten, simulierung biologische Variabilität 
function randomNormal(mean, stdDev) {
    let u = 1 - Math.random();
    let v = 1 - Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
} 

// Exponentialverteilung für seltene Mutationen
function randomExponential(lambda) {
    return -Math.log(1 - Math.random()) / lambda;
}

////////////////////////////////////////

function setup() {
    let canvas = createCanvas(600, 600); 
    canvas.parent('canvas-container');    
    petriRadius = (width - 50) / 2; 
    
    switch(microOrganism) {
        case "candida":
            baseGrowthRate = calculateGrowthRateCandida(temperature, concentration, ph, moisture) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2); 
            break;
        case "aspergillus":
            baseGrowthRate = calculateGrowthRateAspergillusNiger(temperature, concentration, ph, moisture) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "penicillium":
            baseGrowthRate = calculateGrowthRatePenicilliumNotatum(temperature, concentration, ph, moisture) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "ecoli":
            baseGrowthRate = calculateGrowthRateEscherichiaColi(temperature, concentration, ph, moisture) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "staphylococcus":
            baseGrowthRate = calculateGrowthRateStaphylococcusAureus(temperature, concentration, ph, moisture) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "bacillus":
            baseGrowthRate = calculateGrowthRateBacillusSubtilis(temperature, concentration, ph, moisture) * timeScale;
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        default:
    }
    
    //mutationRate = randomNormal(1, 0.05);//mutationProbability * timeScale / 100;
    deathRate = 0.001 * timeScale; 
    divisionRate = 0.005 * timeScale;
   
    for (let i = 0; i < numMicrobes; i++) {
        let angle = randomUniform(0, TWO_PI); 
        let r = randomUniform(0, petriRadius - 100 / 2);
        let x = width / 2 + Math.cos(angle) * r;
        let y = height / 2 + Math.sin(angle) * r;
        microbes.push(new Microbe(x, y));
    }
}


//////////////////////////////////////
// Funktionen für die Wachstumsrate //
//////////////////////////////////////


function calculateGrowthRateCandida(temperature, concentration, ph, moisture) {
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
    let pHFactor = 1 - Math.abs(ph - 5.5) / 5 // Optimal pH around 5.5
    pHFactor = constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = map(moisture, 0.3, 0.9, 0, 1)
    moistureFactor = constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

function calculateGrowthRateBacillusSubtilis(temperature, concentration, ph, moisture) {
    let baseGrowthRate
  
    if (temperature <= 0 || temperature > 55) {
      baseGrowthRate = 0
    } else if (temperature > 0 && temperature < 15) {
      baseGrowthRate = 0.002
    } else if (temperature >= 15 && temperature < 37) {
      baseGrowthRate = map(temperature, 15, 37, 0.01, 0.15)
    } else if (temperature >= 37 && temperature <= 50) {
      baseGrowthRate = map(temperature, 37, 50, 0.15, 0.02)
    } else if (temperature > 50 && temperature <= 55) {
      baseGrowthRate = map(temperature, 50, 55, 0.02, 0.001)
    }
  
    let pHFactor = 1 - Math.abs(ph - 7.0) / 3 // Optimal pH around 7.0
    pHFactor = constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = map(moisture, 0.4, 0.95, 0, 1)
    moistureFactor = constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
  }

function calculateGrowthRateStaphylococcusAureus(temperature, concentration, ph, moisture) {
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

    let pHFactor = 1 - Math.abs(ph - 7.5) / 3.5 // Optimal pH around 7.5
    pHFactor = constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = map(moisture, 0.25, 0.9, 0, 1)
    moistureFactor = constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

function calculateGrowthRateEscherichiaColi(temperature, concentration, ph, moisture) {
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

    let pHFactor = 1 - Math.abs(ph - 7.0) / 3 // Optimal pH around 7.0
    pHFactor = constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = map(moisture, 0.3, 0.95, 0, 1)
    moistureFactor = constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

function calculateGrowthRatePenicilliumNotatum(temperature, concentration, ph, moisture) {
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

    let pHFactor = 1 - Math.abs(ph - 6.0) / 4 
    pHFactor = constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = map(moisture, 0.25, 0.85, 0, 1)
    moistureFactor = constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

function calculateGrowthRateAspergillusNiger(temperature, concentration, ph, moisture) {
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

    let pHFactor = 1 - Math.abs(ph - 5.5) / 5;
    pHFactor = constrain(pHFactor, 0.1, 1);
    let moistureFactor = map(moisture, 0.2, 0.8, 0, 1);
    moistureFactor = constrain(moistureFactor, 0, 1);
    let nutrientFactor = concentration / 100;

    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor;
}

function calculateDivisionRate(microOrganism, temperature, pH, moisture, concentration) {
    let baseDivisionRate = 0.005;
    let tempFactor = 1;
    let pHFactor = 1;
    let moistureFactor = 1;
    let nutrientFactor = concentration / 100;

    switch(microOrganism) {
        case "candida":
            tempFactor = map(temperature, 20, 37, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5;
            moistureFactor = map(moisture, 0.3, 0.9, 0.5, 1);
            break;
        case "aspergillus":
            tempFactor = map(temperature, 20, 35, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5.5;
            moistureFactor = map(moisture, 0.15, 0.85, 0.5, 1);
            break;
        case "penicillium":
            tempFactor = map(temperature, 15, 25, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5;
            moistureFactor = map(moisture, 0.2, 0.8, 0.5, 1);
            break;
        case "ecoli":
            tempFactor = map(temperature, 30, 37, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 7) / 5;
            moistureFactor = map(moisture, 0.3, 0.95, 0.5, 1);
            break;
        case "staphylococcus":
            tempFactor = map(temperature, 25, 35, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 7) / 6;
            moistureFactor = map(moisture, 0.25, 0.9, 0.5, 1);
            break;
    }

    tempFactor = constrain(tempFactor, 0.1, 1);
    pHFactor = constrain(pHFactor, 0.1, 1);
    moistureFactor = constrain(moistureFactor, 0.1, 1);

    return baseDivisionRate * tempFactor * pHFactor * moistureFactor * nutrientFactor;
}


function calculateDeathRate(age, crowding, pH, moisture, temperature, microOrganism) {
    let baseDeathRate = BASE_GROWTH_RATE * (age/500);
    let crowdingFactor = (crowding / MAX_MICROBES) * CROWDING_FACTOR;
    let tempStress = 0;
    let pHStress = 0;
    let moistureStress = 0;

    switch(microOrganism) {
        case "candida":
            if (temperature < 20 || temperature > 45) tempStress = 0.0003;
            if (pH < 2 || pH > 10) pHStress = 0.0002;
            if (moisture < 0.8) moistureStress = 0.0004;
            break;
        case "aspergillus":
            if (temperature < 6 || temperature > 47) tempStress = 0.0004;
            if (pH < 2 || pH > 11) pHStress = 0.0001;
            if (moisture < 0.77) moistureStress = 0.0003;
            break;
        case "penicillium":
            if (temperature < 4 || temperature > 37) tempStress = 0.0003;
            if (pH < 3 || pH > 8) pHStress = 0.0002;
            if (moisture < 0.80) moistureStress = 0.0004;
            break;
        case "ecoli":
            if (temperature < 7 || temperature > 46) tempStress = 0.0005;
            if (pH < 4.4 || pH > 9) pHStress = 0.0003;
            if (moisture < 0.95) moistureStress = 0.0002;
            break;
        case "staphylococcus":
            if (temperature < 7 || temperature > 48) tempStress = 0.0004;
            if (pH < 4 || pH > 10) pHStress = 0.0002;
            if (moisture < 0.86) moistureStress = 0.0003;
            break;
    }
    return baseDeathRate + crowdingFactor + tempStress + pHStress + moistureStress;
}


class Microbe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(0, 5); 
        this.growthFactor = growthRate * timeScale; 
        this.color = color(100, 255, 100, 150);
        this.maxSize = MAX_MICROBE_SIZE;
        this.age = 0;
        this.isAlive = true; 
        this.isMutated = false;
    }

    grow() {
        this.growthFactor = growthRate * timeScale;
        let newSize = this.size + this.growthFactor;
        let distanceFromCenter = dist(this.x, this.y, width / 2, height / 2);
        this.age++;

        if (!this.isAlive) {
            this.size *= 0.95; 
            if (this.size <= 0.5) {
                let index = microbes.indexOf(this);
                if (index > -1) {
                    microbes.splice(index, 1);
                }
            }
            return; 
        }

        const lambda = 0.2; // Durchschnittlich 1 Mutation alle 5 Zeiteinheiten
        if (this.isMutated) {
            this.growthFactor *= 1.1; 
            this.deathProbability *= 0.9; 
        }
        if (randomExponential(lambda) < 0.1) {  
            this.mutate();
        }
        
        const deathProbability = calculateDeathRate(
            this.age,
            microbes.length,
            ph,
            moisture,
            temperature,
            microOrganism
        );
        if (random() < deathProbability) {
            this.death();  
        }   

        const  capacityFactor = 1 - (microbes.length / 2000);
        this.growthFactor *= capacityFactor;

        const divisionRate = randomNormal(
            calculateDivisionRate(microOrganism, temperature, ph, moisture, concentration),
            0.05
        );

        if (this.age > DIVISION_AGE_THRESHOLD && 
            this.size > DIVISION_SIZE_THRESHOLD && 
            random() < divisionRate * capacityFactor
        ){
            this.divide();
        }

        if (distanceFromCenter + newSize / 2 >= petriRadius || newSize > this.maxSize) {
            const distanceFactor = max(0, (petriRadius - distanceFromCenter - this.size / 2) / (this.growthFactor + 1));
            const sizeFactor = max(0, (this.maxSize - this.size) / (this.growthFactor + 1));
            const growthModifier = min(distanceFactor, sizeFactor);
        
            this.growthFactor *= growthModifier; 
            newSize = this.size + this.growthFactor;
        }
        if (distanceFromCenter + newSize / 2 < petriRadius && newSize <= this.maxSize) {
            this.size = newSize;
        }

        return this.isAlive; 
    }

    divide() {
       if (microbes.length < MAX_MICROBES) { 
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
     mutate() {
       if (!this.isMutated && random() < MUTATION_RATE) {
         this.isMutated = true;
         this.growthFactor *= 1.5; 
         this.maxSize *= 1.2; 
         this.mutationColor = color(255, 0, 0, 150);
       }
     }
     death() {
         this.isAlive = false; 
         this.color = color(100, 100, 100, 100); 
         this.size *= DEATH_SIZE_REDUCTION;  
         setTimeout(() => {
             if (this.size <= 0.5) {
                 let index = microbes.indexOf(this);
                 if (index > -1) {
                     microbes.splice(index, 1); 
                 }
             }
         }, DEATH_ANIMATION_DURATION); 
     }

     display() {
         if (fun) {
             fill(random(255), random(255), random(255), 150);
         } else {
             fill(this.isMutated ? this.mutationColor : this.color);
         }
         noStroke();
         ellipse(this.x, this.y, this.size, this.size);
     }
}

let lastLoggedHour = 0; 
let previousPopulation = 0; 
function draw() {
    if (!simulationActive) {
        return;
    }
    simulationTime += (timeScale * SIMULATION_UPDATE_INTERVAL) / 60; 

    moisture = max(moisture - MOISTURE_DECREASE_RATE  * timeScale, MIN_MOISTURE); 
    ph = max(ph - PH_DECREASE_RATE * timeScale, MIN_PH);

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

}



class DataBuilder {
    constructor() {
        this.data = [];
    }

    addPoint(count, mutation,mutationrate, hour, avgSize) {
        this.data.push({
            point: {
                count: count,
                mutation: mutation,
                mutationrate: mutationrate,
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


const builder = new DataBuilder();

function logMicrobeData(microbes, currentHour, simulationActive) {

   const mutatedCount = microbes.filter(m => m.isMutated).length;
   const mutationRate = mutatedCount / microbes.length * 100;
    
   const initialPopulation = previousPopulation || microbes.length; 
   const finalPopulation = microbes.length;
   const averageSize = (finalPopulation - initialPopulation) / initialPopulation;

    builder.addPoint(microbes.length, mutatedCount, mutationRate, currentHour, averageSize);

    previousPopulation = finalPopulation;

    if (!simulationActive) {
        const chartButton = document.getElementById("btnChart");
        chartButton.disabled = false; 
        chartButton.classList.add("active");
        chartButton.addEventListener("click", function() {
            window.location.href = "/chart?projectID=" + projectID;
        });

        let data = builder.toJSON();  

        if (selectedProject) {
            if (!selectedProject.simulations) {
                selectedProject.simulations = []; 
            }
            selectedProject.simulations = [{point: { count: countMicrobes, mutation: 0, mutationRate: 0, x: 0, y: 0}}, ...JSON.parse(data).Data]; 
            localStorage.setItem('savedProjects', JSON.stringify(savedProjects));  
        }
    }
}
