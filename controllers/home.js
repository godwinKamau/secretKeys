const User = require("../models/User");
const Sites = require("../models/DummySite")
const mongoose = require("mongoose")

module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  
  getProfile: async (req, res) => {
    try {
      
      const user = await User.findOne({ _id: req.user })

      const userKey = await User.findOne({userName:'User'})
      
      if (!user.access.equals(userKey._id)){
        const siteInfo = await Sites.findById(user.access)
        res.render("site_admin.ejs", { siteInfo, user })
      } else {
        res.render("profile.ejs", { user });
      }
      
    } catch (err) {
      console.log(err);
    }
  }
};
