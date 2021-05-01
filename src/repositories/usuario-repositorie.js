'use strict';

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const md5 = require('md5');

exports.get = async() =>{
    const res = await Usuario.find({
        ativa: true
    });
    return res;
}

exports.getById = async(id) =>{
    const res =  await Usuario.findById(id);
    return res;
}

exports.post = async(data) =>{
    var usuario = new Usuario(data);
    await usuario.save()
}

exports.put = async(id, data) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            email:  data.email,
            senha:  md5(data.senha + global.CHAVE_CODIFICADORA),
            nivel:  data.nivel,
            ativa:  data.ativa
        }
    })
}


exports.delete = async(id) => {
    await Usuario.findByIdAndRemove(id);
}

exports.inactivate = async(id) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            ativa:  false
        }
    })
}

exports.activate = async(id) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            ativa:  true
        }
    })
}

exports.authenticate = async(data) =>{
    const res = await Usuario.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}