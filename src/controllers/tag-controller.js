'use strict';

const repositorio = require('../repositories/tag-repositorie');

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
        await repositorio.post(req.body);
        res.status(201).send({message: 'Tag cadastrada com sucesso!'});
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
            message: 'Tag atualizada com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};

exports.delete = async(req, res, next) => {
    try{
        await repositorio.delete(req.body.id);
        res.status(200).send({
            message: 'Tag removida com sucesso!'
        });
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
};