'use strict';

const db = require('../db');
const mongoose = require('mongoose');
const Postagem = mongoose.model('Postagem');
const slugify = require('slugify');
const config = require('../config');
const NewsAPI = require('newsapi');
const moment = require('moment');
const newsapi = new NewsAPI(config.noticiaKEY);

async function findAll() {

    var pipeline = [
        {
            $match:{
                excluida: false
            }
        },
        {
            $lookup: {
                from: 'categorias',
                localField: 'categoria',
                foreignField: '_id',
                as: 'categoria'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $lookup: {
                from: 'usuarios',
                localField: 'autor',
                foreignField: '_id',
                as: 'autor'
            }
        },
        {
            $project: {
                _id: 1,
                titulo: 1,
                autor:{
                    nome: 1,
                    email: 1,
                    nivel:1
                },
                tags:{
                    nome: 1
                },
                dataPublicacao: 1,
                publicada: 1,
                status: 1,
                excluida: 1,
                subTitulo: 1,
                texto: 1,
                fonte: 1,
                fonteLink: 1,
                url: 1,
                imagemCapa: 1,
                categoria: {
                    nome: 1
                },
                dataCriacao: 1
            }
        }
    ]

    const postagem = global.conn.collection("postagems");
    return await postagem.aggregate(pipeline).toArray();
}

async function getById(id){
    var pipelineID = [
        {
            $match:{
                _id : id
            }
        },
        {
            $lookup: {
                from: 'categorias',
                localField: 'categoria',
                foreignField: '_id',
                as: 'categoria'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $lookup: {
                from: 'usuarios',
                localField: 'autor',
                foreignField: '_id',
                as: 'autor'
            }
        },
        {
            $project: {
                _id: 1,
                titulo: 1,
                autor:{
                    nome: 1,
                    email: 1,
                    nivel:1
                },
                tags:{
                    nome: 1
                },
                dataPublicacao: 1,
                publicada: 1,
                status: 1,
                excluida: 1,
                subTitulo: 1,
                texto: 1,
                fonte: 1,
                fonteLink: 1,
                url: 1,
                imagemCapa: 1,
                categoria: {
                    nome: 1
                },
                dataCriacao: 1
            }
        }
    ]

    const postagem = global.conn.collection("postagems");
    return await postagem.aggregate(pipelineID).toArray();
}

async function getByAll(data){
    
    var pipelineID = [
        {
            $match: data
        },
        
        {
            $lookup: {
                from: 'categorias',
                localField: 'categoria',
                foreignField: '_id',
                as: 'categoria'
            }
        },
        {
            $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }
        },
        {
            $lookup: {
                from: 'usuarios',
                localField: 'autor',
                foreignField: '_id',
                as: 'autor'
            }
        },
        {
            $project: {
                _id: 1,
                titulo: 1,
                autor:{
                    nome: 1,
                    email: 1,
                    nivel:1
                },
                tags:{
                    nome: 1
                },
                dataPublicacao: 1,
                publicada: 1,
                status: 1,
                excluida: 1,
                subTitulo: 1,
                texto: 1,
                fonte: 1,
                fonteLink: 1,
                url: 1,
                imagemCapa: 1,
                categoria: {
                    nome: 1
                },
                dataCriacao: 1
            }
        },
    ]
    const postagem = global.conn.collection("postagems");
    return await postagem.aggregate(pipelineID).toArray();
}

async function getExternal (palavraChave) {
    let dataFim = moment().format('YYYY-MM-DD');
    let dataInicio = moment().subtract(7, 'days').format('YYYY-MM-DD');
 
    const res = await newsapi.v2.everything({
        q: palavraChave,
        from: dataInicio ,
        to: dataFim,
        language: 'pt',
        sortBy: 'relevancy',
        page: 2
    });
    return res;
}

async function post (data){
    var postagem = new Postagem(data);
    await postagem.save()
}
async function put (id, data) {
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

async function publish (id) {
    await Postagem.findByIdAndUpdate(id,{
        $set: {
            publicada:  true,
            status: 'Publicada',
            dataPublicacao: Date.now()
        }
    })
}

async function schedule (id, data) {
    await Postagem.findByIdAndUpdate(id,{
        $set: {
            publicada:  false,
            status: 'Agendada',
            dataPublicacao: data
        }
    })
}

async function deleteId (id) {
    await Postagem.findByIdAndUpdate(id,{
        excluida: true 
    });
}

module.exports = {findAll, getById, getByAll,getExternal, post, put, publish, schedule, deleteId};