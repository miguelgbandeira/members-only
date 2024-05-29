const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
require;

router.get("/sign-up", authController.get_signup);

router.post("/sign-up", authController.submit_signup);

router.get("/log-in", authController.get_login);

router.post("/log-in", authController.submit_login);

module.exports = router;
