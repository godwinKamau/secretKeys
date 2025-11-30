const User = require("../models/User")
const Site = require("../models/DummySite")
const Event = require("../models/Event")
const cloudinary = require("../middleware/cloudinary");

module.exports = {
    getSiteCalendar: async (req,res) => {
        const siteInfo = await Site.findOne( { _id: req.params.id})
        res.render("siteCalendar", {siteInfo, navigator:2})
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
        console.log(events)
        res.json(events)

    }
};