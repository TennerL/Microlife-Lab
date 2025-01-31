
//////////////////////////////////////
// Funktionen für die Wachstumsrate //
//////////////////////////////////////


export function calculateGrowthRateCandida(temperature, concentration, ph, moisture,p) {
    let baseGrowthRate;
    
    if (temperature <= 0 || temperature > 50) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 5) {
        baseGrowthRate = 0.001; 
    } else if (temperature >= 5 && temperature < 20) {
        baseGrowthRate = p.map(temperature, 5, 20, 0.01, 0.05); 
    } else if (temperature >= 20 && temperature <= 37) {
        baseGrowthRate = p.map(temperature, 20, 37, 0.05, 0.2); 
    } else if (temperature > 37 && temperature <= 50) {
        baseGrowthRate = p.map(temperature, 37, 50, 0.2, 0.01);
    }

    // Nährstoffkonzentration beeinflusst die Wachstumsrate linear (z.B. von 0 bis 100 %)
    // Konzentration in Prozent, 0 % = kein Wachstum, 100 % = volles Wachstum
    let pHFactor = 1 - Math.abs(ph - 5.5) / 5 // Optimal pH around 5.5
    pHFactor = p.constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = p.map(moisture, 0.3, 0.9, 0, 1)
    moistureFactor = p.constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

export function calculateGrowthRateBacillusSubtilis(temperature, concentration, ph, moisture,p) {

    let baseGrowthRate
  
    if (temperature <= 0 || temperature > 55) {
      baseGrowthRate = 0
    } else if (temperature > 0 && temperature < 15) {
      baseGrowthRate = 0.002
    } else if (temperature >= 15 && temperature < 37) {
      baseGrowthRate = p.map(temperature, 15, 37, 0.01, 0.15)
    } else if (temperature >= 37 && temperature <= 50) {
      baseGrowthRate = p.map(temperature, 37, 50, 0.15, 0.02)
    } else if (temperature > 50 && temperature <= 55) {
      baseGrowthRate = p.map(temperature, 50, 55, 0.02, 0.001)
    }
  
    let pHFactor = 1 - Math.abs(ph - 7.0) / 3 // Optimal pH around 7.0
    pHFactor = p.constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = p.map(moisture, 0.4, 0.95, 0, 1)
    moistureFactor = p.constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
  }

export function calculateGrowthRateStaphylococcusAureus(temperature, concentration, ph, moisture,p) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 46) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 7) {
        baseGrowthRate = 0.002; 
    } else if (temperature >= 7 && temperature < 37) {
        baseGrowthRate = p.map(temperature, 7, 37, 0.02, 0.25); 
    } else if (temperature >= 37 && temperature <= 46) {
        baseGrowthRate = p.map(temperature, 37, 46, 0.25, 0.01); 
    }

    let pHFactor = 1 - Math.abs(ph - 7.5) / 3.5 // Optimal pH around 7.5
    pHFactor = p.constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = p.map(moisture, 0.25, 0.9, 0, 1)
    moistureFactor = p.constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

export function calculateGrowthRateEscherichiaColi(temperature, concentration, ph, moisture,p) {
    let baseGrowthRate;

    if (temperature <= 0 || temperature > 45) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 10) {
        baseGrowthRate = 0.003; 
    } else if (temperature >= 10 && temperature < 37) {
        baseGrowthRate = p.map(temperature, 10, 37, 0.01, 0.3); 
    } else if (temperature >= 37 && temperature <= 45) {
        baseGrowthRate = p.map(temperature, 37, 45, 0.3, 0.05); 
    }

    let pHFactor = 1 - Math.abs(ph - 7.0) / 3 // Optimal pH around 7.0
    pHFactor = p.constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = p.map(moisture, 0.3, 0.95, 0, 1)
    moistureFactor = p.constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

