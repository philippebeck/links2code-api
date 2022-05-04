"use strict";

const express   = require("express");
const mongoose  = require("mongoose");
const helmet    = require("helmet");
const sanitize  = require("express-mongo-sanitize");
const path      = require("path");

const linkRoute = require("./route/LinkRoute");
const userRoute = require("./route/UserRoute");

require("dotenv").config();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(sanitize());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin", 
    "*"
    );
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
  res.setHeader(
    "Access-Control-Allow-Methods", 
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
  next();
});

app.use(`/${process.env.IMG}`, express.static(path.join(__dirname, process.env.IMG)));

app.use(process.env.ROUTE_LINK, linkRoute);
app.use(process.env.ROUTE_USER, userRoute);

module.exports = app;
