const fetch = require ("node-fetch")
async function getData() {
    const countries = fetch('http://localhost:3000/api/countries').then(response=>{return response})
    console.log(countries);
}
getData()

/*const fetch = require("node-fetch");
async function getResult(connection, data) {
    try {
      console.log("Processing POST Loan.");
      const res = fetch('http://localhost:3000/api/countries')
      console.log("Status: ", res.status);
      console.log("StatusText: ", res.statusText);
      return res.json();
   }
   catch(err) { 
    throw err
    }
}
let countries = getResult()
console.log(countries)*/