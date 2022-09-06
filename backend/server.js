const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routesUrls = require("./routes/routes");
const cors = require("cors");
const path = require("path");
var bodyParser = require("body-parser");

var multer = require("multer");
var forms = multer();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
dotenv.config();

mongoose.connect(process.env.DATABASE_URL, () =>
  console.log("Database connected")
);

const store = new MongoDBSession({
  uri: process.env.DATABASE_URL,
  collection: "Sessions",
});
// Might not work
app.use(
  session({
    secret: "keyxdplaonsoak",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(forms.array());
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());
app.use("/api", routesUrls);
app.use(express.static(path.join(__dirname, "public")));
app.listen(4000, () => console.log("server is run"));
