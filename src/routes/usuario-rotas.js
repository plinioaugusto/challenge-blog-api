'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario-controller');
const authService = require('../services/auth-service');

router.get('/',authService.isAdministrador, controller.get);
router.get('/id/:id',authService.isLeitor, controller.getById);
router.post('/',authService.isAdministrador, controller.post);
router.put('/:id',authService.isLeitor, controller.put);
router.put('/inativar/:id',authService.isAdministrador, controller.inactivate);
router.put('/ativar/:id',authService.isAdministrador, controller.activate);
router.delete('/',authService.isAdministrador, controller.delete);
router.post('/autenticar', controller.authenticate);
router.post('/atualizarToken', controller.updateToken);

module.exports = router;