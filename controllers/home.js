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
  },
  getColors: async (req,res) => {
    const user = await User.findById(req.user._id)
    res.json(user.colors)
  },
  getInventory: async (req,res) => {
    res.render("shopping", {user:req.user})
  },
  putColor: async (req,res) => {
    console.log(req.params)
    if (req.params.color === 'mahogany') {
      await User.findByIdAndUpdate(req.user._id, { 
        $set: { colors: { color1: '2D1115', color2: '65334D', color3: '934683'}},
        $inc: { score: -30 }
      })
      res.redirect("/profile")
    } else if (req.params.color === 'blue') {
      await User.findByIdAndUpdate(req.user._id, { 
        $set: { colors: { color1: '5A7684', color2: '92AFD7', color3: 'C5D1EB'}},
        $inc: { score: -30}
      })
      res.redirect("/profile")
    } else if (req.params.color === 'gatsby') {
      await User.findByIdAndUpdate(req.user._id, { 
        $set: { colors: { color1: '1b4332', color2: '2d6a4f', color3: '40916c'}},
        $inc: { score: -30}
      })
      res.redirect("/profile")
    }
  }
};
