const User = require('../models/User')
const DummySite = require('../models/DummySite')
const Post = require('../models/Post')

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

module.exports = {

    postPop: async (req,res) => {
        console.log(req.body.siteName,req.body.location.latitude,req.body.location.longitude)
        await DummySite.create({
            siteName:req.body.siteName,
            location:{latitude:req.body.location.latitude,longitude:req.body.location.longitude}
        })
        res.send(`${req.body.siteName} saved!`)
    },

    getPop: async (req,res) => {
        locations = await DummySite.find({})
        // console.log(locations)
        res.send(JSON.stringify({locations}))
    },

    compareLocation: async (req,res) => {
        console.log(req.params)
        const siteInfo = await DummySite.findById(req.params.id)
        const distance = haversineDistance( req.params.lat, req.params.lng, siteInfo.location.latitude, siteInfo.location.longitude)
        console.log('siteinfo',siteInfo)
        if (distance < .5) {
            res.redirect(`/renderSite/${siteInfo.siteName}/${siteInfo._id}`)
        } else {
            res.send(`That's too far. You're ${distance} km away.`)
        }
        
    },

    renderSite: async (req,res) => {
        const posts = await Post.find({ location: req.params._id }).sort({ createdAt: -1 })
        console.log('posts',posts)

        if (req.user.access === null){
            res.render('site.ejs',{siteInfo:req.params, posts, navigator:0 })
        } else if (req.user.access.equals(req.params._id)) {
            res.render('site_admin.ejs', {siteInfo:req.params, user:req.user, posts, navigator:0 })
        } 
    }
}