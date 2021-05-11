'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const helmet = require('helmet');

//Conectando ao banco
mongoose.connect(global.CONNECTION_STRING);

//Carregando os Models
const Postagem = require('./models/postagem');
const Categoria = require('./models/categoria');
const Tag = require('./models/tag');
const Usuario = require('./models/usuario');

//Carregando as rotas
const indexRotas = require('./routes/index-rotas');
const postagemRotas = require('./routes/postagem-rotas');
const categoriaRotas = require('./routes/categoria-rotas');
const tagRotas = require('./routes/tag-rotas');
const usuarioRotas = require('./routes/usuario-rotas');

const app = express();
app.use(helmet());
const router = express.Router();

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilitando o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRotas);
app.use('/postagem', postagemRotas);
app.use('/categoria', categoriaRotas);
app.use('/tag', tagRotas);
app.use('/usuario', usuarioRotas);

module.exports = app;//Exportando modulo para o requires