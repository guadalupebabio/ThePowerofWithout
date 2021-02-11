 const sectionDataContainer = {
    header: "fill-in-form",
    sections: [
      {
        label: "Name of the City",
        name: "city",
        type: "text",
        value: "City",
      },
      {
        label: "Name of Informal Community",
        name: "settlement",
        type: "text",
        value: "Community",
      },
      {
        label: "Draw area on the map (Use polygon shape)",
        name: "geolocation",
        type: "coords",
        value: "Draw area",
        map: "map"
      },
      {
        label: "Community Area",
        name: "area",
        type: "area",
        value: "Area",
      },
      {
        label: "Email Address",
        name: "email",
        type: "text",
        value: "somebody@example.com",
      },
      {
        label: "Privacy Statement",
        name: "privacy-checkbox",
        type: "checkbox",
        options: [
          "Keep me informed about updates of the Power of Without research and website. You can unsubscribe at any time.",
        ],
      },
    ],
  };


  const modalData = {

    description:
      "Thank you for taking the time to fill the survey!  When you continue to the next section,\
       an email will be sent to your account with a link that will allow you to complement or update your responses at any time after you close this window.\
      This is the fist time we are sharing this platform so we very much appreciate any feedback that will help us improve our work.\
       Since every question informs a different part of the taxonomy it is very important that we ask for feedback on each one individually, but \
       this questions are optional. You will be finding along with each questions a series of icons that represent the following and whose responses are unequly \
       link to the question they belong to.",
    icons: [
      {
        image: "../assets/error_outline_24px.png",
        description: "Defines what it is asked in the questions",
      },
      {
        image: "../assets/chat_24px.png",
        description: "Provide feedback about the question (relevance, accuracy, ect) ",
      },

      {
        image: "../assets/link_24px.png",
        description: "Paste any link or reference that might be relevant or informed your response",
      },

      {
        image: "../assets/add_photo_alternate_24px.png",
        description: "Attached a picture if it can be used to back up the reponse provided (not available)",
      },
    ],
  };


  const previousSettlementModal = [

    {
      label: "Name of the Informal Settlement",
      name: "settlement",
      id : "informal-settlement-id",
      type: "text",
      placeholder: "Lomas del Centinela",
    },
    {
      label: "Name of the City",
      name: "city",
      placeholder: "Guadalajara",
      id : "city-id",
      type: "text",
      value: "Settlements",
    },
    {
      label: "Email Address",
      name: "email",
      id:"email-id",
      type: "text",
      placeholder: "somebody@example.com",

    }

  ]

  const aboutPageData = [
    {
      label :  "MISSION",
      info : "As the world moves towards urbanization, cities are becoming \
      increasingly complex. By 2050, about 70% of the world's population is expected to live in urban areas, \
      projected to reach 6.3 billion people. To keep up with the growing urban population, traditional infrastructure \
      systems are estimated to cost $57-trillion. Few experts anticipate that this is even remotely possible and that \
      new strategies are needed. The cost of conventional infrastructure would exceed the combined annual GDP of the USA, \
      China, and Europe, and 90% of this urbanization will be in Africa and Asia."


    },   
     {
      label :  "METHOD",
      info :  "We must find new solutions to meet the complex challenges of the future. \
      We pose an opportunity to rethink current models and invent new systems and strategies for a more livable, equitable, and resilient future.\
      The qualities of informal communities can vary greatly from country to country. Therefore,\
       informality is difficult to understand and quantify, which makes it even harder to comprehend. \
       We want to leverage the tools and our expertise to understand the cities of today and tomorrow.\
        To better understand and study informal settlements and communities, our team has developed a taxonomy of \
        existing taxonomies of informality. This taxonomy is further understood using a series of qualitative and quantitative questions \
        that are answered by the stakeholders on each community to understand both the strengths of each community and their challenges. Moreover, \
        since those who live and work in these communities are the true experts, we think this task should be crowdsourced."

    },
    {
      label : "MEANS",
      info : "Content, Tools & Data to understand informlaity"
    },
    {
      label : "WHO WE ARE",
      info : "Kent Larson and the City Science group proposes that new strategies must be found to create the places where people live and work in addition to the mobility systems that connect them,\
       in order to meet the profound challenges of the future. The scale and rate of urban expansion in the global south is creating challenges for unplanned and informal communities.\
        This is a critical challenge that will impact a large number of cities and segments of the global population.\
      Since last year, we’ve been researching and building the tools that are displayed on this website as a sum-up of our research on informlaity.\
       This platform in particular will help individuals advocate for themselves and raise awareness. We’ve spent the last few weeks changing gears\
        to be able to quickly launch this tool that will help people most unheard but those who should play the main role in this conversation"
    },
    {
      label : "GET IN TOUCH",
      info : "informality@media.mit.edu"

    },

  ]


