var map = L.map('map')
var popup = L.popup({ autoClose:false })
let locations = []

//check the database for messages in locations
setInterval(startUp,1000*60*60)

//=======Collects current position
function currentLocation(){
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((pos) => {
        resolve(pos.coords)
        })
    })
}

//shows map on load
function startUp() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const crds = pos.coords
        // await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${crds.latitude}&lng=${crds.longitude}&username=significantswim1984`)
        //     .then(res => res.json())
        //     .then(async data => {
        //         const lat = data.geonames[0].lat
        //         const long = data.geonames[0].lng
        //         map.setView([lat, long], 13);
        //         await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //             maxZoom: 19,
        //             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        //         }).addTo(map);
        //     })
        const lat = crds.latitude
        const long = crds.longitude
        map.setView([lat, long], 13);
                await L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
        fetch("/getLocations")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.locations.forEach(loc => {
                    locations.push([ loc.siteName , loc.location.latitude, loc.location.longitude, loc._id, loc.description, loc.image ])
                })
                console.log(locations)
                addMarker(locations,crds)
            })
        }
    )
}

startUp()

//Leon gave the advice to change the button to an anchor to touch the server and redirect the page.
async function addMarker(locations,crds){
    await locations.forEach(loc => {
        marker = new L.marker([loc[1],loc[2]])
            .bindPopup(`
                <h4 class="popupTitle">${loc[0]}</h4>
                <img class="popupImg" src="${loc[5]}"><br>
                <span>${loc[4]}</span><br>
                <a href="/compareLocation/id/${loc[3]}/lat/${crds.latitude}/lng/${crds.longitude}"><button id="sendId">Are you close?</button></a>
            `)
            .addTo(map)
        
    });
}

// ==========================================================≠====================≠====≠=≠=≠=≠=≠==================//
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

//============
// way to add more than 1 pin taken from this stack overflow: https://stackoverflow.com/questions/42968243/how-to-add-multiple-markers-in-leaflet-js
map.on('click', onMapClick)
function onMapClick(e){
    const siteName = prompt('Enter name')
    //add files to post: https://stackoverflow.com/questions/36067767/how-do-i-upload-a-file-with-the-js-fetch-api
    const image = document.querySelector('#image')
    const data = new FormData()
    
    data.append('file', image.files[0])
    
    const description = document.querySelector('#description').value
    data.append('jsonData',JSON.stringify(
        {siteName:siteName,
        location:{ latitude : e.latlng.lat, longitude : e.latlng.lng },
        description: description}))

    for (const [key,value] of data.entries()){
        console.log([key, value])
    }

    fetch("/placePop", {
        method:"POST",
        body:data
    })
    .then(res => res.text())
    .then(data => console.log(data))

    locations.push([`location ${markerMaker}`,e.latlng.lat,e.latlng.lng])
    markerMaker++
    addMarker(locations)
}
//===========

// This is where I found event listeners for popups: https://stackoverflow.com/questions/60781618/leaflet-how-to-add-click-event-to-button-inside-marker-pop-up-in-ionic-app
// map.on('popupopen',(e) => {
//     document.getElementById('sendId').addEventListener( 'click', async () => {
//         let locId = e.popup._source.details.id
//         const crds = await currentLocation()
//         console.log(crds)
//         fetch(`/compareLocation/id/${locId}/lat/${crds.latitude}/lng/${crds.longitude}`)
//             .then(res => res.text())
//             .then(data => {
//                 document.querySelector('.alert').innerText = data
//             })
//     })
// })