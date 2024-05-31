const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");

exports.get_messages = async (req, res, next) => {
  const messages = await Message.find();
  console.log(messages);
  res.render("index", { user: req.user, messages });
};

exports.send_message = [
  body("title").trim().escape(),
  body("message").trim().escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const user = await User.findById(req.user);
        const message = new Message({
          title: req.body.title,
          body: req.body.message,
          timestamp: new Date().toLocaleString(),
          author: user,
        });
        await message.save();
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];
