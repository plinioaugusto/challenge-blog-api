'use strict';

const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

exports.get = async() =>{
    const res = await Tag.find({
        ativa: true});
    return res;
}

exports.getById = async(id) =>{
    const res =  await Tag.findById(id);
    return res;
}

exports.post = async(data) =>{
    var tag = new Tag(data);
    await tag.save()
}

exports.put = async(id, data) =>{
    await Tag.findByIdAndUpdate(id,{
        $set: {
            nome:  data.nome,
            ativa:  data.ativa
        }
    })
}

exports.delete = async(id) => {
    await Tag.findByIdAndUpdate(id,{
        $set:{
            ativa: false
        }
    });
}