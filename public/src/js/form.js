


// const firebase = require("firebase")

// const firebaseConfig = {
//   apiKey: "AIzaSyAY4TLs19RV3dQdhmMW5NplTw4sxxc-izY",
//   authDomain: "the-power-of-without.firebaseapp.com",
//   projectId: "the-power-of-without",
//   storageBucket: "the-power-of-without.appspot.com",
//   messagingSenderId: "436165625393",
//   appId: "1:436165625393:web:33cf6b8c45399b1d75b710",
//   measurementId: "G-YCLSSE2FL6"
// };

// // Get a reference to the storage service, which is used to create references in your storage bucket
// firebase.initializeApp(firebaseConfig)


// Imports the Google Cloud client library.


function drawMap(mapID){
    const myMap = document.getElementById(mapID);
    if(myMap){ // if map exists, create it
      var map = L.map(mapID)
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
          console.log("I have clicked imagery")
          setBasemap(basemap);
        });
      document
        .querySelector('#streets')
        .addEventListener('click', function (e) {
          var basemap = "Streets"
          console.log("I have clicked streets")
          setBasemap(basemap);
        });

     var imageryButton = document.getElementById("imagery");
     var streetsButton = document.getElementById("streets");

     if (imageryButton){
     imageryButton.addEventListener("click",()=>{

        console.log("I have clicked imagery")

     })
    }

    if (streetsButton){
      streetsButton.addEventListener("click",()=>{

        console.log("I have seen streets")
      })
    }

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

  }

var maps = ["map-mobile","map"]
// var maps = ["map"]

for (let i = 0 ; i < maps.length; i++) {
   drawMap(maps[i]);
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

  // console.log("i did receive",info);

  hideAll(info.id);
  $(`#${info.id}-info`).show();
  $(`#${info.id}-info h1`).text(`${info.header}: `);
  $(`#${info.id}-info p`).text(`${info.text}`);

}

function closeModal(){
  $("#previous-modal-div").hide();
}


// Add Google translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

// Icon Button Handlers
function hideAll(id){

  // console.log("im hiding",id)
  //  id.hide();
  
  var infoBox = document.getElementById(`${id}-info`);
  var commentBox = document.getElementById(`${id}-comment`);
  var linkBox = document.getElementById(`${id}-link`);

  if (infoBox){
    infoBox.style ="display:none;"
  }

  if (commentBox){
    commentBox.style = "display:none;"
  }

  if (linkBox){
    linkBox.style = "display:none;"
  }

  // if ($(`#${id}-info`)){
  //   $(`#${id}-info`).hide();
  // }
  // if ($(`#${id}-comment`)){
  //   $(`#${id}-comment`).hide();
  // }
  // if($(`#${id}-link`)){
  //   $(`#${id}-link`).hide();
  // }


  // $("#previous-modal-div").hide();
}


function onClose(id){
  console.log("I clicked on close");
  $(`#${id}`).hide();

}


// const infoClose = document.getElementById("close-info");
// if(infoClose){
// infoClose.addEventListener("click",()=>{
//   $("#info").hide();

// })
// const commentClose = document.getElementById("close-comment");

// commentClose.addEventListener("click",()=>{
//   $("#comment").hide();

// })

// const linkClose = document.getElementById("close-link");

// linkClose.addEventListener("click",()=>{
//   $("#link").hide();

// })
// }




$(document).click(hideAll);
$(".box").click((e) => e.stopPropagation())

$(".alert-button").click(function(e){
  e.stopPropagation();
  hideAll();

  // let data = $(this).data();
  $("#info").show();
  // $("#info p").text(`${data.label}: ${data.info}`);
})



// $(".comment-button").click(function(e){
//   hideAll();
//   e.stopPropagation();
//   let data = $(this).data(),
//       commentI = comments.findIndex((d) =>      
//       {
//         // Add some clarifying information about this question, if necessary.
//         // console.log("Form field name",d.formFieldName)
//         document.getElementById("comment-input").innerText= `Feedback for the ${`"${data.name}"`} question`;
//         d.formFieldName == data.name
//       }   
//       )
//   //Set value of input text based on what's stored in the database
//   if(commentI == -1) $("#comment input.text").val("");
//   else $("#comment input.text").val(comments[commentI].comment);
//   $("#comment").show();
//   $("#comment input.button").data(data); //Bind this current question's data to the input
//   $("#comment .help").hide();

// })

// $(".link-button").click(function(e){
//   hideAll();
//   e.stopPropagation();
  

//   let data = $(this).data(),
//       linkI = links.findIndex((d) => {
//         document.getElementById("link-input").innerText= `Insert a reference link for the ${`"${data.name}"`} question`;
//         d.formFieldName == data.name
//       })

