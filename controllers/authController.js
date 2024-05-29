const passport = require("passport");
const User = require("../models/user");

exports.get_signup = async (req, res, next) => {
  res.render("sign-up-form");
};

exports.submit_signup = async (req, res, next) => {
  try {
    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      email: req.body.email ? req.body.email : undefined,
      password: req.body.password,
      membership: "new",
      isAdmin: false,
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.get_login = async (req, res, next) => {
  res.render("log-in-form");
};

exports.submit_login = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/log-in",
});
