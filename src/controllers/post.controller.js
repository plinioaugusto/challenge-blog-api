"use strict";

const mongoose = require("mongoose");
const repository = require("../repositories/post.repository");
const azure = require("azure-storage");
const guid = require("guid");
const authService = require("../services/auth-service");
const slugify = require("slugify");

exports.get = async (req, res, next) => {
  try {
    const posts = await repository.findAll();
    res.status(200).send(posts);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const data = await repository.getById(id);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.getByAll = async (req, res, next) => {
  try {
    const posts = await repository.getByAll(req.body);
    res.status(200).send(posts);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.getExternal = async (req, res, next) => {
  try {
    const news = await repository.getExternal(req.body.keyword);
    res.status(200).send(news);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const dataToken = await authService.decodeToken(token);
    const blobServico = azure.createBlobService(global.AZURE_CONNECTIONSTRING);
    let imgName = guid.raw().toString() + ".jpg";
    const imgBase64 = req.body.coverImage;
    const matches = imgBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const type = matches[1];
    const buffer = new Buffer(matches[2], "base64");

    await blobServico.createBlockBlobFromText(
      "img-post",
      imgName,
      buffer,
      { contentType: type },
      function (error, result, response) {
        if (error) {
          imgName = "image-default-post.png";
        }
      }
    );

    const { title, caption, text, source, sourceLink, tags, category } =
      req.body;

    await repository.post({
      author: dataToken.id,
      title,
      caption,
      text,
      source,
      sourceLink,
      url: slugify(req.body.titulo, {
        lower: true,
        strict: true,
      }),
      coverImage:
        "https://plinioaugusto.blob.core.windows.net/img-postagens/" + imgName,
      tags,
      category,
    });
    res.status(201).send({ message: "Post successfully registered!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to create your post.",
    });
  }
};

exports.put = async (req, res, next) => {
  const { id } = req.params;
  try {
    await repository.put(id, req.body);
    res.status(200).send({
      message: "Post successfully updated!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to update your post.",
    });
  }
};

exports.publish = async (req, res, next) => {
  const { id } = req.params;
  try {
    await repository.publish(id);
    res.status(200).send({
      message: "Post successfully published!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to publish your post.",
    });
  }
};

exports.schedule = async (req, res, next) => {
  const { id, date } = req.params;
  try {
    const today = new Date();
    const publicationDate = new Date(date);

    if (publicationDate.getTime() > today.getTime()) {
      await repository.schedule(id, publicationDate);
      res.status(200).send({
        message: "Post successfully scheduled!",
      });
    } else {
      res.status(500).send({
        message: "Invalid appointment date",
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Invalid appointment date.",
    });
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;
  try {
    await repository.deleteId(id);
    res.status(200).send({
      message: "Post successfully removed!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to remove your request.",
    });
  }
};
