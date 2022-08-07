"use strict";

const mongoose = require("mongoose");
const Tag = mongoose.model("tag");

exports.get = async () => {
  const tags = await Tag.find({
    isActive: true,
  });
  return tags;
};

exports.getById = async (id) => {
  const tag = await Tag.findById(id);
  return tag;
};

exports.post = async (data) => {
  const tag = new Tag(data);
  await tag.save();
};

exports.put = async (id, data) => {
  const { name, isActive } = data;
  await Tag.findByIdAndUpdate(id, {
    $set: {
      name,
      isActive,
    },
  });
};

exports.delete = async (id) => {
  await Tag.findByIdAndUpdate(id, {
    $set: {
      isActive: false,
    },
  });
};
