'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoria-controller');
const authService = require('../services/auth-service');

router.get('/',authService.isRedator, controller.get);
router.get('/id/:id',authService.isRedator, controller.getById);
router.post('/',authService.isRedator, controller.post);
router.put('/:id', authService.isRedator, controller.put);
router.delete('/',authService.isRedator, controller.delete);

module.exports = router;