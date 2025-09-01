const key = '71hxVyyr9sBdVKFsktTj';
const mapTag = document.getElementById("map");
const map = L.map('map').setView([59.51224061318297, 36.56994581222535], 3);


var mtGz = L.maptiler.maptilerLayer({
    apiKey: key,
    style: '019900ab-eb56-7f85-b100-33c889e75051'
})

var mtSu = L.maptiler.maptilerLayer({
    apiKey: key,
    style: '0199007a-b1b4-7d33-956b-c7bf80c57a5c'
})

if (theme === "gzhel") {
    mtGz.addTo(map)
} else {
    mtSu.addTo(map)
}




//L.tileLayer('https://api.maptiler.com/maps/019900ab-eb56-7f85-b100-33c889e75051/style.json?key=71hxVyyr9sBdVKFsktTj', {
//    attribution: '© OpenStreetMap contributors'
//}).addTo(map);

const Icon = L.divIcon({
    className: "marker",
    html: "<div></div>"
})

