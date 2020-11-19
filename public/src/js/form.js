// const { info } = require("node-sass");





if($("#map").length != 0){ // if map exists, create it
  var map = L.map('map')
    .setView([0,0],3);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  	// attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  	subdomains: 'abcd',
  	maxZoom: 19
  }).addTo(map);

  var imagerylayer = L.esri.basemapLayer('Streets').addTo(map);
  var layerLabels;
  
  function setBasemap (basemap) {
    if (imagerylayer) {
      map.removeLayer(imagerylayer);
    }
  
    imagerylayer = L.esri.basemapLayer(basemap);
  
    map.addLayer(imagerylayer);
  
    if (layerLabels) {
      map.removeLayer(layerLabels);
    }
  
    if (
      basemap === 'ShadedRelief' ||
      basemap === 'Oceans' ||
      basemap === 'Gray' ||
      basemap === 'DarkGray' ||
      basemap === 'Terrain'
    ) {
      layerLabels = L.esri.basemapLayer(basemap + 'Labels');
      map.addLayer(layerLabels);
    } else if (basemap.includes('Imagery')) {
      layerLabels = L.esri.basemapLayer('ImageryLabels');
      map.addLayer(layerLabels);
    }
  }
  
  document
     
    .querySelector('#imagery')
    .addEventListener('click', function (e) {
      var basemap = "ImageryClarity";
      setBasemap(basemap);
    });
  document
    .querySelector('#streets')
    .addEventListener('click', function (e) {
      var basemap = "Streets"
      setBasemap(basemap);
    });

// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
// map.addLayer(editableLayers);

var drawPluginOptions = {
  // position: 'topright',
  draw: {
    // polygon:true,
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: false,
    },

  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true,
    edit:false
  },

};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

// var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);


var storeLayers = [];
map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;
  var coords = layer.editing.latlngs[0][0];
  console.log(coords);
  let string = `${coords[0].lat},${coords[0].lng}`;
  for (let i = 1; i< coords.length;i++){
    string+=`,${coords[i].lat},${coords[i].lng}` 
  }
  $("#coords").val(string);
  console.log(string);
  editableLayers.addLayer(layer);


  var seeArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);

  $("#area").val(`${seeArea}`);

});


map.on('draw:deleted', function(e) {
  $("#coords").val("");
  $("#area").val("");
});




// map.on('draw:edited', function(e) {
//   var type = e.layerType,
//     layer = e.layer._layers[0];
//   console.log(e);
//   var coords = layer.editing.latlngs[0][0];
//   console.log(coords);
//   let string = `${coords[0].lat},${coords[0].lng}`;
//   for (let i = 1; i< coords.length;i++){
//     string+=`,${coords[i].lat},${coords[i].lng}` 
//   }
//   $("#coords").val(string); 
// });

// let's start drawing markers here

  // var marker = null;

  // map.on('click',function(e){
  //   console.log(e.target)
    //  lat = e.latlng.lat;
    //  lon = e.latlng.lng;

    //  if(marker == null) marker = L.marker([lat,lon]).addTo(map);
    //  else marker.setLatLng(e.latlng);

    //  // Set coordinate field
    //  $("#coords").val(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);

     // Prefill country values
     // $.get(`/api/get-country?lat=${lat}&lon=${lon}`, function(data) {
     //   $("input[name='country']").val(data);
     // });
  // });
}

function goToSection(i){
  // $("#sidebar a").removeClass("active");
  // $("form section").addClass("is-hidden");

  // $("#sidebar > a:nth-of-type(" + i + ")").addClass("active");
  // $("form section:nth-of-type(" + i + ")").removeClass("is-hidden");
 console.log(i);
 if (i==0) {
  window.scrollTo(0,0);
 } else if (i==1){
  window.scrollTo(0,2100);

 }else{ 
  window.scrollTo(0,4600);
 }}


function showInfo(info){

  $("#info").show();
  $("#info h1").text(`${info.header}: `);
  $("#info p").text(`${info.text}`);
}

function closeModal(){
  $("#previous-modal-div").hide();
}


// Add Google translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

// Icon Button Handlers
function hideAll(){
  $("#info").hide();
  $("#comment").hide();
  $("#link").hide();
  // $("#previous-modal-div").hide();
}


const infoClose = document.getElementById("close-info");
if(infoClose){
infoClose.addEventListener("click",()=>{
  $("#info").hide();

})
const commentClose = document.getElementById("close-comment");

commentClose.addEventListener("click",()=>{
  $("#comment").hide();

})

const linkClose = document.getElementById("close-link");

linkClose.addEventListener("click",()=>{
  $("#link").hide();

})
}




$(document).click(hideAll);
$(".box").click((e) => e.stopPropagation())

$(".alert-button").click(function(e){
  e.stopPropagation();
  hideAll();

  // let data = $(this).data();
  $("#info").show();
  // $("#info p").text(`${data.label}: ${data.info}`);
})


// function showInfo(data){

//   hideAll();
//   const infoDiv = document.getElementById("info");
//   if (info){
//   infoDiv.className = "info-div";
//   infoDiv.childNodes[1].innerText = data;
//   infoDiv.style="display:block!important;"
//   console.log(data);
//   }
  


// }

