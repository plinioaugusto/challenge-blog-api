'use strict';

const mongoose = require('mongoose');
const Postagem = mongoose.model('Postagem');
const slugify = require('slugify');
const config = require('../config');
const NewsAPI = require('newsapi');
const moment = require('moment');
const newsapi = new NewsAPI(config.noticiaKEY);

exports.get = async() =>{
    const res = await Postagem.find({
        excluida: false
    })
    .populate('categoria', 'nome' )
    .populate('tags', 'nome')
    .populate('autor', 'nome');
    return res;
}

exports.getById = async(id) =>{
    const res =  await Postagem.findById(id)
    .populate('categoria', 'nome' )
    .populate('tags', 'nome')
    .populate('autor', 'nome');
    return res;
}

exports.getByAll = async(data) =>{
    const res =  await Postagem.find(data)
    .populate('categoria', 'nome' )
    .populate('tags', 'nome')
    .populate('autor', 'nome');
    return res;
}

exports.getExternal = async(palavraChave) =>{
    let dataFim = moment().format('YYYY-MM-DD');
    let dataInicio = moment().subtract(7, 'days').format('YYYY-MM-DD');
 
    const res = newsapi.v2.everything({
        q: palavraChave,
        from: dataInicio ,
        to: dataFim,
        language: 'pt',
        sortBy: 'relevancy',
        page: 2
    });
    return res;
}

exports.post = async(data) =>{
    var postagem = new Postagem(data);
    await postagem.save()
}

exports.put = async(id, data) =>{
    await Postagem.findByIdAndUpdate(id,{
        $set: {
            titulo:  data.titulo,
            subTitulo:  data.subTitulo,
            categoria:  data.categoria,
            texto:  data.texto,
            fonte:  data.fonte,
            fonteLink:  data.fonteLink,
            tags:  data.tags,
            url: slugify(data.titulo,{
                lower: true,
                strict: true
            }),
            imagemCapa:  data.imagemCapa,
            publicada:  data.publicada,
            dataUltimaEdicao: Date.now()
        }
    })
}

exports.publish = async(id) =>{
    await Postagem.findByIdAndUpdate(id,{
        $set: {
            publicada:  true,
            status: 'Publicada',
            dataPublicacao: Date.now()
        }
    })
}

exports.schedule = async(id, data) =>{
    await Postagem.findByIdAndUpdate(id,{
        $set: {
            publicada:  false,
            status: 'Agendada',
            dataPublicacao: data
        }
    })
}

exports.delete = async(id) => {
    await Postagem.findByIdAndUpdate(id,{
        excluida: true 
    });
}