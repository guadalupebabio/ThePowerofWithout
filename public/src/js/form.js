var map = L.map('map')
  .setView([0,0],3);

L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=AlLtvbLyE9OnbQNyl7PF', {attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}).addTo(map);

function goToSection(i){
  $(".column:first-child a").removeClass("active");
  $("form section").addClass("is-hidden");
  $(".column:nth-child(3) section").addClass("is-hidden");

  $(".column:first-child a:nth-of-type(" + i + ")").addClass("active");
  $("form section:nth-of-type(" + i + ")").removeClass("is-hidden");
  $(".column:nth-child(3) section:nth-of-type(" + i + ")").removeClass("is-hidden");
}
