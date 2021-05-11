'use strict';
var config = require('../config');
var sendgrid = require('sendgrid')(global.SENDGRID_KEY);

exports.send = async (to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'plinioaugustoadm@hotmail.com',
        subject: subject,
        html: body
    });
}