'use strict';

const repositorio = require('../repositories/categoria-repositorie');

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
        await repositorio.criar(req.body);
        res.status(201).send({message: 'Categoria cadastrada com sucesso!'});
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
            message: 'Categoria atualizada com sucesso!'
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
            message: 'Categoria removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};