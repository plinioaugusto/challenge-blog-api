"use strict";

const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

mongoClient
  .connect(global.CONNECTION_STRING, {
    useUnifiedTopology: true,
  })
  .then((conn) => (global.conn = conn.db("blog-quero-delivery")))
  .catch((err) => console.log(err));

function findAll() {
  return global.conn.collection("post").find({ isExcluded: false }).toArray();
}

function findOne(id) {
  return global.conn.collection("post").findOne(new ObjectId(id));
}

function insert(customer) {
  return global.conn.collection("post").insertOne(customer);
}

function update(id, customer) {
  return global.conn
    .collection("post")
    .updateOne({ _id: new ObjectId(id) }, { $set: customer });
}

function deleteOne(id) {
  return global.conn.collection("post").deleteOne({ _id: new ObjectId(id) });
}

module.exports = { findAll, insert, findOne, update, deleteOne };
