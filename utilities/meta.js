
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
        text.innerHTML = `<span class="link">${data.name}</span>`;
        data.links?.forEach((link) => {
            link.innerHTML = `<a class="link" href="${data.wiki}" target="_blank">${link.textContent}</a>`;
        })
    } else if (data.coords) {
        text.innerHTML = `<span class="link">${ data.name }</span>`;
    } else {
        text.innerText = data.name;
    }
    if (data.date) {
        text.innerHTML += `<span>(${data.date})</span>`
    }
    line.addEventListener("click", () => {
        for (let i = 0; i < data?.links.length; i++) {
            const el = data.links[i]
            if (el.checkVisibility()) {
                el.scrollIntoView({block: "center"})
                el.classList.add("active");
                setTimeout(() => {
                    el.classList.remove("active");
                }, 3000)
                break;
            }
        }
        
        
    })
    const supTag = document.createElement("div");
    supTag.className = "sup-content"
    
    
    
    line.append(text, supTag);
    
    if (data.coords) {
        const marker = L.marker(data.coords, {icon: Icon}).addTo(map).bindPopup(createPopup(data))
        const latLngs = [marker.getLatLng()];
        text.addEventListener("click", () => {
            //location.hash = "map";
            //mapTag.scrollIntoView()
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

metaNames.forEach(name => {
    const tag = document.createElement("div")
    metaData[name]?.sort((a,b) => {
        if (a.order) {
            return a.order > b.order ? 1 : -1
        } else {
            return a.name > b.name ? 1 : -1
        }
    })
    metaData[name]?.forEach(el => {
        tag.append(createMetaLine(el))
    })
    tag.dataset.value = name;
    metaTag.append(tag);
})

metaTabs.forEach((el, i) => {
    el.addEventListener("click", (e) => {
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