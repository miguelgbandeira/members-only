const passport = require("passport");
const User = require("../models/user");
const { createHash } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

exports.get_signup = async (req, res, next) => {
  res.render("sign-up-form", { errors: [] });
};

exports.submit_signup = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified.")
    .custom(async (value) => {
      const user = await User.findUserByUsername(value);
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password").trim().escape(),
  body("re-password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords are not the same"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("sign-up-form", { errors: errors.array() });
      }
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
  },
];

exports.get_login = async (req, res, next) => {
  res.render("log-in-form", { errors: [] });
};

exports.submit_login = [
  // Validate and sanitize fields
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Username must be specified.")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Password must be specified."),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("log-in-form", { errors: errors.array() });
    }
    next();
  },

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in",
  }),
];

exports.get_logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.join_club = [
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Passcode must be specified."),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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

          res.status(200).redirect("/");
        } catch (error) {
          console.error(error);
          res.status(500).send("Server error");
        }
      }
    } else {
      res.redirect("/");
    }
  },
];
