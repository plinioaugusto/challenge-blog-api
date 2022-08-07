"use strict";

const mongoose = require("mongoose");
const Post = mongoose.model("post");
const slugify = require("slugify");
const NewsAPI = require("newsapi");
const moment = require("moment");
const newsapi = new NewsAPI(global.NEWS_KEY);

async function findAll() {
  const pipeline = [
    {
      $match: {
        isExcluded: false,
      },
    },
    {
      $lookup: {
        from: "category",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "tag",
        localField: "tag",
        foreignField: "_id",
        as: "tag",
      },
    },
    {
      $lookup: {
        from: "user",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        author: {
          name: 1,
          email: 1,
          level: 1,
        },
        tags: {
          name: 1,
        },
        publicationAt: 1,
        published: 1,
        status: 1,
        isExcluded: 1,
        caption: 1,
        text: 1,
        source: 1,
        sourceLink: 1,
        url: 1,
        coverImage: 1,
        category: {
          name: 1,
        },
        createdAt: 1,
      },
    },
  ];

  const post = global.conn.collection("post");
  return await post.aggregate(pipeline).toArray();
}

async function getById(id) {
  const pipeline = [
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "category",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "tag",
        localField: "tag",
        foreignField: "_id",
        as: "tag",
      },
    },
    {
      $lookup: {
        from: "user",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        author: {
          name: 1,
          email: 1,
          level: 1,
        },
        tags: {
          name: 1,
        },
        publicationAt: 1,
        published: 1,
        status: 1,
        isExcluded: 1,
        caption: 1,
        text: 1,
        source: 1,
        sourceLink: 1,
        url: 1,
        coverImage: 1,
        category: {
          name: 1,
        },
        createdAt: 1,
      },
    },
  ];

  const post = global.conn.collection("post");
  return await post.aggregate(pipeline).toArray();
}

async function getByAll(data) {
  const pipeline = [
    {
      $match: data,
    },

    {
      $lookup: {
        from: "categorias",
        localField: "categoria",
        foreignField: "_id",
        as: "categoria",
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $lookup: {
        from: "usuarios",
        localField: "autor",
        foreignField: "_id",
        as: "autor",
      },
    },
    {
      $project: {
        _id: 1,
        titulo: 1,
        autor: {
          nome: 1,
          email: 1,
          nivel: 1,
        },
        tags: {
          nome: 1,
        },
        dataPublicacao: 1,
        publicada: 1,
        status: 1,
        excluida: 1,
        subTitulo: 1,
        texto: 1,
        fonte: 1,
        fonteLink: 1,
        url: 1,
        imagemCapa: 1,
        categoria: {
          nome: 1,
        },
        dataCriacao: 1,
      },
    },
  ];
  const post = global.conn.collection("post");
  return await post.aggregate(pipeline).toArray();
}

async function getExternal(keyword) {
  const endDate = moment().format("YYYY-MM-DD");
  const startDate = moment().subtract(7, "days").format("YYYY-MM-DD");

  const news = await newsapi.v2.everything({
    q: keyword,
    from: startDate,
    to: endDate,
    language: "pt",
    sortBy: "relevancy",
    page: 2,
  });
  return news;
}

async function post(data) {
  const post = new Post(data);
  await post.save();
}

async function put(id, data) {
  const {
    title,
    caption,
    text,
    category,
    source,
    sourceLink,
    tags,
    published,
    coverImage,
  } = data;
  await Post.findByIdAndUpdate(id, {
    $set: {
      title,
      caption,
      category,
      text,
      source,
      sourceLink,
      tags,
      url: slugify(title, {
        lower: true,
        strict: true,
      }),
      coverImage,
      published,
      updatedAt: Date.now(),
    },
  });
}

async function publish(id) {
  await Post.findByIdAndUpdate(id, {
    $set: {
      published: true,
      status: "Scheduled",
      publicationAt: Date.now(),
    },
  });
}

async function schedule(id, data) {
  await Post.findByIdAndUpdate(id, {
    $set: {
      published: false,
      status: "Scheduled",
      publicationAt: data,
    },
  });
}

async function deleteId(id) {
  await Post.findByIdAndUpdate(id, {
    isExcluded: true,
  });
}

module.exports = {
  findAll,
  getById,
  getByAll,
  getExternal,
  post,
  put,
  publish,
  schedule,
  deleteId,
};
