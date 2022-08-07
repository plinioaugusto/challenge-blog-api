"use strict";

const repository = require("../repositories/categoria-repositorie");

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request",
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await repository.getById(req.params.id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request",
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    await repository.post(req.body);
    res.status(201).send({ message: "Category registered successfully!" });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request",
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.put(req.params.id, req.body);
    res.status(200).send({
      message: "Category updated successfully!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request",
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.body.id);
    res.status(200).send({
      message: "Category removed successfully!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request",
    });
  }
};
