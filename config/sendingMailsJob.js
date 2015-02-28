//schedule sending messages
var SenderManager = require('../app/utility/sendManager');
var	config = require("./config");
var bus = require("../app/utility/globalEventBus.js");

var senderManager = new SenderManager(config);

function sendingMails() {
	setTimeout(senderManager.sendAllMessages, 3000, function(err,result) {
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

