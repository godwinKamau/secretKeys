const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  post: {
    type: String
  },
  image: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DummySite"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
