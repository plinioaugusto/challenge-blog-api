'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    senha:{
        type: String,
        required: true
    },
    nivel:{
        type: String,
        required: true,
        enum: ['Leitor','Redator','Revisor','Administrador'],
        default: 'Leitor'
    },
    ativa:{
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Usuario', schema);