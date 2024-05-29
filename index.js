const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
require("./middleware/auth");

const authenticationRouter = require("./routes/authentication");

const mongoDb = process.env.MONGO_CONNECTION;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const hashSecret = process.env.HASH_SECRET;
app.use(
  session({ secret: hashSecret, resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));
app.use("/auth", authenticationRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