const finalSurveyData = {
     header : "final-survey",
     appreciationMessage1 : "Thank you again for taking the time to fill the survey!  Whenever you want you can edit, complement, or update your responses with the link that has been sent to your email account.",
     appreciationMessage2:`Finally, since you are among the first people to test this platform we will require an extra 2 minutes from your time to give us general feedback of the survey. Please be as honest as you can so we can improve it for the next users.`,
     appreciationMessage3:  `Thank you again, and let’s keep in touch!`,
     appreciationMessage4: "Guadalupe, Maitane and Luis.",
     appreciationMessage5:`The City Science Team`,
     questions:[
       {
      name:"What is your relationship with the settlement?",
      id:"settlementRelationship",
      type:"radio",
      options: ["I live there", "I work there", "I go at least once a week", "I go occasionally"," I work in an organisation/ institution/ NGO that has connection with the settlement","Other"],
      info:"",
      value:""
    },
    {
      name:"How do you call informal settlements",
      id:"informalSettlementName",
      type:"text",
      value:"",
      info:"Could be in your native language",
      placeholder:"Your Comment"
    },
    {
      name:"How would you define informal settlements",
      type:"text",
      id:"informalSettlementDefinition",
      value:"",
      info:"Could be in your native language",
      placeholder:"Your Comment"
    },
    
    {
      name:"How long did it take you to fill the survey",
      type:"range",
      id:"surveyFillInDuration",
      value:"",
      options:["5mins or less", "10mins", "20mins or more"],
      info:"Make a rough estimate"
    },
    {
      name:"How relevant were the questions asked?",
      type:"range",
      id:"surveyRelevance",
      value:"",
      info:"",
      options:["Irrelevant","Relevant"],
      
    },
    {
      name:"General Feedback",
      type:"text",
      id:"generalFeedBack",
      value:"",
      options:"",
      info:"",
      placeholder:"Your Comment"
    },
    {
      name:"How would you rate the importance of these aspects to measure informality?",
      type:"grid",
      id:"gridData",
      options:[
      [{label:"Origin",id:"originImportanceScale"},{label:"Physical Nature",id:"physicalNatureImportanceScale"},{label:"Quality of Life",id:"qualityOfLifeImportanceScale"}],
      [{label:"Geography",id:"geographyImportanceScale"}, {label:"Infrastructure",id:"infrastructureImportanceScale"},{label:"Economy",id:"economyImportanceScale"}],
      [{label:"Vulnerability",id:"vulnerabilityImportanceScale"}, {label:"Density",id:"densityImportanceScale"},{label:"Demography",id:"demographyImportanceScale"}]]
      
    }  
  ]

}
 module.exports = {finalSurveyData,aboutPageData,sectionDataContainer,modalData,previousSettlementModal}



        // Architecture


        // Population
        // [
        //   {
        //     label: "Health Care: Percentage of people that has access to health care",
        //     name: "populaceHealthCare",
        //     type: "radio",
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     value: getFormValue(["populace", "accessToHealthCare"]),
        //   },
        //   {
        //     label: "Number of hospitals, clinics or health cares in the Settlement",
        //     name: "populaceHospitals",
        //     type: "text",
        //     value: getFormValue(["populace", "numberHospitals"]),
        //   },
        //   {
        //     label: "Education: Percentage of people that has access to schools/ Percentage of people attending to schools",
        //     name: "populaceEducation",
        //     type: "radio",
        //     options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //     value: getFormValue(["populace", "accessToEducation"]),
        //   },
        //   {
        //     label: "Number of schools in the settlement",
        //     name: "populaceSchools",
        //     type: "text",
        //     value: getFormValue(["populace", "numberSchools"]),
        //   },
        //   {
        //     label: "Proximity to public areas or leisure activities",
        //     name: "populacePublicAreas",
        //     type: "radio",
        //     options: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"],
        //     value: getFormValue(["populace", "publicAreas"]),
        //   },
        //   {
        //     label: "Unemployment rate",
        //     name: "populaceUnemploymentRate",
        //     type: "text",
        //     value: getFormValue(["populace", "unemploymentRate"]),
        //   },
        //   {
        //     label: "Ownership: Level of rights that the householder has on possessing the land at the Settlement",
        //     name: "populaceOwnership",
        //     type: "radio",
        //     options: ["Community/city property", "Private house", "Illegal"],
        //     value: getFormValue(["populace", "ownershipRights"]),
        //   },
        //   // {
        //   //   label: "Ethnic and racial categories in the Settlement",
        //   //   name: "populaceEthnic",
        //   //   type: "text",
        //   // },
        //   // {
        //   //   label: "Demography: Percentage of people in each age groups in the Settlement",
        //   //   name: "populaceDemography",
        //   //   type: "text",
        //   // },
        // ]
        // ];
        // let sections = [
        //   // Site
        //   [
        //     {
        //       label: "Origin",
        //       name: "siteOriginCauses",
        //       type: "radio",
        //       options: ["Squatting", "Refugee Camp", "Illegal Subdivision", "Other"],
        //       value: getFormValue(["site", "origin", "causes"]),
        //       info: "Historical evolution of the settlement"
        //     },
        //     {
        //       label: "Continent",
        //       name: "siteOriginGeolocation",
        //       type: "radio",
        //       value: getFormValue(["site", "origin", "geolocation"]),
        //       options: ['Africa', 'Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Antarctica']
        //     },
        //     {
        //       label: "Population",
        //       name: "siteOriginPopulation",
        //       value: getFormValue(["site", "origin", "population"]),
        //       type: "text",
        //     },
        //     {
        //       label: "Topography",
        //       name: "siteGeographyTopography",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "topography"]),
        //       options: ["By the coast", "Desert", "Valley", "Mountain", "Forest", "Water"],
        //       info: "Geographical features of the location of the Settlement "
        //     },
        //     {
        //       label: "Within cities",
        //       name: "siteGeographyWithinCities",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "withinCities"]),
        //       options: ["Squatting on the fringe", "In the path of development", "In the heart of the city", "Along railway tracks", "Residential centers", "Suburban industrial areas", "Old city slum"],
        //       info: "Relationship between the settlement geolocation and the city of reference"
        //     },
        //     {
        //       label: "Climate",
        //       name: "siteGeographyClimate",
        //       type: "radio",
        //       value: getFormValue(["site", "geography", "climate"]),
        //       options: ["Tropical (Type A)", "Arid (Type B)", "Temperate (Type C)", "Continental (Type D)", "Polar (Type E)"]
        //     },
        //     {
        //       label: "Security",
        //       name: "siteVulnerabilitySecurityCrimeRate",
        //       type: "range",
        //       value: getFormValue(["site", "vulnerability", "security", "crimeRate"]),
        //       options: ["Low crime rate", "Moderate crime rate", "High crime rate"],
        //       info: "Level of crime and insecurity in the Settlement"
        //     },
        //   ],

        //   // Architecture
        //   [
        //     {
        //       label: "House quality",
        //       name: "architecturePhysicalNatureHouseQuality",
        //       type: "radio",
        //       value: getFormValue(["architecture", "physicalNature", "houseQuality"]),
        //       options: ["Inadequate", "Suitable", "Optimal"]
        //     },
        //     {
        //       label: "Materials from which the house in the Settlement is made with",
        //       name: "architecturePhysicalNatureMaterials",
        //       type: "checkbox",
        //       value: getFormValue(["architecture", "physicalNature", "materials"]),
        //       options: ["Mud", "Brick", "Wood", "Concrete", "Corrugated sheet", "Tarpaulin", "Tiles", "Other"],
        //     },
        //     {
        //       label: "Development State",
        //       name: "architecturePhysicalNatureDevelopmentState",
        //       type: "radio",
        //       value: getFormValue(["architecture", "physicalNature", "developmentState"]),
        //       options: ["Initial occupancy", "Transitional", "Establish"],
        //       info: "Stage of the evolution process where the Settlement is into"
        //     },
        //     {
        //       label: "Access to Energy",
        //       name: "architectureInfrastructureAccessEnergy",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToEnergy"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to power/electricity in the Settlement"
        //     },
        //     {
        //       label: "Access to Water",
        //       name: "architectureInfrastructureAccessWater",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToWater"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to drinking water in the Settlement"
        //     },
        //     {
        //       label: "Access to Sanitation",
        //       name: "architectureInfrastructureAccessSanitation",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToSanitation"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of dwellings that have access to sanitation in the Settlement"
        //     },
        //     {
        //       label: "Access to Internet or Phone Fare",
        //       name: "architectureInfrastructureAccessInternet",
        //       type: "radio",
        //       value: getFormValue(["architecture", "infrastructure", "accessToInternetOrPhoneFare"]),
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       info: "Percentage of people that has access to data-plans or phone fare"
        //     },
        //     {
        //       label: "Mobility systems",
        //       name: "architectureMobility",
        //       type: "checkbox",
        //       value: getFormValue(["architecture", "infrastructure", "mobilitySystems"]),
        //       options: ["Walk", "Bike", "Car", "Public transportation"],
        //       info: "Mobility systems used by the people in the Settlement"
        //     },
        //     {
        //       label: "Average number of floors in the buildings",
        //       name: "architectureDensityElevation",
        //       type: "radio",
        //       value: getFormValue(["architecture", "density", "averageFloors"]),
        //       options: ["1", "2", "3", ">3"]
        //     },
        //     {
        //       label: " Number of people living in a house",
        //       name: "architectureDensityHouseholdPerHouseSize",
        //       value: getFormValue(["architecture", "density", "householdPerHouseSize"]),
        //       type: "text"
        //     },
        //   ],

        //   // Population
        //   [
        //     {
        //       label: "Health Care: Percentage of people that has access to health care",
        //       name: "populaceHealthCare",
        //       type: "radio",
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       value: getFormValue(["populace", "accessToHealthCare"]),
        //     },
        //     {
        //       label: "Number of hospitals, clinics or health cares in the Settlement",
        //       name: "populaceHospitals",
        //       type: "text",
        //       value: getFormValue(["populace", "numberHospitals"]),
        //     },
        //     {
        //       label: "Education: Percentage of people that has access to schools/ Percentage of people attending to schools",
        //       name: "populaceEducation",
        //       type: "radio",
        //       options: ["0-10%", "10-25%", "25-50%", ">50%"],
        //       value: getFormValue(["populace", "accessToEducation"]),
        //     },
        //     {
        //       label: "Number of schools in the settlement",
        //       name: "populaceSchools",
        //       type: "text",
        //       value: getFormValue(["populace", "numberSchools"]),
        //     },
        //     {
        //       label: "Proximity to public areas or leisure activities",
        //       name: "populacePublicAreas",
        //       type: "radio",
        //       options: ["5 min walking distance", "5-20 min walking distance", ">20 min walking distance", "I need to take a car/public transportation"],
        //       value: getFormValue(["populace", "publicAreas"]),
        //     },
        //     {
        //       label: "Unemployment rate",
        //       name: "populaceUnemploymentRate",
        //       type: "text",
        //       value: getFormValue(["populace", "unemploymentRate"]),
        //     },
        //     {
        //       label: "Ownership: Level of rights that the householder has on possessing the land at the Settlement",
        //       name: "populaceOwnership",
        //       type: "radio",
        //       options: ["Community/city property", "Private house", "Illegal"],
        //       value: getFormValue(["populace", "ownershipRights"]),
        //     },
        //     // {
        //     //   label: "Ethnic and racial categories in the Settlement",
        //     //   name: "populaceEthnic",
        //     //   type: "text",
        //     // },
        //     // {
        //     //   label: "Demography: Percentage of people in each age groups in the Settlement",
        //     //   name: "populaceDemography",
        //     //   type: "text",
        //     // },
        //   ]
        // ];