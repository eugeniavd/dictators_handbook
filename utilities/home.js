const mapData = Object.entries(data).filter(el => el[1].type === "place")

mapData.forEach(el => {
    L.marker(el[1].coords, {icon: Icon}).addTo(map).bindPopup(createPopup(el[1], true))
})