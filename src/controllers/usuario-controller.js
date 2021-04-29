'use strict';

const repositorio = require('../repositories/usuario-repositorie');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) =>{
    try{
        var data = await repositorio.buscar();
        res.status(200).send(data);
    }catch(e){
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
        await repositorio.criar({
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
        await repositorio.atualizar(req.params.id, req.body);
        res.status(200).send({
            message: 'Usuario atualizada com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.delete = async(req, res, next) => {
    try{
        await repositorio.deletar(req.body.id);
        res.status(200).send({
            message: 'Usuario removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.inativar = async(req, res, next) => {
    try{
        await repositorio.inativar(req.params.id);
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

exports.ativar = async(req, res, next) => {
    try{
        await repositorio.ativar(req.params.id);
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

exports.autenticar = async(req, res, next) => {
    try{
        const usuario =  await repositorio.autenticar({
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
        const token =  await authService.gerarToken({
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

exports.atualizarToken = async(req, res, next) => {
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token']; //Obetendo token;
        const dadosToken = await authService.decodificarToken(token); //Salvando na variável o id, nome e email contido no token;
        const usuario =  await repositorio.buscarById(dadosToken.id); //Buscando usuário pelo id do token;

        if(!usuario){
            res.status(404).send({
                message: 'Usuário não encontrado!'
            });
            return;
        }

        //Gerando novo token e incluindo o id, email e nome do usuário;
        const tokenAtualizado =  await authService.gerarToken({
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