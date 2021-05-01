'use strict';

const mongoose = require('mongoose');
const Categoria = mongoose.model('Categoria');

exports.get = async() =>{
    const res = await Categoria.find({});
    return res;
}

exports.getById = async(id) =>{
    const res =  await Categoria.findById(id);
    return res;
}

exports.post = async(data) =>{
    var categoria = new Categoria(data);
    await categoria.save()
}

exports.put = async(id, data) =>{
    await Categoria.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            ativa:  data.ativa
        }
    })
}

exports.delete = async(id) => {
    await Categoria.findByIdAndUpdate(id,{
        $set:{
            ativa: false
        }
    });
}