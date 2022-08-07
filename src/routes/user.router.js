"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const authService = require("../services/auth-service");

router.get("/", authService.isAdministrator, controller.get);
router.get("/id/:id", authService.isReader, controller.getById);
router.post("/", authService.isAdministrator, controller.post);
router.put("/:id", authService.isReader, controller.put);
router.put(
  "/inactivate/:id",
  authService.isAdministrator,
  controller.inactivate
);
router.put("/activate/:id", authService.isAdministrator, controller.activate);
router.delete("/", authService.isAdministrator, controller.delete);
router.post("/authenticate", controller.authenticate);
router.post("/updateToken", controller.updateToken);

module.exports = router;
