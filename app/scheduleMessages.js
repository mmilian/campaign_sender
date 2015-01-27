var Campaign = require('./models/Campaign');
var	config = require("../config/config");
var mongoose = require("mongoose");
var _ = require('lodash');
var Subscriber = require('./models/subscriber');
var ScheduledMessage = require("./models/scheduledMessage.js");
var mailStatisticWraper = require("./mailStatisticWraper")(config);

var scheduleMessages = {
	scheduleCampaignToAllSubscribers: function(data,wrapMailInTrackingUrls,cb) {
		console.log("data " + data);
		Campaign.findOne({
			id: data.campaignId
		}, function(err, doc) {
			if (err) {
				cb(err);
				return;
			}
			Subscriber.model.find({}, function(err, subscribers) {
				var messages = [];
				_.each(subscribers, function(subscriber) {
					messages.push(ScheduledMessage({
						to: subscriber.email,
						planedSendDate: data.date || Date.now(),
						campaignId: doc.id,
						from: doc.from,
						subject: doc.subject,
						text: doc.text,
						html: wrapMailInTrackingUrls(doc.html,subscriber.email,subscriber.nick,doc.id)//wrapMailInTrackingUrls && _.isFunction(wrapMailInTrackingUrls) ? wrapMailInTrackingUrls(doc.html) : doc.html
					}));;
				});

				ScheduledMessage.create(messages, function(err) {
					var response = {};
					response.scheduledMsg = messages.length;
					cb(err, response);
					return;
				});
			});
		});
	}
}


module.exports = scheduleMessages;