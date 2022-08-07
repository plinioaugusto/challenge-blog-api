"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("category", schema);
