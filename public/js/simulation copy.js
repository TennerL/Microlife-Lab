//Projekt aus URL-Parameter holen 
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
let projectName = urlParams.get('projectName')
    
//Projektdaten auslesen und für die Simulation verwenden
let savedProjects = localStorage.getItem('savedProjects');
savedProjects = JSON.parse(savedProjects);
let selectedProject = savedProjects.find(project => project.projectName === projectName);

let temperature = selectedProject.temperature 
let concentration = selectedProject.concentration
let mutationProbability = selectedProject.mutationProbability
let microOrganism = selectedProject.microOrganism
let moisture = selectedProject.moisture

////////////////////////
// Beginn Simulation ///
////////////////////////

let temperatureSlider, nutrientSlider, humiditySelect;
let microbes = [];
let numMicrobes = 500;
let growthRate, mutationRate, environmentMoisture;
let petriRadius;
let timeScale = 1; // Beschleunigt den Prozess um das 100-fache

function setup() {
    let canvas = createCanvas(600, 600); 
    canvas.parent('canvas-container');
    
    petriRadius = (width - 50) / 2; 
    
    // Simulationsparameter aus dem Projekt lesen
    let temperature = selectedProject.temperature; // von 0 bis 100 °C
    let concentration = selectedProject.concentration; // Nährstoffkonzentration --> muss noch eingebaut werden 
    let mutationProbability = selectedProject.mutationProbability; // Mutationswahrscheinlichkeit --> muss noch eingebaut werden 
    let microOrganism = selectedProject.microOrganism; // Verschiedene Mikroorganismen müssen noch eingebaut werden 
    let moisture = selectedProject.moisture; // Feuchtigkeitsstufe --> beweging der Mikroben 

    // Anpassung der Wachstumsrate basierend auf der Temperatur
    growthRate = calculateGrowthRate(temperature) * timeScale; 
    mutationRate = mutationProbability * timeScale / 100;
    environmentMoisture = moisture; 

    // Mikroben initialisieren
    for (let i = 0; i < numMicrobes; i++) {
        let angle = random(TWO_PI); 
        let r = random(petriRadius);
        let x = width / 2 + cos(angle) * r;
        let y = height / 2 + sin(angle) * r;
        microbes.push(new Microbe(x, y));
    }
}

// Funktion zur Berechnung der Wachstumsrate basierend auf der Temperatur
function calculateGrowthRate(temperature) {
    if (temperature <= 0 || temperature > 50) {
        return 0;
    } else if (temperature > 0 && temperature < 5) {
        return 0.001; 
    } else if (temperature >= 5 && temperature < 20) {
        return map(temperature, 5, 20, 0.01, 0.05); 
    } else if (temperature >= 20 && temperature <= 37) {
        return map(temperature, 20, 37, 0.05, 0.2); 
    } else if (temperature > 37 && temperature <= 50) {
        return map(temperature, 37, 50, 0.2, 0.01);
    }
}

// Microbe class
class Microbe {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(2, 5); // Initiale Größe der Mikroben
        this.growthFactor = growthRate;
    }

    move() {
        let speed = map(environmentMoisture, 0, 2, 0.1, 1) * timeScale; // Bewegung je nach Feuchtigkeit
        let newX = this.x + random(-speed, speed);
        let newY = this.y + random(-speed, speed);

        let d = dist(newX, newY, width / 2, height / 2);
        if (d < petriRadius) {
            this.x = newX;
            this.y = newY;
        }
    }

    grow() {
        this.size += this.growthFactor; // Wachstum der Mikroben
        if (random() < mutationRate) {
            this.size *= random(0.95, 1.05); // Kleine Größenänderungen durch Mutation
        }
    }

    display() {
        fill(100, 255, 100, 150);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function draw() {
    // Hintergrund nicht gelöscht, um Kolonien zu sehen
    stroke(0);
    fill(255);
    ellipse(width / 2, height / 2, width - 50, height - 50); // Petrischale zeichnen

    // Mikroben bewegen, wachsen und darstellen
    for (let i = 0; i < microbes.length; i++) {
        microbes[i].move();
        microbes[i].grow();
        microbes[i].display();
    }
}