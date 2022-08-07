"use strict";
const sendgrid = require("sendgrid")(global.SENDGRID_KEY);

exports.send = async (to, subject, body) => {
  sendgrid.send({
    to,
    from: "user@mail.com",
    subject,
    html: body,
  });
};
