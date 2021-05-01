'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/postagem-controller');
const authService = require('../services/auth-service');


router.get('/', authService.isLeitor, controller.get);
router.get('/id/:id',authService.isLeitor, controller.getById);
router.get('/todos', controller.getByAll);
router.get('/busca/externa',authService.isLeitor, controller.getExterna);
router.post('/',authService.isRedator, controller.post);
router.put('/:id',authService.isRedator, controller.put);
router.put('/publicar/:id',authService.isRevisor, controller.publicar);
router.put('/agendar/:id/:data',authService.isRevisor, controller.agendar);
router.delete('/',authService.isRevisor, controller.delete);

module.exports = router;