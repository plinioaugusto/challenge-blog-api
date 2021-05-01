'use strict'

const config = require('./config');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

mongoClient.connect(config.connectionString, {
        useUnifiedTopology: true
    })
    .then(conn =>
        global.conn = conn.db("myFirstDatabase"))
    .catch(err =>
        console.log(err));

        
function findAll() {
    return global.conn.collection("postagems")
    .find({excluida: false})
    .toArray();
}

function findOne(id) {
    return global.conn.collection("postagems").findOne(new ObjectId(id));
}

function insert(customer) {
    return global.conn.collection("postagems").insertOne(customer);
}

function update(id, customer) {
    return global.conn.collection("postagems").updateOne({ _id: new ObjectId(id) }, { $set: customer });
}

function deleteOne(id) {
    return global.conn.collection("postagems").deleteOne({ _id: new ObjectId(id) });
}

module.exports = {findAll, insert,findOne,update,deleteOne}