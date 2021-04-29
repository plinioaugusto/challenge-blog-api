'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    titulo:{
        type: String,
        required: [true, 'O Título  é obrigatório!'],
    },
    subTitulo:{
        type: String,
        required: [true, 'O Subtítulo é obrigatório!']
    },
    autor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    tags:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    texto:{
        type: String,
        required: [true, 'O Texto é obrigatório!']
    },
    fonte:{
        type: String,
        required: [true, 'A fonte é obrigatória!'],
        trim: true
    },
    fonteLink:{
        type: String,
        required: [true, 'O link da fonte é obrigatória!'],
        trim: true
    },
    url:{
        type: String,
        required: true,
        trim: true, 
        index: true,
        unique: true
    },
    imagemCapa:{
        type: String,
        required: [true, 'É preciso escolher uma imagem para a capa!'],
        trim: true
    },
    dataPublicacao:{
        type: Date,
        default: ''
    },
    publicada:{
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        required: true,
        enum: ['Rascunho','Agendada','Publicada','Inativa'],
        default: 'Rascunho'
    },
    dataCriacao:{
        type: Date,
        required: true,
        default: Date.now
    },
    dataUltimaEdicao:{
        type: Date
    },
    excluida:{
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = mongoose.model('Postagem', schema);