//   //Set value of input text based on what's stored in the database
//   if(linkI == -1) $("#link input.text").val("");
//   else $("#link input.text").val(links[linkI].link);

//   $("#link").show();
//   $("#link input.button").data(data); //Bind this current question's data to the input
//   $("#link .help").hide();
// })


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



function showComment(data){

  // console.log(data)
  hideAll(data.id);
  document.getElementById(`${data.id}-comment-input`).innerText= `Feedback for the ${`"${data.name}"`} question`;
  console.log(comments)
  let commentI = comments.findIndex((d) =>      
  {
    // Add some clarifying information about this question, if necessary.
    // console.log("so it's nothing",document.getElementById(`${data.id}-comment-input`).innerText)
    
    return d.formFieldName == data.name

  }   
  )
  console.log(commentI)
    //Set value of input text based on what's stored in the database
    if(commentI == -1)$(`${data.id}-comment input.text`).val("");
    else $(`#${data.id}-comment input.text`).val(comments[commentI].comment);
    $(`#${data.id}-comment`).show();
    $(`#${data.id}-comment input.button`).data(data); //Bind this current question's data to the input
    $(`#${data.id}-comment .help`).hide();

}

function showLink(data){
 
  hideAll(data.id);
  document.getElementById(`${data.id}-link-input`).innerText= `Insert a reference link for the ${`"${data.name}"`} question`;

  let linkI = links.findIndex((d) => {

    return d.formFieldName == data.name
  })

    //Set value of input text based on what's stored in the database
    if(linkI == -1) $(`${data.id}-link input.text`).val("");
    else $(`#${data.id}-link input.text`).val(links[linkI].link);

    $(`#${data.id}-link`).show();
    $(`#${data.id}-link input.button`).data(data); //Bind this current question's data to the input
    $(`#${data.id}-link .help`).hide();
}


function showChat(data){

  hideAll(data.id)
  console.log("these are the images",images)
  let imageI = images.findIndex((d) => {
    return d.formFieldName == data.name
  })

  if(imageI==-1){
    console.log("no images")
  }else{
    console.log("there's an image",images[imageI].image)

    let imagesUrls = images[imageI].image;

    if (imagesUrls.length>0){

      var currentImagesContainer = document.getElementById(`${data.id}-current-images`)
      if (currentImagesContainer.hasChildNodes()){
        while (currentImagesContainer.firstChild) {
          currentImagesContainer.removeChild(currentImagesContainer.firstChild);
      }
      }

      for (let index=0;index<imagesUrls.length;index++){

        let img = imagesUrls[index];
        // console.log(img.url)

        var thumbNailContainer = document.createElement("div");
        thumbNailContainer.style=`
        display:flex;
        flex-direction:row;
        justify-content:space-around;
        height: 175px;
        `
        
        var thumbnail = document.createElement("div");
        thumbnail.id = `${data.id}-image-${index}`
        thumbnail.style=`
          background-image:url("${img.url}");
          background-size:100%;
          background-repeat:no-repeat;
          width:150px;
          height:150px; 
        `
    
        var thumbnailClose = document.createElement("div");
        thumbnailClose.innerText ="Delete"
        thumbnailClose.style = `
          background-color:black;
          height:25px;
          color:white;
          font-size:15px;
          font-weight:bold;
          text-align:center;
          border-radius:5px;
          width:80px;  
          `
        
        thumbnailClose.addEventListener("click",()=>{

          currentImagesContainer.removeChild(thumbNailContainer);
          // console.log(`${data.url}/deleteimg`)
          $.post(`${data.url}/deleteimg`, {email: data.email, imageUrl:img.url, imageName:img.name, formFieldName: data.name}, function(res) {

          })
 

        })
    
        thumbNailContainer.appendChild(thumbnail)
        thumbNailContainer.appendChild(thumbnailClose);

        currentImagesContainer.appendChild(thumbNailContainer);

      }
    }

   











  }



    //Set value of input text based on what's stored in the database
    // if(chatI == -1) $(`${data.id}-link input.text`).val("");
    // else $(`#${data.id}-link input.text`).val(links[linkI].link);



    $(`#${data.id}-chat`).show();
    // $(`#${data.id}-link input.button`).data(data); //Bind this current question's data to the input
    $(`#${data.id}-chat .help`).hide();




}



function saveComment(data){
  // console.log("I clicked on save Comment",data)
  // let data = $(`#${data.id}-comment input.button`).data(),
  //     comment = $(`#${data.id}-comment input.text`).val();

  let comment = document.getElementById(`${data.id}-comment-input-text`).value

      // let data = $(`#${data.id}-comment input.button`).data(),
      // comment = $(`#${data.id}-comment input.text`).val();
  // Save new comment to server
  $.post(`${data.url}/comment`, {email: data.email, comment: comment, formFieldName: data.name}, function(res) {
    $(`#${data.id}-comment p.help.is-success`).show();

    // Save new comment for this browser session
    let commentI = comments.findIndex((d) => d.formFieldName == data.name);
    if(commentI == -1) comments.push({
      formFieldName: data.name,
      comment: comment
    })
    else comments[commentI].comment = comment;

  });
}



