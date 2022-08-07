"use strict";

const mongoose = require("mongoose");
const Category = mongoose.model("category");

exports.get = async () => {
  const categories = await Category.find({});
  return categories;
};

exports.getById = async (id) => {
  const category = await Category.findById(id);
  return category;
};

exports.post = async (data) => {
  const category = new Category(data);
  await category.save();
};

exports.put = async (id, data) => {
  const { name, isActive } = data;
  await Category.findByIdAndUpdate(id, {
    $set: {
      name,
      isActive,
    },
  });
};

exports.delete = async (id) => {
  await Category.findByIdAndUpdate(id, {
    $set: {
      isActive: false,
    },
  });
};
