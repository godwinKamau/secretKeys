const User = require("../models/User");
const Sites = require("../models/DummySite")
const Post = require("../models/Post")
const mongoose = require("mongoose")

module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  
  getProfile: async (req, res) => {
    try {
      
      const user = await User.findOne({ _id: req.user })

      
      if (user.access){
        const siteInfo = await Sites.findById(user.access)
        const posts = await Post.find({ location: user.access}).sort({ createdAt: -1 })
        console.log('posts',posts)
        res.render("site_admin.ejs", { siteInfo, user, posts })
      } else {
        res.render("profile.ejs", { user });
      }
      
    } catch (err) {
      console.log(err);
    }
  }
};
