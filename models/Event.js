const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventTitle: {type: String},
    eventDescription: { type: String},
    location: { type: String },
    image: { type: String},
    cloudinaryId: { type: String },
    siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DummySite"
    },
    eventStart: {
        type: String
    },
    eventEnd: {
        type: String
    }
})

module.exports = mongoose.model("Event", EventSchema)