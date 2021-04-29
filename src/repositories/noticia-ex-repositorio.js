'use strict';

const config = require('../config');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(config.noticiaKEY);

exports.buscar = async(palavraChave) =>{
    const res = newsapi.v2.everything({
        q: palavraChave,
        from: '2021-04-10',
        to: '2021-04-29',
        language: 'pt',
        sortBy: 'relevancy',
        page: 2
    });
    return res;
}