'use strict';

var _ = require('lodash');
var senderController = require('./senderController');

var multiSender = function(senders) {

	var _senders = [];	
	var pointer = 0;
	_.forEach(senders,function(item) {
		var limit = null;
		if (item.transporter.options.service === 'gmail')
			limit=500;
		_senders.push(senderController(item,limit));
	});

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
		}
	}
};

module.exports = multiSender;