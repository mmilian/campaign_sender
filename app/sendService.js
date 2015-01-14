var async = require("async");
var EventEmitter = require("events").EventEmitter;

var bus = require("./utility/globalEventBus.js");

var sendService = {

	send : function(messages,sender,cb) {

		var response = {
			sent : 0,
			to : [],
			transport : []
		};


		function sendingDone(err) {
			if (err) {
				console.log("Sending mails done with errors" + err); 
				cb(err,response);
			}
			else {
				cb(null,response);
			}
		};

		function iterator(message,callback) {										
			sender.sendMail(message,function(err,info) {
				bus.emitEvent('mail_sent',message.to);
				console.log(err);
				response.sent++;
				response.to.push(message.to);
				response.transport.push(info);
				message.sentLog = JSON.stringify(response);
				message.save();
				callback();
				});					
		}; 

		async.eachSeries(messages,iterator,sendingDone);
	}
};


exports.sendService = sendService;	