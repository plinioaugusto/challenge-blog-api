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
        default: true
    }
});

module.exports = mongoose.model('Categoria', schema);