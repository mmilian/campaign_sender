//schedule sending messages
var SenderManager = require('../sendManager');
var	config = require("../../config/config");
var senderManager = new SenderManager(config);
var bus = require("./globalEventBus.js");


function sendingMails() {
	setTimeout(senderManager.sendAllMessages, 10000, function(err,result) {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
		}
		bus.emitEvent('mails_sent');
	});
};

sendingMails();

bus.registerEvent('mails_sent', function() {
	sendingMails();
});

