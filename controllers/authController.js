const passport = require("passport");
const User = require("../models/user");
const { createHash } = require("../middleware/auth");

exports.get_signup = async (req, res, next) => {
  res.render("sign-up-form");
};

exports.submit_signup = async (req, res, next) => {
  try {
    const hashedPassword = await createHash(req.body.password);
    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      email: req.body.email ? req.body.email : undefined,
      password: hashedPassword,
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

exports.get_logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.join_club = async (req, res, next) => {
  const secret = process.env.CLUB_SECRET_CODE;
  const passcodeInserted = req.body.passcode;
  if (passcodeInserted === secret) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.isMember = true;
      await user.save();

      res.status(200).send("User updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
};
