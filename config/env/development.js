'use strict';

var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
var senders = [nodemailer.createTransport(stubTransport())];

var multiSender = require('../../app/utility/mails/multiSender')(senders);

module.exports = {
	db: 'mongodb://localhost/efektjow_dev',
	app: {
		title: 'MEAN - Development Environment'
	},
    mailSender : multiSender,
	hostName : "http://localhost/"
};
