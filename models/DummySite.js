const mongoose = require('mongoose')

const DummySiteSchema = new mongoose.Schema({
    siteName:{ type : String, unique : true },
    location:{ latitude : Number, longitude : Number }
})

module.exports = mongoose.model( "DummySite", DummySiteSchema)