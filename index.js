  var map = L.map('map', {
      center: [48,14],
      zoom: 7,
     animate: true, duration: 1
  });
  
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
     maxZoom: 18,
     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

  markerLayer = L.layerGroup([]).addTo(map);
   
  function createMarker(coords, title, info, image, source) {
    var marker, content;
  
    content = '<b><font size="6">' + title + '</font></b><br/>' + info + '<br> <img src="' + image + '"><a href="' + source + '" target="_blank"><button>Source</button></a>'
    marker = L.marker(coords).addTo(markerLayer);
    marker.bindPopup(content);
    
    marker.on('click', function(evt) {
      var id = L.Util.stamp(evt.target);
      if (document.getElementById(id) != null) return; 
      var sidebarElement, infoPart, removePart;
      sidebarElement = L.DomUtil.create('div', 'sidebarElement', document.getElementById('sidebar'));
      sidebarElement.id = id;
      infoPart = L.DomUtil.create('div', 'infoSidebarElement', sidebarElement);
      infoPart.innerHTML = content;
      L.DomEvent.on(infoPart, 'click', function(evt) {
        var marker = markerLayer.getLayer(this.id);
        marker.closePopup();
        map.panTo(marker.getLatLng());
        marker.bounce(3);
      }, sidebarElement);
      removePart = L.DomUtil.create('div', 'removeSidebarElement', sidebarElement);
      removePart.innerHTML = 'Remove';
      L.DomEvent.on(removePart, 'click', function(evt) {
        markerLayer.getLayer(this.id).closePopup();
        this.parentNode.removeChild(this);
      }, sidebarElement);
    });
  }
  
  createMarker([49, 14], 'Title 1', 'Info 1', '', ''); 
  createMarker([47, 12], 'Title 2', 'Info 2', '', ''); 
