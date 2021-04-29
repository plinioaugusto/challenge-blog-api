'use strict';

const repositorio = require('../repositories/noticia-ex-repositorio');

exports.get = async(req, res, next) =>{
    try{
        var data = await repositorio.buscar(req.body.palavraChave);
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao buscar notícias"
        });
    }
};