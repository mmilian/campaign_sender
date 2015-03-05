var sentMailLogEvent = require('../../models/sentMailLogEvent');
var uuid = require('node-uuid');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var senderController = function(sender,limit,name) {
	const _sender = sender;
	const senderId = name || uuid.v1();
	const _limitPerDay = limit || 499;
	var _sentPerDay = 0;

	console.log("senderId " + senderId + "limit " + _limitPerDay);

	setInterval(function() { 
		_sentPerDay = sentMailLogEvent.sentWithin24h({senderId : senderId},function(err,doc) {
			if (!err) {
				console.log("Counter " + doc.counter + " for senderId " + senderId);				
				_sentPerDay = doc.counter
			}
		});
	},5000); 

	eventEmitter.on('sent_mail_log_event_' + senderId,function() {
		//sentMailLogEvent.create({senderId : 'senderId'},function(err,log_event) {
		sentMailLogEvent.create({senderId : senderId},function(err,res) {
			console.log('sent_mail_log_event for sender ' + senderId + " Event: " + res);
		});
	});

	_isAvailable = function(cb) {
		//console.log("_limitPerDay " + _limitPerDay + "; _sentPerDay"  + _sentPerDay);
		if (_limitPerDay > _sentPerDay) {			
			return true;
		}
		return false;
	};

	_sendMail = function(msg,cb) {
		msg.from = senderId;
		_sender.sendMail(msg,function(err,res) {
			if (!err) {
				eventEmitter.emit('sent_mail_log_event_' + senderId);
			}
			cb(err,res);
		});
	};

	return {
		isAvailable : _isAvailable,
		sendMail : _sendMail,
		status : {senderId : senderId, limitPerDay : _limitPerDay, sentToday : _sentPerDay}
	}
}

module.exports = senderController; 