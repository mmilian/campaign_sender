var async = require("async");
var EventEmitter = require("events").EventEmitter;

var bus = require("./globalEventBus.js");

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
				response.sent++;
				response.to.push(message.to);
				response.transport.push(info);
				//TODO test for that
				console.log(err);
				if (err) { 
					if (!err.message.localeCompare("no available senders")) {
						console.log("Set null");						
						message.sentLog = null;
					} else 
					message.sentLog = JSON.stringify(err);
				}
				message.save();
				if (info) {
					bus.emitEvent('mail_sent',{campaignId : message.campaignId, email : message.to});
					message.sentLog = JSON.stringify(info);
				message.remove();				
				}				
				callback();
			});					
		}; 

		async.eachSeries(messages,iterator,sendingDone);
	}
};


exports.sendService = sendService;	