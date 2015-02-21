'use strict';

var gmailSender = require('gmailSenders');
var multiSender = require('../../app/utility/mails/multiSender')(gmailSenders);

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/efektjow_test',
	mailSender : multiSender,
	hostName : "http://powerful-spire-9361.herokuapp.com"
};
