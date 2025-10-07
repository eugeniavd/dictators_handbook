const key = '71hxVyyr9sBdVKFsktTj';

const mapBlock = document.querySelector('.map-container');
const size = (826 * 100) / 1041;
const path = location.pathname.split("/").pop();
if (path !== "documentation.html" && mapBlock) {
  const setMapHeight = () => {
    mapBlock.style.height = (mapBlock.getBoundingClientRect().width / 100) * size + "px";
  };
  setMapHeight();
  window.addEventListener('resize', setMapHeight);
}

const mapEl = document.getElementById('map');
if (!mapEl) {
  console.debug('[map] No #map on this page — skip map init.');
  
  window.switchTheme = function () {};
} else {
  
  const currentTheme = (typeof theme !== 'undefined' ? theme : 'suprematism');

  const styleURL = (id) => `https://api.maptiler.com/maps/${id}/style.json?key=${key}`;
  const gzhelId = '019900ab-eb56-7f85-b100-33c889e75051';
  const suprId  = '0199007a-b1b4-7d33-956b-c7bf80c57a5c';

  const map = L.map(mapEl).setView([59.51224061318297, 36.56994581222535], 3);

  const Icon = L.divIcon({ className: "marker", html: "<div></div>" });

  let base = L.maptilerLayer({
    apiKey: key,
    style: styleURL(currentTheme === 'gzhel' ? gzhelId : suprId)
  }).addTo(map);

  window.switchTheme = function (next) {
    const nextUrl = styleURL(next === 'gzhel' ? gzhelId : suprId);
    base.setStyle(nextUrl, { diff: false });
  };
}
