const mongoose = require('mongoose')

const DummySiteSchema = new mongoose.Schema({
    siteName:{ type : String, unique : true },
    location:{ latitude : Number, longitude : Number },
    image: String,
    cloudinaryId: String,
    description: String
})

module.exports = mongoose.model( "DummySite", DummySiteSchema)