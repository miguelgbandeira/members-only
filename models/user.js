const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  email: { type: String },
  password: { type: String, required: true },
  membership: { type: String },
  isAdmin: { type: Boolean },
});

UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.first_name}, ${this.last_name}`;
  }
  return fullname;
});

module.exports = mongoose.model("User", UserSchema);
