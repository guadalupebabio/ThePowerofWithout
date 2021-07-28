const csv = require('csv-parser');
const fs = require('fs');
const util = require('util')

const identifyNa = (stat) => {
    if (typeof stat === 'string') {
        if (stat === '') {
            return 50;
        } else {
            return parseInt(stat)
        }
    } else if (typeof stat === 'integer') {
        return stat;
    } else if (typeof stat === 'float') {
        return parseFloat(stat);
    } else {
        return 50;
    }
};

const nCauses = (cause) => {
    let newCause = cause.toLowerCase();
    console.log(newCause)

    switch (newCause) {
        case 'squatting':
            newCause = 10;
            break;
        case 'refugee camp':
            newCause = 50;
            break;
        case 'illegal subdivision':
            newCause = 80;
            break;
        default:
            newCause = 50;
    };

    return newCause;
};

const nTopography = (top) => {
    let newTop = top.toLowerCase();

    switch (newTop) {
        case 'desert':
            newTop = 20;
            break;
        case 'water':
            newTop = 40;
            break;
        case 'by the coast':
            newTop = 80;
            break;
        case 'valley':
            newTop = 100;
            break;
        case 'mountain':
            newTop = 50;
            break;
        case 'forest':
            newTop = 60;
            break;
        default:
            newTop = 15;
    };

    return newTop;
};

const nTypeOfEnergy = (energy) => {
    let newEnergy = energy.toLowerCase();

    switch (newEnergy) {
        case 'electricity':
            newEnergy = 100;
            break;
        case 'lpg, natural gas':
            newEnergy = 100;
            break;
        case 'kerosene, other liquid fuel':
            newEnergy = 50;
            break;
        case 'coal, lignite':
            newEnergy = 15;
            break;
        case 'firewood, straw, dung or charcoal':
            newEnergy = 10;
            break;
        default:
            newEnergy = 15;
    };

    return newEnergy;
};

const nTypeOfMobility = (mob) => {
    let newMob = mob.toLowerCase()

    switch (newMob) {
        case 'walk':
            newMob = 10;
            break;
        case 'bike':
            newMob = 50;
            break;
        case 'motorcycle':
            newMob = 10;
            break;
        case 'animal':
            newMob = 5;
            break;
        case 'informal transportation, tuctuc':
            newMob = 15;
            break;
        case 'informal transportation, microbuses':
            newMob = 20;
            break;
        case 'car':
            newMob = 30;
            break
        case 'public transportation, bus':
            newMob = 40;
            break;
        case 'public transportation, subway':
            newMob = 80;
            break;
        default:
            newMob = 15;
    };

    return newMob;
}

const nMaterials = (mat, climate) => {
    const climateMaterials = {
        'tropical': [65, 80, 80, 100, 30, 20, 10],
        'temperate': [90, 90, 90, 80, 20, 40, 30],
        'dry': [100, 80, 90, 80, 20, 30 , 30],
        'continental': [45, 90, 100, 90, 40, 35, 20],
        'polar': [10, 50, 100, 80, 15, 10, 0],
        'default': [65, 80, 100, 70, 40, 20, 10]
    };

    let newMat = mat.toLowerCase();

    if (newMat === "mud") {
        return climateMaterials[climate][0];
    } else if (newMat === 'brick') {
        return climateMaterials[climate][1];
    } else if (newMat === 'concrete') {
        return climateMaterials[climate][2];
    } else if (newMat === 'wood') {
        return climateMaterials[climate][3];
    } else if (newMat === 'corrugated sheet') {
        return climateMaterials[climate][4];
    } else if (newMat === 'tarpaulin / tensile structures') {
        return climateMaterials[climate][5];
    } else if (newMat === 'cardboard') {
        return climateMaterials[climate][6];
    } else {
        return 15;
    };
};

const nPopulation = (pop) => {
    if (pop === '') {
        return 0;
    } else {
        let num = parseInt(pop);

        if (num <= 10000) {
            return 80;
        } else if (num > 10000 && num <= 50000) {
            return 50;
        } else if (num > 50000 && num <= 100000) {
            return 30;
        } else if (num > 100000 && num <= 1000000) {
            return 10;
        } else {
            return 0;
        };
    };
};

const ageNa = (age) => {
    if (typeof age === 'string') {
        if (age === '') {
            return 0.01;
        } else {
            return parseInt(age)
        }
    } else if (typeof age === 'integer') {
        return age;
    } else if (typeof age === 'float') {
        return parseFloat(age);
    } else {
        return 0.01;
    }
}


const emptyCheck = (arr) => {
    if (!Array.isArray(arr) || !arr.length) {
        return 0;
    } else {
        let sum = arr.reduce((a, b) => a + b, 0);

        if (sum >= 100) {
            return 100
        };

        return sum;
    };
};

const round = (num) => {
    let int = Math.floor(num);
    let decimal = num - int;

    if (decimal <= 0.5) {
        return int + 0.25;
    } else {
        return int + 0.75;
    };
};

