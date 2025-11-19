const User = require("../models/User");

module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  
  getProfile: async (req, res) => {
    try {
      
      const user = await User.findOne({ _id: req.user })
      
      res.render("profile.ejs", { user });
    } catch (err) {
      console.log(err);
    }
  }
};
