const User = require('../models/User')
const DummySite = require('../models/DummySite')
const Post = require('../models/Post')
const Comment = require('../models/Comments')
const cloudinary = require("../middleware/cloudinary");

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
        try {
            console.log(req.file)
            // Upload image to cloudinary
            let result = null
            if (req.file){
                result = await cloudinary.uploader.upload(req.file.path);
            }
            const request = JSON.parse(req.body.jsonData)
            console.log(request)
            await DummySite.create({
                siteName:request.siteName,
                location:{latitude:request.location.latitude,longitude:request.location.longitude},
                image: result?.secure_url,
                cloudinaryId: result?.public_id,
                description:request.description
            })
            res.send(`${request.siteName} saved!`)
        } catch(err) {
            console.log(err)
        }
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
            res.render("tooFar", { distance, user:req.user })
        }
        
    },

    renderSite: async (req,res) => {
        // object to collect the comments
        const postComments = {}

        //finding the posts
        const posts = await Post.find({ location: req.params._id }).sort({ createdAt: -1 })

        //collect the comments based off of the comments(asked chatGPT how to collect all the comments before rendering)
        await Promise.all(
            posts.map(async post => {
                const comments = await Comment.find({ post: post._id });

                if (comments.length > 0) {
                    postComments[post._id] = comments;
                }
            })
        );
        
        const user = await User.findByIdAndUpdate({ _id: req.user._id}, { $inc: { score : 1} })
        
        if (req.user.access === null){
            res.render('site.ejs',{siteInfo:req.params, posts, navigator:0, comments:postComments, user })
        } else if (req.user.access.equals(req.params._id)) {
            res.render('site_admin.ejs', {siteInfo:req.params, user:req.user, posts, navigator:0 })
        } 
    }
}