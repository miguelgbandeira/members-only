const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, maxLength: 1000 },
  timestamp: { type: Date, required },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

PostSchema.virtual("url").get(() => `/post/${this._id}`);

module.exports = mongoose.model("Post", PostSchema);
