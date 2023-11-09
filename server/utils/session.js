const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const app = express();


app.use(
  session({
    secret: process.env.FIRST_SECRET_KEY, 
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: "mongodb://127.0.0.1:27017/sessions" }), 
  })
);
