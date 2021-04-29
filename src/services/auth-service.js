'use strict';

const jwt = require('jsonwebtoken');

//Gerando o Token
exports.gerarToken = async (data) => {
    return jwt.sign(data, global.CHAVE_CODIFICADORA, {
        expiresIn: 1800
    });
}

//Decodificando o Token
exports.decodificarToken = async (token) => {
    var data = await jwt.verify(token, global.CHAVE_CODIFICADORA);
    return data;
}

//Autorizar token
exports.autorizar = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];//Buscando meu token nesses três campos.

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito' //Caso usuário não esteja autenticado.
        });
    } else {
        jwt.verify(token, global.CHAVE_CODIFICADORA, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido' //Usuário pode estar autorizado, mas o token expirou.
                });
            } else {
                next();//O usuário pode prosseguir com a requisição.
            }
        });
    }
};

//Autorização
exports.isAdministrador = function (req, res, next) {
    verificarPermissao(req, res, next,['Administrador']);
};

exports.isRevisor = function (req, res, next) {
    verificarPermissao(req, res, next,['Revisor','Administrador']);
};

exports.isRedator = function (req, res, next) {
    verificarPermissao(req, res, next,['Redator','Revisor','Administrador']);
};

exports.isLeitor = function (req, res, next) {
    verificarPermissao(req, res, next,['Leitor','Redator','Revisor','Administrador']);
};

function verificarPermissao(req, res, next, permissoes) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Token Inválido'
        });
    } else {
        jwt.verify(token, global.CHAVE_CODIFICADORA, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                if (permissoes.indexOf(decoded.nivel)> -1) {
                    next();
                } else {
                    res.status(403).json({
                        message: 'Esta funcionalidade é restrita para ' + permissoes[0]
                    });
                }
            }
        });
    }
};