$(".comment-button").click(function(e){
  hideAll();
  e.stopPropagation();
  let data = $(this).data(),
      commentI = comments.findIndex((d) =>
         
      {
        // Add some clarifying information about this question, if necessary.
        // console.log("Form field name",d.formFieldName)
        document.getElementById("comment-input").innerText= `Feedback for the ${`"${data.name}"`} question`;
        d.formFieldName == data.name
      }
      
      
      )
  //Set value of input text based on what's stored in the database
  if(commentI == -1) $("#comment input.text").val("");
  else $("#comment input.text").val(comments[commentI].comment);
  $("#comment").show();
  $("#comment input.button").data(data); //Bind this current question's data to the input
  $("#comment .help").hide();

})




$(".link-button").click(function(e){
  hideAll();
  e.stopPropagation();
  

  let data = $(this).data(),
      linkI = links.findIndex((d) => {


        document.getElementById("link-input").innerText= `Insert a reference link for the ${`"${data.name}"`} question`;
        d.formFieldName == data.name
      
      
      })

  //Set value of input text based on what's stored in the database
  if(linkI == -1) $("#link input.text").val("");
  else $("#link input.text").val(links[linkI].link);

  $("#link").show();
  $("#link input.button").data(data); //Bind this current question's data to the input
  $("#link .help").hide();
})


// $(".chat-button").click(function(e){
//   e.stopPropagation();
//   hideAll();
//   let data = $(this).data(),
//       linkI = links.findIndex((d) => d.formFieldName == data.name)
//   //Set value of input text based on what's stored in the database
//   if(linkI == -1) $("#chat input.text").val("");
//   else $("#chat input.text").val(links[linkI].link);

//   $("#chat").show();
//   $("#chat input.button").data(data); //Bind this current question's data to the input
//   $("#chat .help").hide();
// })



function saveComment(){
  let data = $("#comment input.button").data(),
      comment = $("#comment input.text").val();

  // Save new comment to server
  $.post(`${data.url}/comment`, {email: data.email, comment: comment, formFieldName: data.name}, function(res) {
    $("#comment .help").show();

    // Save new comment for this browser session
    let commentI = comments.findIndex((d) => d.formFieldName == data.name);
    if(commentI == -1) comments.push({
      formFieldName: data.name,
      comment: comment
    })
    else comments[commentI].comment = comment;

  });
}



function saveLink(){
  let data = $("#link input.button").data(),
      link = $("#link input.text").val();

  $("#link .help").hide();

  let isLink = (link) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(link);
  }

  if(!isLink(link)) $("#link .help.is-danger").show();
  else $.post(`${data.url}/link`, {email: data.email, link: link, formFieldName: data.name}, function(res) {
    $("#link .help.is-success").show();

    // Save new link for this browser session
    let linkI = links.findIndex((d) => d.formFieldName == data.name);
    if(linkI == -1) links.push({
      formFieldName: data.name,
      link: link
    })
    else links[linkI].link = link;
  });
}

$(document).on("focusin", "#coords", function() {
  $(this).prop('readonly', true);  
});

$(document).on("focusout", "#coords", function() {
  $(this).prop('readonly', false); 
});


$(document).on("focusin", "#area", function() {
  $(this).prop('readonly', true);  

});

$(document).on("focusout", "#area", function() {
  $(this).prop('readonly', false); 
});
const modalDiv = document.getElementById("modal-div");
// const previousModalDiv = document.getElementById("previous-modal-div");
// const continueButton = document.getElementById("continue-button");
// continueButton.addEventListener("click",()=>{
//    modalDiv.className = "modal-container"

// });

const startButton = document.getElementById("start-button");
if (startButton){
startButton.addEventListener("click",()=>{

  validateForm();
});
}

function validateForm(){

 const coords = document.getElementById("coords");
 const area = document.getElementById("area");
//  console.log(area);
if (coords) {
  if ((coords.value=="")||(area.value=="")){
    // console.log("alert message");
    alert("Please make sure you have drawn coords on the map");
    // break;
  }
}

}

window.addEventListener("click",(ev)=>{

  if ((ev.target !== modalDiv)) {
    modalDiv.className = "modal-container-hide";
  }

});

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function validateInput(id){

  
  // const cell = document.getElementById(id);
  
  let input  =parseInt(id.value);
  // console.log(cell)
  console.log(input);

  // console.log("this is my",e);

  if (isNaN(input)){
    alert("Please enter a valid input");
    id.value = ""

  }
  else if (0>input || input>10){ 
    alert("Please Enter a value less than 10 and greater than 0");
    id.value = ""
  }



}





function validateUpdateInput(id){

  const cell = document.getElementById(id);

  let input  =parseInt(cell.value);
  // console.log(cell)
  // console.log(input);

  // // console.log("this is my",e);

  if (isNaN(input)){
    alert("Please enter a valid input");
    cell.value = ""

  }
  else if (0>input || input>100){ 
    alert("Please Enter a value less than 100 and greater than 0");
    cell.value = ""
  }

}

const editPreviousButton = document.getElementById("edit-previous-button");

if (editPreviousButton){
  
  editPreviousButton.addEventListener("click",()=>{
    const previousModalDiv = document.getElementById("previous-modal-div");
    previousModalDiv.className = "previous-modal-container";
    $("#previous-modal-div").show();
  })
}

function editRangeLabels(info){
  let id = info.id


  let options = info.options
  const slider = document.getElementById(id);
  const label1 =  document.getElementById(id+"-label1");
  const label2 =  document.getElementById(id+"-label2");
  let input  =parseInt(slider.value);
  label1.innerText = options[parseInt(input)][1]
  label2.innerText = options[parseInt(input)][0]

  // console.log(options[parseInt(input)]);
  

  // return "showRange"
}