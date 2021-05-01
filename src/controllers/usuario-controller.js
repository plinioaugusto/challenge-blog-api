'use strict';

const repositorio = require('../repositories/usuario-repositorie');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) =>{
    try{
        var data = await repositorio.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.getById = async(req, res, next) =>{
    try{
        var data = await repositorio.getById(req.params.id);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

exports.post = async(req, res, next) => {
    try{
        await repositorio.post({
            nome: req.body.nome,
            email: req.body.email,
            senha: md5(req.body.senha + global.CHAVE_CODIFICADORA),
            nivel: req.body.nivel
        });

        emailService.send(
            req.body.email,
            'Seja Bem-Vindo ao Blog do Quero Delivery',
            global.EMAIL_TMPL.replace('{0}', req.body.nome));

        res.status(201).send({message: 'Usuario cadastrada com sucesso!'});
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.put = async(req, res, next) => {
    try{
        await repositorio.put(req.params.id, req.body);
        res.status(200).send({
            message: 'Usuario atualizada com sucesso!'
        });
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: "Falha ao atualizar sua requisição"
        });
    }
};

exports.delete = async(req, res, next) => {
    try{
        await repositorio.delete(req.body.id);
        res.status(200).send({
            message: 'Usuario removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.inactivate = async(req, res, next) => {
    try{
        await repositorio.inactivate(req.params.id);
        res.status(200).send({
            message: 'Usuario inativado com sucesso!'
        });
    }catch(e){
        console.log(e);
        res.status(500).send({
            message: "Falha ao inativar usuário!"
        });
    }
};

exports.activate = async(req, res, next) => {
    try{
        await repositorio.activate(req.params.id);
        res.status(200).send({
            message: 'Usuario ativado com sucesso!'
        });
    }catch(e){
        console.log(e);
        res.status(500).send({
            message: "Falha ao ativar usuário!"
        });
    }
};

exports.authenticate = async(req, res, next) => {
    try{
        const usuario =  await repositorio.authenticate({
            email: req.body.email,
            senha: md5(req.body.senha + global.CHAVE_CODIFICADORA),
        });

        if(!usuario){
            res.status(404).send({
                message: 'Usuário e/ou senha inválidos'
            });
            return;
        }

        if(usuario.ativa == false){
            res.status(404).send({
                message: 'Usuário inativo. Contate o administrador do sistema'
            });
            return;
        }

        //Gerando o token e incluindo o id, email e nome do usuário nele
        const token =  await authService.generateToken({
            id: usuario._id,
            email: usuario.email,
            nome: usuario.nome,
            nivel: usuario.nivel

        });

        res.status(201).send({
            token: token,
            data:{
                email: usuario.email,
                nome: usuario.nome,
            }
        });
    }catch(e){
        res.status(500).send({
            message: "Usuário e/ou senha inválidos!"
        });
    }
};

exports.updateToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token']; //Obetendo token;
        const dadosToken = await authService.decodeToken(token); //Salvando na variável o id, nome e email contido no token;
        const usuario =  await repositorio.getById(dadosToken.id); //Buscando usuário pelo id do token;

        if(!usuario){
            res.status(404).send({
                message: 'Usuário não encontrado!'
            });
            return;
        }

        //Gerando novo token e incluindo o id, email e nome do usuário;
        const tokenAtualizado =  await authService.generateToken({
            id: usuario._id,
            email: usuario.email,
            nome: usuario.nome,
            nivel: usuario.nivel
        });

        res.status(201).send({
            token: tokenAtualizado,
            data:{
                email: usuario.email,
                nome: usuario.nome
            }
        });
    }catch(e){
        console.log(e)
        res.status(500).send({
            message: "Usuário e/ou senha inválidos!"
        });
    }
};