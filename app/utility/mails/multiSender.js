'use strict';

var _ = require('lodash');
var senderController = require('./senderController');

var multiSender = function(senders) {

	var _senders = [];	

	_.forEach(senders,function(item) {
		_senders.push(senderController(item.sender,item.limit,item.name));
	});

	console.log("We have " + _senders.length + " senders!");

	var getFirstAvailableSender = function() {
		var sender = _.find(_senders, function(sender) {
			return sender.isAvailable();			
		});
		return sender;		
	};

	return {
		sendMail : function(msg,cb) {
			var sender = getFirstAvailableSender();
			if (sender) {
				sender.sendMail(msg,cb);		
			} else {
				cb(new Error("no available senders"));			
			}
		},
		getSenderStatus : function() {
			return _senders.map(function(item) {
				return item.status;
			});
		}
	}
};

module.exports = multiSender;