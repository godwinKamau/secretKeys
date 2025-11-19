const User = require('../models/User')
const DummySite = require('../models/DummySite')

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
        console.log(locations)
        res.send(JSON.stringify({locations}))
    }
}