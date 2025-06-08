mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates,
    zoom: 9
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({color : "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25,})
    .setHTML(`<br><h6>${listing.location}</h6><p>Exact location will be provided after booking.</p>`)
    .setMaxWidth("300px"))
    .addTo(map);