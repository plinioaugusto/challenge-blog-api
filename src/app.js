"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

mongoose.connect(global.CONNECTION_STRING);

const indexRouter = require("./routes/index.router");
const postRouter = require("./routes/post.router");
const categoryRouter = require("./routes/category.router");
const tagRouter = require("./routes/tag.router");
const userRouter = require("./routes/user.router");

const app = express();
app.use(helmet());

app.use(
  bodyParser.json({
    limit: "5mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use("/", indexRouter);
app.use("/posts", postRouter);
app.use("/categories", categoryRouter);
app.use("/tags", tagRouter);
app.use("/users", userRouter);

module.exports = app;
