const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/sign-up", authController.get_signup);

router.post("/sign-up", authController.submit_signup);

router.get("/log-in", authController.get_login);

router.post("/log-in", authController.submit_login);

router.post("/club/join", authController.join_club);

router.get("/log-out", authController.get_logout);

module.exports = router;
