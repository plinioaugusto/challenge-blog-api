"use strict";

const jwt = require("jsonwebtoken");

exports.generateToken = async (data) => {
  return jwt.sign(data, global.KEY_ENCODER, {
    expiresIn: 1800,
  });
};

exports.decodeToken = async (token) => {
  var data = await jwt.verify(token, global.KEY_ENCODER);
  return data;
};

exports.authorize = function (req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      message: "Restricted access",
    });
  } else {
    jwt.verify(token, global.KEY_ENCODER, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: "Invalid Token",
        });
      } else {
        next();
      }
    });
  }
};

exports.isAdministrator = function (req, res, next) {
  checkPermission(req, res, next, ["Administrator"]);
};

exports.isReviewer = function (req, res, next) {
  checkPermission(req, res, next, ["Reviewer", "Administrator"]);
};

exports.isEditor = function (req, res, next) {
  checkPermission(req, res, next, ["Editor", "Reviewer", "Administrator"]);
};

exports.isReader = function (req, res, next) {
  checkPermission(req, res, next, [
    "Reader",
    "Editor",
    "Reviewer",
    "Administrator",
  ]);
};

function checkPermission(req, res, next, permissions) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({
      message: "Invalid Token",
    });
  } else {
    jwt.verify(token, global.KEY_ENCODER, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: "Invalid Token",
        });
      } else {
        if (permissions.indexOf(decoded.level) > -1) {
          next();
        } else {
          res.status(403).json({
            message: "This functionality is restricted to " + permissions[0],
          });
        }
      }
    });
  }
}
