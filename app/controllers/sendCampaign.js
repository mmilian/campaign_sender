var	config = require("../../config/config");
var mailStatisticWraper = require("../utility/mailStatisticWraper")(config);
var scheduleMessages = require("../utility/scheduleMessages");


exports.create = function(req, res) {
	console.log(req.body);
	var data = req.body;
	scheduleMessages.scheduleCampaignToAllSubscribers(data,mailStatisticWraper.wrapMailInTrackingUrls,function(e,r) {
		if (e) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log("Response  ", r.scheduledMsg);
			return res.json(r);
		}
	});	
};