const findKoppen = (lat, long, data) => {
    let newLat = round(lat);
    let newLong = round(long);

    let index = 0;
    let isLong = true;
    let low = 0;
    let high = 85794;
    let counter = 0;
    let middle = 0;
    let koppenLong, koppenLat, climate

    while (isLong) {
        counter += 1;
        middle = Math.floor((high + low)/2);

        koppenLong = parseFloat(data[middle]['0']);
        koppenLat = parseFloat(data[middle]['1']);

        if (koppenLong > newLong) {
            high = middle;
        } else if (koppenLong < newLong) {
            low = middle;
        } else {
            if (koppenLat > newLat) {
                low = middle;
            } else if (koppenLat < newLat) {
                high = middle;
            } else {
                index = middle;
                isLong = false;
            };
        };

        if (counter > 17) {
            index = middle;
            break;
        };
    };

    climate = data[index]['2'][0];

    if (climate === 'A') {
        return 'tropical';
    } else if (climate === 'B') {
        return 'dry';
    } else if (climate === 'C') {
        return 'temperate';
    } else if (climate === 'D') {
        return 'continental';
    } else if (climate === 'E') {
        return 'polar';
    };

};

const causesArray = (arr) => {
    if (!Array.isArray(arr) || !arr.length) {
        return 50;
    } else {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '') {
                newArr.push(nCauses(arr[i]));
            };
        };
        
        return emptyCheck(newArr);
    };
};

const topographyArray = (arr) => {
    if (!Array.isArray(arr) || !arr.length) {
        return 50;
    } else {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '') {
                newArr.push(nTopography(arr[i]));
            };
        };
        
        return emptyCheck(newArr);
    };
};

const typeOfEnergyArray = (arr) => {
    if (!Array.isArray(arr) || !arr.length) {
        return 50;
    } else {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '') {
                newArr.push(nTypeOfEnergy(arr[i]));
            };
        };
        
        return emptyCheck(newArr);
    };
};

const mobilityModesArray = (arr) => {
    if (!Array.isArray(arr) || !arr.length) {
        return 50;
    } else {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '') {
                newArr.push(nTypeOfMobility(arr[i]));
            };
        };
        
        return emptyCheck(newArr);
    };
}

