export {initMap}

function initMap() {
    const locations = [
        {
            langtitude: 2.3333,
            latitude: 48.8602,
            color: "grey"
        },
        {
            langtitude: 2.3397,
            latitude: 48.8607,
            color: "grey"
        },
        {
            langtitude: 2.333,
            latitude: 48.8619,
            color: "grey"
        },
        {
            langtitude: 2.3365,
            latitude: 48.8625,
            color: "grey"
        }
    ];

    const selected_marker = {
        langtitude: 2.3364,
        latitude: 48.86091,
        color: 'black'
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoieWFuYXN0dmwiLCJhIjoiY2t1ZmdxZmprMXI3dTJ3bXh0MW8zYXE2cCJ9.RffdJ30udkM_FDy9OLglmQ';
    var map = new mapboxgl.Map({
        container: 'googleMap', // container id
        style: 'mapbox://styles/yanastvl/ckuffzhjv1lbl18un01tr0q79', // stylesheet location
        center: [2.3364, 48.86091], // starting position [lng, lat]
        zoom: 15.75, // starting zoom

    });

    map.addControl(new mapboxgl.FullscreenControl({
        container: 'googleMap',
    }));

    map.addControl(new mapboxgl.NavigationControl());

    function createMapMarker({
        langtitude,
        latitude,
        color
    }) {
        const marker = new mapboxgl.Marker({
                color: color
            }).setLngLat([langtitude, latitude])
            .addTo(map);
    }

    locations.forEach((el) => createMapMarker(el));

    new mapboxgl.Marker(selected_marker).setLngLat([selected_marker["langtitude"], selected_marker["latitude"]]).addTo(map);
}