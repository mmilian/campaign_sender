var senderController = function(sender,limit) {
	var _sender = sender;
	var _limitPerDay = limit || 9999;
	var _sentPerDay = 0;
	console.log("Limit " + _limitPerDay);
	
	_isAvailable = function(cb) {
		if (_limitPerDay > _sentPerDay) {			
			return true;
		}
		return false;
	};

	_sendMail = function(msg,cb) {
		_sentPerDay++;
		_sender.sendMail(msg,cb);
	};

	return {
		isAvailable : _isAvailable,
		sendMail : _sendMail
	}
}

module.exports = senderController; 