export function calculateGrowthRatePenicilliumNotatum(temperature, concentration, ph, moisture,p) {
    let baseGrowthRate;



    if (temperature <= 0 || temperature > 40) {
        baseGrowthRate = 0;
    } else if (temperature > 0 && temperature < 10) {
        baseGrowthRate = 0.002; 
    } else if (temperature >= 10 && temperature < 25) {
        baseGrowthRate = p.map(temperature, 10, 25, 0.01, 0.08); 
    } else if (temperature >= 25 && temperature <= 35) {
        baseGrowthRate = p.map(temperature, 25, 35, 0.08, 0.04); 
    } else if (temperature > 35 && temperature <= 40) {
        baseGrowthRate = p.map(temperature, 35, 40, 0.04, 0.005);
    }

    let pHFactor = 1 - Math.abs(ph - 6.0) / 4 
    pHFactor = p.constrain(pHFactor, 0.1, 1)
  
    let moistureFactor = p.map(moisture, 0.25, 0.85, 0, 1)
    moistureFactor = p.constrain(moistureFactor, 0, 1)
  
    const nutrientFactor = concentration / 100
  
    return baseGrowthRate * nutrientFactor * pHFactor * moistureFactor
}

export function calculateGrowthRateAspergillusNiger(temperature, concentration, ph, moisture,p) {


        let baseGrowthRate;

        if (temperature <= 0 || temperature > 50) {
            baseGrowthRate = 0;
        } else if (temperature > 0 && temperature < 10) {
            baseGrowthRate = 0.001; 
        } else if (temperature >= 10 && temperature < 30) {
            baseGrowthRate = p.map(temperature, 10, 30, 0.02, 0.1); 
        } else if (temperature >= 30 && temperature <= 40) {
            baseGrowthRate = p.map(temperature, 30, 40, 0.1, 0.05); 
        } else if (temperature > 40 && temperature <= 50) {
            baseGrowthRate = p.map(temperature, 40, 50, 0.05, 0.01);
        }

        let pHFactor = 1 - Math.abs(ph - 5.5) / 5;
        pHFactor = p.constrain(pHFactor, 0.1, 1);
        let moistureFactor = p.map(moisture, 0.2, 0.8, 0, 1);
        moistureFactor = p.constrain(moistureFactor, 0, 1);
        let nutrientFactor = concentration / 100;

        let finalGrowthRate = baseGrowthRate * nutrientFactor * pHFactor * moistureFactor;



        return finalGrowthRate;

}

export function calculateDivisionRate(microOrganism, temperature, pH, moisture, concentration, p) {
    let baseDivisionRate = 0.005;
    let tempFactor = 1;
    let pHFactor = 1;
    let moistureFactor = 1;
    let nutrientFactor = concentration / 100;

    switch(microOrganism) {
        case "candida":
            tempFactor = p.map(temperature, 20, 37, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5;
            moistureFactor = p.map(moisture, 0.3, 0.9, 0.5, 1);
            break;
        case "aspergillus":
            tempFactor = p.map(temperature, 20, 35, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5.5;
            moistureFactor = p.map(moisture, 0.15, 0.85, 0.5, 1);
            break;
        case "penicillium":
            tempFactor = p.map(temperature, 15, 25, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 5.5) / 5;
            moistureFactor = p.map(moisture, 0.2, 0.8, 0.5, 1);
            break;
        case "ecoli":
            tempFactor = p.map(temperature, 30, 37, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 7) / 5;
            moistureFactor = p.map(moisture, 0.3, 0.95, 0.5, 1);
            break;
        case "staphylococcus":
            tempFactor = p.map(temperature, 25, 35, 0.5, 1);
            pHFactor = 1 - Math.abs(pH - 7) / 6;
            moistureFactor = p.map(moisture, 0.25, 0.9, 0.5, 1);
            break;
    }

    tempFactor = p.constrain(tempFactor, 0.1, 1);
    pHFactor = p.constrain(pHFactor, 0.1, 1);
    moistureFactor = p.constrain(moistureFactor, 0.1, 1);

    return baseDivisionRate * tempFactor * pHFactor * moistureFactor * nutrientFactor;
}


export function calculateDeathRate(age, crowding, pH, moisture, temperature, microOrganism) {
    

const BASE_GROWTH_RATE = 0.0001
const CROWDING_FACTOR = 0.001
const MAX_MICROBES = 2000

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