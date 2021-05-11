'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/postagem-controller');
const authService = require('../services/auth-service');


router.get('/', authService.isLeitor, controller.get);
router.get('/id/:id',authService.isLeitor, controller.getById);
router.get('/todos',authService.isLeitor, controller.getByAll);
router.get('/busca/externa', controller.getExternal);
router.post('/',authService.isRedator, controller.post);
router.put('/:id',authService.isRedator, controller.put);
router.put('/publicar/:id',authService.isRevisor, controller.publish);
router.put('/agendar/:id/:data',authService.isRevisor, controller.schedule);
router.delete('/',authService.isRevisor, controller.delete);

module.exports = router;