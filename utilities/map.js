const key = '71hxVyyr9sBdVKFsktTj';
const mapBlock = document.querySelector('.map_container');
const size = (826 * 100) / 1041
const path = location.pathname.split("/").pop();
if (path !== "documentation.html") {
    mapBlock.style.height = (mapBlock.getBoundingClientRect().width / 100) * size + "px"
}
const mapTag = document.getElementById("map");
const map = L.map('map').setView([59.51224061318297, 36.56994581222535], 3);

const Icon = L.divIcon({
    className: "marker",
    html: "<div></div>"
})

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



