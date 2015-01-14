var	config = require("../../config/config");
var mailStatisticWraper = require("../mailStatisticWraper")(config);
var scheduleMessages = require("../scheduleMessages");


exports.create = function(req, res) {
	console.log(req.body);
	var data = req.body;
	scheduleMessages.scheduleCampaignToAllSubscribers(data,mailStatisticWraper,function(e,r) {
		if (e) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(r);
		}
	});	
};