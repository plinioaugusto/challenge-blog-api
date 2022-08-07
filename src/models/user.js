"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: ["Reader", "Editor", "Reviewer", "Administrator"],
    default: "Reader",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("user", schema);
