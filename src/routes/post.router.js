"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const authService = require("../services/auth-service");

router.get("/", authService.isReader, controller.get);
router.get("/id/:id", authService.isReader, controller.getById);
router.get("/all", authService.isReader, controller.getByAll);
router.get("/search/external", controller.getExternal);
router.post("/", authService.isEditor, controller.post);
router.put("/:id", authService.isEditor, controller.put);
router.put("/publish/:id", authService.isReviewer, controller.publish);
router.put("/schedule/:id/:date", authService.isReviewer, controller.schedule);
router.delete("/", authService.isReviewer, controller.delete);

module.exports = router;
