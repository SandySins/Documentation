//using Haversine formula
var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6371; // Earth’s mean radius in km
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = Math.round((R * c) * 100 )/ 100;
  return d; // returns the distance in Km
};
let p1={
  lat:23.370179319836367,
  lng:85.32126183513566
}

let p2={
  lat:23.38986572331898,
  lng:85.33371812623749
}
setInterval(() => {
  let a=getDistance(p1,p2)
console.log(a,"Km")
let avgSpeed= 15;
let time=Math.round((a/avgSpeed) * 100) / 100 * 60;
console.log(time,"Min")
}, 3000);
