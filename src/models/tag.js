'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome:{
        type: String,
        required: true,
    },
    ativa:{
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Tag', schema);