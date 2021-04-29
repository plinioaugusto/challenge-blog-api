'use strict';

const repositorio = require('../repositories/postagem-repositorie');
const azure = require('azure-storage');
const guid = require('guid');
var config = require('../config');
const authService = require('../services/auth-service');
const slugify = require('slugify');

exports.get = async(req, res, next) =>{
    try{
        var data = await repositorio.buscar();
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
        var data = await repositorio.buscarById(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.post = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const dadosToken = await authService.decodificarToken(token);//Salvando na variável o id, nome e email contido no token

        // Cria o Blob Service
        const blobServico = azure.createBlobService(config.azureConnectionString);

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

        await repositorio.criar({
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
        res.status(500).send({
            message: "Falha ao criar sua postagem"
        });
    }
};

exports.put = async(req, res, next) => {
    try{
        await repositorio.atualizar(req.params.id, req.body);
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

exports.publicar = async(req, res, next) => {
    try{
        await repositorio.publicar(req.params.id);
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

exports.agendar = async(req, res, next) => {
    try{
        var hoje = new Date();
        var publicacao = new Date(req.params.data);

        if(publicacao.getTime() > hoje.getTime()){
            await repositorio.agendar(req.params.id, publicacao);
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
        await repositorio.deletar(req.body.id);
        res.status(200).send({
            message: 'Postagem removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};