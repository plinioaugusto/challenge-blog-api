'use strict';

const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

exports.buscar = async() =>{
    const res = await Tag.find({});
    return res;
}

exports.buscarById = async(id) =>{
    const res =  await Tag.findById(id);
    return res;
}

exports.criar = async(data) =>{
    var tag = new Tag(data);
    await tag.save()
}

exports.atualizar = async(id, data) =>{
    await Tag.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            ativa:  data.ativa
        }
    })
}

exports.deletar = async(id) => {
    await Tag.findByIdAndRemove(id);
}