const User = require("../models/User")
const Site = require("../models/DummySite")
const Event = require("../models/Event")
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    getSiteCalendar: async (req,res) => {
        const user = req.user
        const siteInfo = await Site.findOne( { _id: req.params.id})
        if (req.user.access === null || !req.user.access.equals(req.params.id)) {
            res.render("siteCalendar", { siteInfo, navigator:2, user })
        } else if (req.user.access.equals(req.params.id)) {
            res.render('siteCalendar_admin.ejs', { siteInfo, navigator:2, user })
        }    
    },

    getPersonalCalendar: async (req,res) => {
        const user = req.user
        res.render("siteCalendar_user.ejs", { navigator:5, user })    
    },

    getUserEvents: async(req,res) => {
        const events = await Event.find( {_id: { $in: req.user.events }})
        res.json(events)
    },

    postEvent: async (req,res) => {
        // Upload image to cloudinary
        let result = null
        if (req.file){
            result = await cloudinary.uploader.upload(req.file.path);
        }
        await Event.create({
            eventTitle:req.body.eventTitle,
            eventDescription:req.body.eventDescription,
            siteId: req.body.siteId,
            eventStart: req.body.eventStart,
            eventEnd: req.body.eventEnd,
            image: result?.secure_url,
            cloudinaryId: result?.public_id
        })
        console.log('Event added')
        res.redirect(`/calendar/siteEvents/id/${req.body.siteId}`)
    },

    getEvents: async(req,res) => {
        console.log(req.params)
        const events = await Event.find({siteId:req.params.id})
        res.json(events)

    },

    addEvent: async(req,res) => {
        console.log('body',req.body)
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { events:req.body.eventId }}
        )
        res.redirect(`/calendar/siteEvents/id/${req.body.siteId}`)
    },


};