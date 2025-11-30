const cloudinary = require("../middleware/cloudinary");
const DummySite = require("../models/DummySite");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      
      const user = await User.findOne({ _id: req.user })
      
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      console.log('what?', req.user)
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      console.log(req.file)
      // Upload image to cloudinary
      let result = null
      if (req.file){
        result = await cloudinary.uploader.upload(req.file.path);
      }
      
      console.log('user',req.body)
      await Post.create({
        post: req.body.post,
        image: result?.secure_url,
        cloudinaryId: result?.public_id,
        location: req.user.access,
        likes: 0,
        user: req.user._id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      
      const loc = await DummySite.findOne({ _id: post.location })
      
      res.redirect(`/renderSite/${loc.siteName}/${loc._id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      console.log('user:', req.user)
      
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId, {invalidate:true}, (error,result)=>{
        if (error) {
            console.error('Deletion error:', error);
        } else {
            console.log('Deletion result:', result);
        }
      });

      // Delete post from db
      await Post.findOneAndDelete({ _id: req.params.id });

      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
