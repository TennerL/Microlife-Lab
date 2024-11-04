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
let moisture = selectedProject.moisture;
let countMicrobes = selectedProject.countMicrobes;
let simulationTimeUnit = selectedProject.simulationTimeUnit;
let simulationTimeRaw = selectedProject.simulationTime;

let totalSimulationTime;
switch(simulationTimeUnit) {
    case "min": totalSimulationTime = simulationTimeRaw * 60;
        break;
    case "h": totalSimulationTime = simulationTimeRaw * 3600;
        break;
    case "d": totalSimulationTime = simulationTimeRaw * 86400;
        break;
    default:
}

const timeOptions = document.querySelectorAll('input[name="timeOptions"]');
let temperatureSlider, nutrientSlider, humiditySelect;
let microbes = [];
let numMicrobes = countMicrobes;
let growthRate, mutationRate, environmentMoisture;
let petriRadius;
let fun = false; 

///////////////////////
// Beginn Simulation //
///////////////////////

let timeScale = 0.1; 
let simulationTime = 0;
let simulationActive = true; 

timeOptions.forEach(option => {
    option.addEventListener('change', function(){
        timeScale = parseFloat(document.querySelector('input[name="timeOptions"]:checked').value);
        console.log("Aktuelle timeScale: " + timeScale);
    });
});

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
    environmentMoisture = moisture; 

    for (let i = 0; i < numMicrobes; i++) {
        let angle = random(TWO_PI); 
        let r = random(petriRadius);
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

class Microbe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(0, 5); 
        this.growthFactor = growthRate * timeScale; 
        this.color = color(100, 255, 100, 150);
        this.maxSize = 100;
    }

    move() {
        let speed = map(environmentMoisture, 0, 2, 0.1, 1) * timeScale;
        let newX = this.x + random(-speed, speed);
        let newY = this.y + random(-speed, speed);

        let d = dist(newX, newY, width / 2, height / 2);

        if (d + this.size / 2 < petriRadius) {
            this.x = newX;
            this.y = newY;
        }


    }

    grow() {

        this.growthFactor = growthRate * timeScale; 
        let newSize = this.size + this.growthFactor;

        let d = dist(this.x, this.y, width / 2, height / 2);

        if (d + newSize / 2 < petriRadius && newSize <= this.maxSize) {
            this.size = newSize;
        } else {
            this.growthFactor = 0; 
        }

        if (mutationRate > 0 && random() < (mutationRate * timeScale)) {
            
            this.size *= random(0.95, 1.05);

            this.color = color(
                constrain(this.color.levels[0] + random(-10, 10), 100, 255),
                constrain(this.color.levels[1] + random(-10, 10), 100, 255),
                constrain(this.color.levels[2] + random(-10, 10), 100, 255),
                150
            );
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

function draw() {
    
    if (!simulationActive) {
        return;
    }

    simulationTime += timeScale * 10 / 60; 
    if (simulationTime >= totalSimulationTime) {
        simulationActive = false; 
        console.log("Simulation beendet nach " + totalSimulationTime + " Minuten!");
        return; 
    }
    
    console.log(simulationTime);

    stroke(255);
    fill(50); 
    ellipse(width / 2, height / 2, width - 50, height - 50); 

    for (let i = 0; i < microbes.length; i++) {
        microbes[i].move();
        microbes[i].grow();
        microbes[i].display();
    }

    logMicrobeData();
}

function logMicrobeData() {
    let microbeData = microbes.map(microbe => ({
        x: microbe.x,
        y: microbe.y, 
        size: microbe.size,
        mutationOccurred: random() < mutationRate
    }));
    microbeHistory.push(microbeData);
}

if (selectedProject.projectName === "Party") {
    fun = true;
}