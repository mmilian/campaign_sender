var	config = require("../../config/config");


exports.senders = function(req, res) {
	res.json(config.mailSender.getSenderStatus());
};