'use strict'

const express = require('express'); //Para utilizar o parttens MVC
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const helmet = require('helmet');

//Conectando ao banco
mongoose.connect(config.connectionString);

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
const noticiasExternaRotas = require('./routes/noticias-ex-rotas');

const app = express();
app.use(helmet());
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRotas);
app.use('/postagem', postagemRotas);
app.use('/categoria', categoriaRotas);
app.use('/tag', tagRotas);
app.use('/usuario', usuarioRotas);
app.use('/noticiaex', noticiasExternaRotas);

module.exports = app;//Exportando modulo para o require