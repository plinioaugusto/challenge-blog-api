"use strict";

const repository = require("../repositories/user.repository");
const md5 = require("md5");
const emailService = require("../services/email.service");
const authService = require("../services/auth.service");

exports.get = async (req, res, next) => {
  try {
    const users = await repository.get();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await repository.getById(req.params.id);
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.post = async (req, res, next) => {
  const { email, password, name, level } = req.body;
  try {
    await repository.post({
      name,
      email,
      password: md5(password + global.KEY_ENCODER),
      level,
    });

    emailService.send(
      email,
      "Welcome to the Quero Delivery Blog.",
      global.EMAIL_TMPL.replace("{0}", name)
    );

    res.status(201).send({ message: "User registered successfully!" });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.put = async (req, res, next) => {
  const { id } = req.params;
  try {
    await repository.put(id, req.body);
    res.status(200).send({
      message: "User successfully updated!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to update your request.",
    });
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.body;
  try {
    await repository.delete(id);
    res.status(200).send({
      message: "User successfully removed!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to process your request.",
    });
  }
};

exports.inactivate = async (req, res, next) => {
  const { id } = req.params;
  try {
    await repository.inactivate(id);
    res.status(200).send({
      message: "User successfully inactivated!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to inactivate user!",
    });
  }
};

exports.activate = async (req, res, next) => {
  const { id } = req.params;
  try {
    await repository.activate(id);
    res.status(200).send({
      message: "User successfully activated!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Failed to activate user!",
    });
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await repository.authenticate({
      email,
      password: md5(password + global.KEY_ENCODER),
    });

    if (!user) {
      res.status(404).send({
        message: "Invalid username and/or password.",
      });
      return;
    }

    if (user.isActive === false) {
      res.status(404).send({
        message: "Inactive user. Contact your system administrator.",
      });
      return;
    }

    const { id, email, name, level } = user;

    const token = await authService.generateToken({
      id,
      email,
      name,
      level,
    });

    res.status(201).send({
      token,
      data: {
        email,
        name,
      },
    });
  } catch (e) {
    res.status(500).send({
      message: "Invalid username and/or password!",
    });
  }
};

exports.updateToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const dataToken = await authService.decodeToken(token);
    const user = await repository.getById(dataToken.id);

    if (!user) {
      res.status(404).send({
        message: "User not found!",
      });
      return;
    }

    const { id, email, name, level } = user;

    const tokenUpdated = await authService.generateToken({
      id,
      email,
      name,
      level,
    });

    res.status(201).send({
      token: tokenUpdated,
      data: {
        email,
        name,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "User not found!",
    });
  }
};
