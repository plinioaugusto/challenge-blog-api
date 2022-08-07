"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: [true, "Title is mandatory!"],
  },
  caption: {
    type: String,
    required: [true, "Caption is mandatory!"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag",
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  text: {
    type: String,
    required: [true, "Text is mandatory!"],
  },
  source: {
    type: String,
    required: [true, "Source is mandatory!"],
    trim: true,
  },
  sourceLink: {
    type: String,
    required: [true, "SourceLink is mandatory!"],
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  coverImage: {
    type: String,
    required: [true, "You must choose an image for the cover!"],
    trim: true,
  },
  publicationAt: {
    type: Date,
    default: "",
  },
  published: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["Draft", "Scheduled", "Published", "Inactive"],
    default: "Draft",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  isExcluded: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("post", schema);
