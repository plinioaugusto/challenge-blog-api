"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const authService = require("../services/auth.service");

router.get("/", authService.isEditor, controller.get);
router.get("/id/:id", authService.isEditor, controller.getById);
router.post("/", authService.isEditor, controller.post);
router.put("/:id", authService.isEditor, controller.put);
router.delete("/", authService.isEditor, controller.delete);

module.exports = router;
