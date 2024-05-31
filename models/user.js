const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  email: { type: String },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name}, ${this.last_name}`;
  }
  return fullname;
});

UserSchema.statics.findUserByUsername = async function (username) {
  try {
    const user = await this.findOne({ username: username });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", UserSchema);
