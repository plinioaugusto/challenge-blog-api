'use strict';

const mongoose = require('mongoose');
const Categoria = mongoose.model('Categoria');

exports.buscar = async() =>{
    const res = await Categoria.find({});
    return res;
}

exports.buscarById = async(id) =>{
    const res =  await Categoria.findById(id);
    return res;
}

exports.criar = async(data) =>{
    var categoria = new Categoria(data);
    await categoria.save()
}

exports.atualizar = async(id, data) =>{
    await Categoria.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            ativa:  data.ativa
        }
    })
}

exports.deletar = async(id) => {
    await Categoria.findByIdAndRemove(id);
}