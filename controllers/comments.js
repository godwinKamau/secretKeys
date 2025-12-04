const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comments")
const DummySite = require("../models/DummySite");

module.exports = {
    createComment: async (req,res) => {
        await Comment.create({
            comment:req.body.comment,
            post:req.params.postId,
            user:req.user._id,
            userName: req.user.userName
        })
        console.log('Comment Added')
        const loc = await DummySite.findOne({ _id:req.params.siteId})
        res.redirect(`/renderSite/${loc.siteName}/${loc._id}`);
    }
}