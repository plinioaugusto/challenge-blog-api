'use strict';

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

exports.buscar = async() =>{
    const res = await Usuario.find({
        ativa: true
    });
    return res;
}

exports.buscarById = async(id) =>{
    const res =  await Usuario.findById(id);
    return res;
}

exports.criar = async(data) =>{
    var usuario = new Usuario(data);
    await usuario.save()
}

exports.atualizar = async(id, data) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            email:  data.email,
            senha:  data.senha,
            nivel:  data.nivel,
            ativa:  data.ativa
        }
    })
}

exports.deletar = async(id) => {
    await Usuario.findByIdAndRemove(id);
}

exports.inativar = async(id) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            ativa:  false
        }
    })
}

exports.ativar = async(id) =>{
    await Usuario.findByIdAndUpdate(id,{
        $set: {
            ativa:  true
        }
    })
}

exports.autenticar = async(data) =>{
    const res = await Usuario.findOne({
        email: data.email,
        senha: data.senha
    });
    return res;
}