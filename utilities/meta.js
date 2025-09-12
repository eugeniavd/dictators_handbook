
const dataTags = document.querySelectorAll(`[data-type]`)
const content = new Map()
const metaNames = ["person", "place", "organization", "event"]
const metaTabs = document.querySelectorAll(".meta-names li");
const metaTag = document.querySelector(".meta-content");

const setData = (tag, i) => {
    let index = tag.dataset.id
    if (index) {
        const link = document.createElement("a");
        link.src = data[index].wiki;
        link.target = "_blank";
        if (!content.has(index)) {
            content.set(index, { ...data[index], type: tag.dataset.type, links: [tag]});
        } else {
            const result = content.get(index)
            result.links.push(tag)
            content.set(index, result)
        }
    }
}

dataTags.forEach((tag, i) => {
    setData(tag, i)
})


const createMetaLine = (data) => {
    const line = document.createElement("div");
    line.className = "meta-line"
    const text = document.createElement("div");
    text.className = "meta-text"
    if (data.wiki) {
        text.innerHTML = `<a class="link" href="${data.wiki}" target="_blanl">${data.name}</a>`;
    } else if (data.coords) {
        text.innerHTML = `<span class="link">${ data.name }</span>`;
    } else {
        text.innerText = data.name;
    }
    if (data.date) {
        text.innerHTML += `<span>(${data.date})</span>`
    }
    const supTag = document.createElement("div");
    supTag.className = "sup-content"
    
    data.links?.forEach((link, i) => {
        link.addEventListener("click", (e) => {
            line.scrollIntoView({block: 'center'})
        })
        console.log(link)
        //const sup = document.createElement("div")
        //sup.className = "sup"
        //sup.innerText = i + 1;
        //sup.addEventListener("click", () => {
        //    link.scrollIntoView({block: 'center'})
        //    link.classList.add("active")
        //    setTimeout(() => {
        //        link.classList.remove("active")
        //    }, 3000)
        //})
        //supTag.append(sup)
    })
    
    line.append(text, supTag);
    
    if (data.coords) {
        const marker = L.marker(data.coords, {icon: Icon}).addTo(map).bindPopup(data.name)
        const latLngs = [marker.getLatLng()];
        text.addEventListener("click", () => {
            //location.hash = "map";
            mapTag.scrollIntoView()
            map.fitBounds(L.latLngBounds(latLngs))
            map.setZoom(data.zoom || 6)
            marker.openPopup()
        })
    }
    return line;
    
}
const metaData = Array.from(content).reduce((acc, el) => {
    if (!acc[el[1].type]) {
        acc[el[1].type] = []
    }
    acc[el[1].type].push(el[1])
    return acc;
}, {})
//const metaData = Array.from(content)
console.log(metaData)
metaNames.forEach(name => {
    const tag = document.createElement("div")
    metaData[name].forEach(el => {
        tag.append(createMetaLine(el))
    })
    tag.dataset.value = name;
    metaTag.append(tag);
})

metaTabs.forEach((el, i) => {
    el.addEventListener("click", (e) => {
        console.log(metaTag.children[i])
        el.classList.toggle("active")
        metaTag.children[i].classList.toggle("active")
        dataTags.forEach(tg => {
            if (tg.dataset.type === metaNames[i]) {
                tg.classList.toggle("show")
            }
        })
        metaTabs.forEach((tab, tabI) => {
            if (tabI !== i) {
                tab.classList.remove("active")
                metaTag.children[tabI].classList.remove("active")
                dataTags.forEach(tg => {
                    if (tg.dataset.type === metaNames[tabI]) {
                        tg.classList.remove("show")
                    }
                })
            }
        })
    });
})

metaTabs[0].classList.add("active")
metaTag.children[0].classList.add("active")
dataTags.forEach(tg => {
    if (tg.dataset.type === metaNames[0]) {
        tg.classList.add("show")
    }
})