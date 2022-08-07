"use strict";

const mongoose = require("mongoose");
const User = mongoose.model("user");
const md5 = require("md5");

exports.get = async () => {
  const users = await User.find({
    isActive: true,
  });
  return users;
};

exports.getById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.post = async (data) => {
  const user = new User(data);
  await user.save();
};

exports.put = async (id, data) => {
  const { name, email, password, level, isActive } = data;
  await User.findByIdAndUpdate(id, {
    $set: {
      name,
      email,
      password: md5(password + global.KEY_ENCODER),
      level,
      isActive,
    },
  });
};

exports.delete = async (id) => {
  await User.findByIdAndUpdate(id, {
    $set: {
      isActive: false,
    },
  });
};

exports.inactivate = async (id) => {
  await User.findByIdAndUpdate(id, {
    $set: {
      isActive: false,
    },
  });
};

exports.activate = async (id) => {
  await User.findByIdAndUpdate(id, {
    $set: {
      isActive: true,
    },
  });
};

exports.authenticate = async (data) => {
  const { email, password } = data;
  const res = await user.findOne({
    email,
    password,
  });
  return res;
};
