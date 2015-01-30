'use strict';

var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');

var sender = nodemailer.createTransport(stubTransport());


module.exports = {
	db: 'mongodb://localhost/efektjow_dev',
	app: {
		title: 'MEAN - Development Environment'
	},
    mailSender : sender,
	hostName : "http://localhost/"
};
