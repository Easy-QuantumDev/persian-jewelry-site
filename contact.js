const map = L.map('map').setView([36.3156, 59.5152], 15);


L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution:'© OpenStreetMap contributors'
    }
).addTo(map);



const brownIcon = L.icon({

    iconUrl: "./icons/locationiconformap.svg",

    iconSize: [40, 40],

    iconAnchor: [30, 60],

    popupAnchor: [0, -55]

});



L.marker([36.3156, 59.5152], {
    icon: brownIcon
})
.addTo(map)
.bindPopup("<b>فروشگاه ما</b><br>مشهد، سیدرضی 16")
.openPopup();