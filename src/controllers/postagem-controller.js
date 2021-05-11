'use strict';

const mongoose = require('mongoose');
const repositorio = require('../repositories/postagem-repositorie');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');
const authService = require('../services/auth-service');
const slugify = require('slugify');

exports.get = async(req, res, next) =>{
    try{
        var data = await repositorio.findAll();
        res.status(200).send(data);
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.getById = async(req, res, next) =>{
    try{
        let id = mongoose.Types.ObjectId(req.params.id);
        var data = await repositorio.getById(id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.getByAll = async(req, res, next) =>{
    try{
        var data = await repositorio.getByAll(req.body);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao buscar sua requisição"
        });
    }
}

exports.getExternal = async(req, res, next) =>{
    try{
        var data = await repositorio.getExternal(req.body.palavraChave);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao buscar notícias"
        });
    }
};

exports.post = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const dadosToken = await authService.decodeToken(token);//Salvando na variável o id, nome e email contido no token

        // Cria o Blob Service
        const blobServico = azure.createBlobService(global.AZURE_CONNECTIONSTRING);

        let nomeImagem = guid.raw().toString() + '.jpg'; //Gerando nome único para imagens no formato jpg
        let imgBase64 = req.body.imagemCapa; //Minha imagem em base64
        let matches = imgBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);//RegEx para reduzir a quantidade de carcateres no base64
        let tipo = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        // Salvando a imagem
        await blobServico.createBlockBlobFromText('img-postagens', nomeImagem, buffer, {contentType: tipo},
        function (error, result, response) {
            if (error) {
                nomeImagem = 'imagem-padrao-postagem.png'
            }
        });

        await repositorio.post({
            autor: dadosToken.id, //Atributo "autor" recebe o id do usuário logado.
            titulo: req.body.titulo,
            subTitulo: req.body.subTitulo,
            texto: req.body.texto,
            fonte: req.body.fonte,
            fonteLink: req.body.fonteLink,
            url: slugify(req.body.titulo,{
                lower: true,
                strict: true
            }),
            imagemCapa: 'https://plinioaugusto.blob.core.windows.net/img-postagens/' + nomeImagem,
            tags: req.body.tags,
            categoria: req.body.categoria
        });
        res.status(201).send({message: 'Postagem cadastrada com sucesso!'});
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: "Falha ao criar sua postagem"
        });
    }
};

exports.put = async(req, res, next) => {
    try{
        await repositorio.put(req.params.id, req.body);
        res.status(200).send({
            message: 'Postagem atualizada com sucesso!'
        });
    }catch(e){
        console.log(e)
        res.status(500).send({
            
            message: "Falha ao atualizar sua postagem"
        });
    }
};

exports.publish = async(req, res, next) => {
    try{
        await repositorio.publish(req.params.id);
        res.status(200).send({
            message: 'Postagem publicada com sucesso!'
        });
    }catch(e){
        console.log(e)
        res.status(500).send({
            
            message: "Falha ao publicada sua postagem"
        });
    }
};

exports.schedule = async(req, res, next) => {
    try{
        var hoje = new Date();
        var publicacao = new Date(req.params.data);

        if(publicacao.getTime() > hoje.getTime()){
            await repositorio.schedule(req.params.id, publicacao);
            res.status(200).send({
                message: 'Postagem agendada com sucesso!'
            });
        }else{
            res.status(500).send({
                message: "Data de agendamento inválida"
            });
        }
    }catch(e){
        res.status(500).send({
            message: "Data de agendamento inválida"
        });
    }
};

exports.delete = async(req, res, next) => {
    try{
        await repositorio.delete(req.body.id);
        res.status(200).send({
            message: 'Postagem removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao remover sua requisição"
        });
    }
};