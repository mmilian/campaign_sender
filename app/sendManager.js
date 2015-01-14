var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
var sendingEngine = require('./sendService');
var ScheduledMessage = require("./models/scheduledMessage.js");


var SendManager = function(config) {
	var sender = config.mailSender;
	var sendService = sendingEngine.sendService;
	var _sendAllMessages = function(cb) {
		ScheduledMessage.findMessagesReadyToSendOut(function(err,messages) {
			//console.log(messages);
			sendService.send(messages,sender,function(err,response) {
				console.log(response);
				console.log(err);
				cb(err,{sent : response.sent});
			}); 			
		});	
	};
	this.sendAllMessages = _sendAllMessages;
	return this;
};

module.exports = SendManager;