'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome:{
        type: String,
        required: true,
        index: true,
        unique: true
    },
    ativa:{
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Tag', schema);