function saveLink(data){
  
  // let data = $(`#${data.id}-link input.button`).data(),
  //     link = $(`#${data.id}-link input.text`).val();

  let link = document.getElementById(`${data.id}-link-input-text`).value



  // console.log(link)

  // console.log(data)

  // $(`#${data.id}-link .help`).hide();

  let isLink = (link) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(link);
  }

  // console.log("the link is true,", isLink)

  if(!isLink(link)){$(`#${data.id}-link .help.is-danger`).show()}
  else {
        $(`#${data.id}-link .help.is-danger`).hide();
       $.post(`${data.url}/link`, {email: data.email, link: link, formFieldName: data.name}, function(res) {
      $(`#${data.id}-link .help.is-success`).show();

    // Save new link for this browser session
    let linkI = links.findIndex((d) => d.formFieldName == data.name);
    if(linkI == -1) links.push({
      formFieldName: data.name,
      link: link
    })
    else links[linkI].link = link;
  });
}
}

function onchangePreview(id){
  const imageInput = document.getElementById(`${id}-chat-input-file`)
  if (imageInput.files.length > 0){
    var uploadedImage =imageInput.files[0];

    var blobToTransfer = URL.createObjectURL(uploadedImage);
    var previewContainer = document.getElementById(`${id}-preview`)
    previewContainer.style=
    ` background-image:url(${blobToTransfer});
      display:block;
      background-size:100%;
      background-repeat:no-repeat;
      width : 250px;
      height: 250px;

  `
  }
}

function saveImage(data){

  // $.post(`${data.url}/image`, {email: data.email, file:data.id, formFieldName: data.name}, function(res) {
  //   // $(`#${data.id}-link .help.is-success`).show();

  //   // Save new link for this browser session
  //   // let linkI = links.findIndex((d) => d.formFieldName == data.name);
  //   // if(linkI == -1) links.push({
  //   //   formFieldName: data.name,
  //   //   link: link
  //   // })
  //   // else links[linkI].link = link;
  // });

  const imageInput = document.getElementById(`${data.id}-chat-input-file`)
  if (imageInput.files.length > 0){
    var uploadedImage =imageInput.files[0];





    var formData = new FormData()

    formData.append('email', data.email)
    formData.append('file',uploadedImage)
    formData.append('imageName',uploadedImage.name)
    formData.append('formFieldName',data.name)

  
    $.ajax({
      url: `${data.url}/image`, 
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
          console.log(data);
      }
  });




    // $.post(`${data.url}/image`, {email: data.email, file:uploadedImage, imageName:uploadedImage.name, formFieldName: data.name}, function(res) {
        
            // console.log("this is the response",res)
    // $(`#${data.id}-link .help.is-success`).show();

    // Save new link for this browser session
    // let linkI = links.findIndex((d) => d.formFieldName == data.name);
    // if(linkI == -1) links.push({
    //   formFieldName: data.name,
    //   link: link
    // })
    // else links[linkI].link = link;


  // });

    // console.log(storage)
    // var storage =  firebase.storage()

    // console.log(uploadedImage)



  }
  

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

  let validated = validateForm();
  if (validated){
    var modal = document.getElementById("modal-div");
    modal.style=`
    
    height: 80%;
    width: 80%;
    display: flex!important;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem;
    z-index: 99999;
    top: 10%;
    bottom: 10%;
    left: 10;
    right; 10;
    position: fixed;
    background-color: white;
    border: 1px solid black;`
  }

  // modal.className = "modal-container";
  // console.log(modal.classList)
  // modal.style="display:block!important"


  // let validated = validateForm();
  // if (validated){
  //   var modal = document.getElementById("modal-div");
  //   console.log(modal)
  //   // modal.classList.toggle("modal-container");
  //   modal.className = "modal-container";
  //   modal.classList.remove("modal-container-hide")
  //   document.getElementById("modal-div").className="modal-container"
  //   // console.log("I changed")
  
  // }
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
      return false;
    }else{

      return true
    }
  }
  return false

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


}


var hamburgerMenu = document.getElementById("nav-hamburger-menu");
if (hamburgerMenu){  
  hamburgerMenu.addEventListener("click",()=>{
    var blackMobileMenuLinks = document.getElementById("black-mobile-links");

    if (blackMobileMenuLinks){
      blackMobileMenuLinks.classList.toggle("black-collapsed-links");
    }

  });
}