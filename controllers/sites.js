const User = require('../models/User')
const DummySite = require('../models/DummySite')

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
    getSite: (req,res) => {
        
        res.redirect("/profile")
    },

    postAccess: async (req,res) => {
        const site = req.body.site
        console.log(req.user)
        let access = req.user.access

        let foundSite = false
        if (access === undefined){
            access = []
        }

        console.log('type',typeof access)

        access.forEach(prop => {
            console.log('prop',prop)
            if (prop.site === site ) {
                console.log('found')
                prop.access = !prop.access
                foundSite = true
            }
        })
        if (!foundSite) {
            access.push({site:site,access:true})
        }
        console.log('access',access)
        await User.updateOne({ _id : req.user._id }, { access : access })
        
        res.redirect("/profile")
    },

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
            res.redirect(`/renderSite/${siteInfo.siteName}`)
        } else {
            res.send("That's too far")
        }
        
    },

    renderSite: (req,res) => {
        if (req.user.access){
            res.render('site_admin.ejs', {siteInfo:req.params, user:req.user})
        } else {
            res.render('site.ejs',{siteInfo:req.params})
        }
    }
}