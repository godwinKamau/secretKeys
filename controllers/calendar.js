const User = require("../models/User")
const Site = require("../models/DummySite")

module.exports = {
    getSiteCalendar: async (req,res) => {
        const siteInfo = await Site.findOne( { _id: req.params.id})
        res.render("siteCalendar", {siteInfo, navigator:2})
    }
};