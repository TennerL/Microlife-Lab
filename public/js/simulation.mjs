
const p5 = require("p5");
import { 
    calculateGrowthRateCandida, 
    calculateGrowthRateAspergillusNiger, 
    calculateGrowthRatePenicilliumNotatum, 
    calculateGrowthRateEscherichiaColi,
    calculateGrowthRateStaphylococcusAureus,
    calculateGrowthRateBacillusSubtilis,
    calculateDivisionRate,
    calculateDeathRate 
} from './calculations.mjs'; 


// vermeidung von Magic-Numbers
const MAX_MICROBES = 2000
const MUTATION_RATE = 0.001;
const DIVISION_SIZE_THRESHOLD = 20
const DIVISION_AGE_THRESHOLD = 100
const MAX_MICROBE_SIZE = 80
const DEATH_SIZE_REDUCTION = 0.8
const DEATH_ANIMATION_DURATION = 2000 
const SIMULATION_UPDATE_INTERVAL = 10 
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
new p5((p) => {

    p.setup = () => {

    let canvas = p.createCanvas(600, 600); 
    let baseGrowthRate;
    canvas.parent('canvas-container');    
    petriRadius = (p.width - 50) / 2; 

    switch(microOrganism) {
        
        case "candida":
            baseGrowthRate = calculateGrowthRateCandida(temperature, concentration, ph, moisture, p) * timeScale;
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2); 
            break;
        case "aspergillus":
            baseGrowthRate = calculateGrowthRateAspergillusNiger(temperature, concentration, ph, moisture, p) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "penicillium":
            baseGrowthRate = calculateGrowthRatePenicilliumNotatum(temperature, concentration, ph, moisture, p) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "ecoli":
            baseGrowthRate = calculateGrowthRateEscherichiaColi(temperature, concentration, ph, moisture, p) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "staphylococcus":
            baseGrowthRate = calculateGrowthRateStaphylococcusAureus(temperature, concentration, ph, moisture, p) * timeScale; 
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        case "bacillus":
            baseGrowthRate = calculateGrowthRateBacillusSubtilis(temperature, concentration, ph, moisture, p) * timeScale;
            growthRate = randomNormal(baseGrowthRate, baseGrowthRate * 0.2);
            break;
        default:
    }

    for (let i = 0; i < numMicrobes; i++) {
        let angle = randomUniform(0, p.TWO_PI); 
        let r = randomUniform(0, petriRadius - 100 / 2);
        let x = p.width / 2 + Math.cos(angle) * r;
        let y = p.height / 2 + Math.sin(angle) * r;
        microbes.push(new Microbe(x, y));
    }
};

let lastLoggedHour = 0; 
let previousPopulation = 0; 

p.draw = () => {
    if (!simulationActive) {
        return;
    }
    simulationTime += (timeScale * SIMULATION_UPDATE_INTERVAL) / 60; 

    moisture = p.max(moisture - MOISTURE_DECREASE_RATE  * timeScale, MIN_MOISTURE); 
    ph = p.max(ph - PH_DECREASE_RATE * timeScale, MIN_PH);

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
  
    p.stroke(255);
    p.fill(50); 
    p.ellipse(p.width / 2, p.height / 2, p.width - 50, p.height - 50); 

    microbes.forEach(microbe => {
        microbe.grow();
        microbe.display();
    });
}



class Microbe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = p.random(0, 5); 
        this.growthFactor = growthRate * timeScale; 
        this.color = p.color(100, 255, 100, 150);
        this.maxSize = MAX_MICROBE_SIZE;
        this.age = 0;
        this.isAlive = true; 
        this.isMutated = false;
    }

    grow() {
        this.growthFactor = growthRate * timeScale;
        let newSize = this.size + this.growthFactor;
        let distanceFromCenter = p.dist(this.x, this.y, p.width / 2, p.height / 2);
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
            microOrganism,
            p
        );
        if (p.random() < deathProbability) {
            this.death();  
        }   

        const  capacityFactor = 1 - (microbes.length / 2000);
        this.growthFactor *= capacityFactor;

        const divisionRate = randomNormal(
            calculateDivisionRate(microOrganism, temperature, ph, moisture, concentration,p),
            0.05
        );

        if (this.age > DIVISION_AGE_THRESHOLD && 
            this.size > DIVISION_SIZE_THRESHOLD && 
            p.random() < divisionRate * capacityFactor
        ){
            this.divide();
        }

        if (distanceFromCenter + newSize / 2 >= petriRadius || newSize > this.maxSize) {
            const distanceFactor = p.max(0, (petriRadius - distanceFromCenter - this.size / 2) / (this.growthFactor + 1));
            const sizeFactor = p.max(0, (this.maxSize - this.size) / (this.growthFactor + 1));
            const growthModifier = p.min(distanceFactor, sizeFactor);
        
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
         let angle = p.random(p.TWO_PI);
         let newX = this.x + p.cos(angle) * this.size;
         let newY = this.y + p.sin(angle) * this.size;
         
         let distanceFromCenter = p.dist(newX, newY, p.width / 2, p.height / 2);
         if (distanceFromCenter < petriRadius) {
           microbes.push(new Microbe(newX, newY));
           this.size *= 0.7;
         }
       }
     }
     mutate() {
       if (!this.isMutated && p.random() < MUTATION_RATE) {
         this.isMutated = true;
         this.growthFactor *= 1.5; 
         this.maxSize *= 1.2; 
         this.mutationColor = p.color(255, 0, 0, 150);
       }
     }
     death() {
         this.isAlive = false; 
         this.color = p.color(100, 100, 100, 100); 
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
             p.fill(random(255), random(255), random(255), 150);
         } else {
             p.fill(this.isMutated ? this.mutationColor : this.color);
         }
         p.noStroke();
         p.ellipse(this.x, this.y, this.size, this.size);
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
});