const matArray = (mat, weather) => {
    if (!Array.isArray(mat) || !mat.length) {
        return 50;
    } else {
        let newArr = [];
        for (let i = 0; i < mat.length; i++) {
            if (mat[i] !== '') {
                newArr.push(nMaterials(mat[i], weather));
            };
        };
        
        return emptyCheck(newArr);
    };
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function settlementAnalysis(data, coords, koppenData) {

    let site, populace, architecture, informality_indicator = null;
    
    console.log('veremos')
    let lat = coords[0]
    let long = coords[1]

    let type_of_climate = findKoppen(lat, long, koppenData)

    //Site-Origin
    let causes = causesArray(data['Original causes'])

    let population = nPopulation(data['Population'])

    //Site-Geography
    let topography = topographyArray(data['Topography Features'])

    let weather = identifyNa(data['Resilience to natural conditions'])

    //Site-Vulnerability
    //Inverse
    let crime_rate = 100 - identifyNa(data['Crime rate'])

    //Inverse
    let perception_of_security = 100 - identifyNa(data['Perception of Insecurity'])

    let participation = identifyNa(data['sParticipation in decision-making processes'])

    //Architecture-Physical Nature
    let house_quality = identifyNa(data['Housing Quality'])

    let materials = matArray(data['Materials'], type_of_climate)
    console.log(materials)
    console.log('the weather is ', type_of_climate)


    let development_state = identifyNa(data['Development Stage'])

    //Architecture-Infraestructure
    let access_to_energy = identifyNa(data['Access to Energy'])

    let type_of_energy = typeOfEnergyArray(data['Energy Sources'])

    let access_to_water = identifyNa(data['Access to Water'][0])

    let water_public_private = identifyNa(data['Access to Water'][1])/200 + 0.5

    let access_to_sanitation = identifyNa(data['Access to Sanitation'][0])

    let sanitation_communal_private = identifyNa(data['Access to Sanitation'][1])/200 + 0.5

    let telecommunications = identifyNa(data['Access to telecommunications'])

    let internet = identifyNa(data['Access to Internet'])

    let street_quality = identifyNa(data['Road network'])

    let type_of_mobility = mobilityModesArray(data['Mobility Modes'])

    //Architecture-density
    let elevation = identifyNa(data['Storeys per building'])

    let household = identifyNa(data['Households'])

    let dwelling_size = identifyNa(data['Dwelling size'])

    //Populace-quality of life
    let happiness = identifyNa(data['Level of happiness'])

    let access_to_food = identifyNa(data['Access to food'])

    let access_to_health = identifyNa(data['Access to Health Care'])

    let number_of_hospitals = identifyNa(data['Access to Health Care'])

    //Populace-Economy
    //Inverse
    let unemployment = 100 - identifyNa(data['Unemployment Rate'])

    //Inverse
    let formal_sector = 100 - identifyNa(data['Employment in the formal sector'])

    let income = identifyNa(data['Population income'])

    let tenure = identifyNa(data['Tenure'])

    let green_space = identifyNa(data['Access to green spaces'])

    let amenities = identifyNa(data['Proximity to urban amenities'])

    //Populace-Demography
    let gender = identifyNa(data['Gender Distribution'])

    let zero_to_five = ageNa(data['0-5years'])

    if (!zero_to_five) {
        zero_to_five = 0.01
    }

    let six_to_twelve = ageNa(data['6-12years'])

    if (!six_to_twelve) {
        six_to_twelve = 0.01
    }

    let thirteen_to_eighteen = ageNa(data['13-18years'])

    if (!thirteen_to_eighteen) {
        thirteen_to_eighteen = 0.01
    }

    let nineteen_to_thirty = ageNa(data['19-30years'])

    if (!nineteen_to_thirty) {
        nineteen_to_thirty = 0.01
    }

    let thirtyone_to_fifty = ageNa(data['31-50years'])

    if (!thirtyone_to_fifty) {
        thirtyone_to_fifty = 0.01
    }

    let over_fifty = ageNa(data['50+years'])

    if (!over_fifty) {
        over_fifty = 0.01
    }


    if (([zero_to_five, six_to_twelve, thirteen_to_eighteen, nineteen_to_thirty, thirtyone_to_fifty, over_fifty].reduce((a, b) => a + b, 0)) < 100) {
        zero_to_five = 100/6
        six_to_twelve = 100/6
        thirteen_to_eighteen = 100/6
        nineteen_to_thirty = 100/6
        thirtyone_to_fifty = 100/6
        over_fifty = 100/6
    };


    let access_to_education = identifyNa(data['Access to Education'])

    //maybe use a database
    let popslum_per_country = 50

    //Analysis

    let security = (perception_of_security + crime_rate)/2

    let energy = development_state * 0.6 + (access_to_energy * 0.7 + type_of_energy * 0.3) * 0.4

    let sanitation = access_to_sanitation * sanitation_communal_private

    let water = access_to_water * water_public_private

    let connectivity = 0.5 * telecommunications + 0.5 * internet

    let mobility = street_quality * 0.6 + type_of_mobility * 0.4

    let household_per_house = (-0.060024 + 1.458378*(Math.exp(-0.3190336*household/11)))*100

    if (household_per_house < 0) {
        household_per_house = 0;
    } else if (household_per_house > 100) {
        household_per_house = 100;
    };

    let health = 0.3 * (population/number_of_hospitals) + 0.7 * access_to_health

    let jobs = income * 0.5 + formal_sector * 0.2 + unemployment * 0.3

    let ownership = (1.23236 - 1.23242*Math.exp(-1.6971*tenure/100))*100

    let city_dependant = (green_space +  amenities)/2

    let shanon_gender = Math.abs((Math.log(gender/100)*(gender/100) + Math.log(1 - gender/100)*(1 - gender/100))/Math.log(2))*100

    let shanon_age = Math.abs(Math.log(zero_to_five/100)*(zero_to_five/100) + Math.log(six_to_twelve/100)*(six_to_twelve/100) + Math.log(thirteen_to_eighteen/100)*(thirteen_to_eighteen/100) + Math.log(nineteen_to_thirty/100)*(nineteen_to_thirty/100) + Math.log(thirtyone_to_fifty/100)*(thirtyone_to_fifty/100) + Math.log(over_fifty/100)*(over_fifty/100))/Math.log(6)*100
    
    //Inverse
    let diversity = 100 - (shanon_age + shanon_gender)/2

    let equity = 100 - shanon_age

    let education = (-0.4422671 + 1.422244*Math.exp(-0.01449828*access_to_education))*100

    if (education < 0) {
        education = 0
    }

    let i_topography = (topography + weather)/2

    let infrastructure = (energy + sanitation + water + connectivity + mobility)/5

    let economy = (jobs + ownership + city_dependant)/3

    let climate = (house_quality + weather + infrastructure)/3

    let i_within_cities = (i_topography + climate + infrastructure + economy)/4

    let physical_nature = (house_quality + materials + development_state)/3

    let density = (elevation + household_per_house)/2

    let demography = (diversity + equity + education)/3

    let prevalence = (popslum_per_country + economy + physical_nature + infrastructure + participation + security)/6

    let vulnerability = (weather + security + prevalence)/3

    let geography = topography*0.4 + i_within_cities*0.2 + climate*0.4

    let i_causes = (causes + geography)/2

    let origin = (i_causes + population)/2

    let dignity = (ownership + security + happiness + access_to_food + participation)/5

    let emotional_state = (economy + education + health + city_dependant + house_quality)/5

    let quality_life = (dignity + health + emotional_state)/3

    //Indicators

    //Site
    site = (origin + geography + vulnerability)/3

    //Architecture
    architecture = (physical_nature + infrastructure + density)/3

    //Populace
    populace = (economy + demography + quality_life)/3

    //Informality
    informality_indicator = (site + architecture + populace)/3
    console.log(informality_indicator)

    return {
        site: site,
        architecture: architecture,
        populace: populace,
        informality: informality_indicator
    };

}

module.exports.settlementAnalysis = settlementAnalysis;
    
    


