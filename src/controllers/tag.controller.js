"use strict";

const repository = require("../repositories/tag.repository");

exports.get = async (req, res, next) => {
  try {
    const tags = await repository.get();
    res.status(200).send(tags);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await repository.getById(id);
    res.status(200).send(tag);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    await repository.post(req.body);
    res.status(201).send({ message: "Tag successfully registered!" });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.put(req.params.id, req.body);
    res.status(200).send({
      message: "Tag successfully updated!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;
  try {
    await repository.delete(id);
    res.status(200).send({
      message: "Tag successfully removed!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};
