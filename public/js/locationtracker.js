// document.querySelector('#postmessage').addEventListener('click',postmessage)
document.querySelector('#showPos').addEventListener('click',showPos)
const display = document.querySelector('#current-location')
const list = document.querySelector('#rooms')
// document.querySelector('#newRoomMaker').addEventListener('click',newRoomMaker)
var map = L.map('map')
var popup = L.popup({ autoClose:false })
map.on('click', onMapClick)

let markerMaker = 0
let locations = []

//check the database for messages in locations
setInterval(getmessages,1000*60*60)

//shows map on load
function getmessages() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const crds = pos.coords
        await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${crds.latitude}&lng=${crds.longitude}&username=significantswim1984`)
            .then(res => res.json())
            .then(async data => {
                const lat = data.geonames[0].lat
                const long = data.geonames[0].lng
                map.setView([lat, long], 13);
                await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
            })
        fetch("/getLocations")
            .then(res => res.json())
            .then(data => {
                data.locations.forEach(loc => {
                    locations.push([ loc.siteName , loc.location.latitude, loc.location.longitude ])
                })
                addMarker(locations)
            })
            // popup
            // .setLatLng([crds.latitude, crds.longitude])
            // .setContent("Emma is here.")
            // .openOn(map);
            // map.openPopup(popup)
        
        
        }
    )
}

getmessages()

//finds messages in relevant distance
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => (angle * Math.PI) / 180;
    
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// way to add more than 1 pin taken from this stack overflow: https://stackoverflow.com/questions/42968243/how-to-add-multiple-markers-in-leaflet-js
function onMapClick(e){

    // fetch("/placePop", {
    //     method:"POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body:JSON.stringify({
    //         siteName:`location ${markerMaker}`,
    //         location:{ latitude : e.latlng.lat, longitude : e.latlng.lng }
    //     })
    // })
    // .then(res => res.text())
    // .then(data => console.log(data))

    locations.push([`location ${markerMaker}`,e.latlng.lat,e.latlng.lng])
    markerMaker++
    addMarker(locations)
}

function addMarker(locations){
    locations.forEach(loc => {
        marker = new L.popup([loc[1],loc[2]])
            .setContent(loc[0])
            .addTo(map)
    });
}








// //constantly watches position(come back to later since it clogs up processes)
// function watchPos(){
//     navigator.geolocation.watchPosition((pos) => {
//         //get locations from database
//         //compare it to watcher

//         console.log('Fired!',JSON.stringify(pos))
//         const crds = pos.coords        
//     }, (error) => console.log(error)
//     )
// }
// document.querySelector('#watchPos').addEventListener('click',watchPos)

//posts a new message to db, then reloads page
// function postmessage(){
//     const message = document.querySelector('#message').value
//     navigator.geolocation.getCurrentPosition((pos) => {
//     // console.log(pos)
//     const crds = pos.coords
//     fetch('/postmessage',{
//             method:"post",
//             body: JSON.stringify({
//                 message:message,
//                 location:{
//                     lat:crds.latitude,
//                     long:crds.longitude
//                 },
            
//             }),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//         .then(res=> res.json())
//         .then(data=> {
//             window.location.href= data.redirect
//         })
//         // .then(res => console.log(res))
//         // document.querySelector('#lat').innerText = `Latitude: ${crds.latitude}`
//         // document.querySelector('#long').innerText = `Longitude: ${crds.longitude}`
//     })
// }