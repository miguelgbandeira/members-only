const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, maxLength: 1000 },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("url").get(() => `/post/${this._id}`);

module.exports = mongoose.model("Message", MessageSchema);
