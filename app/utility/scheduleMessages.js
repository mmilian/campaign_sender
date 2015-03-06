'use strict';
var Campaign = require('../models/campaign');
var _ = require('lodash');
var Subscriber = require('../models/subscriber');
var ScheduledMessage = require('../models/scheduledMessage.js');	

var scheduleMessages = {
	scheduleCampaignToAllSubscribers: function(data,wrapMailInTrackingUrls,cb) {
		Campaign.findOne({id: data.campaignId}, function(err, doc) {
			if (err) {	
				cb(err);
				return;
			}
			var parameter = {};
			if (data.source) {
				parameter = {source : data.source};
			}
			parameter.campaignId = data.campaignId;
			Subscriber.findAllSubscribersWhereSourceAndToWhomCampaignWasNotSent(parameter,function(err, subscribers) {
				var messages = [];
				_.each(subscribers, function(subscriber) { 
					messages.push(new ScheduledMessage({
						to: subscriber.email,
						planedSendDate: data.date || Date.now(),
						campaignId: doc.id,
						from: doc.from,
						subject: doc.subject,
						text: doc.text,
						html: wrapMailInTrackingUrls(doc.html,subscriber.email,subscriber.nick,doc.id)
					}));
				});

				ScheduledMessage.create(messages, function(err) {
					var response = {};
					response.scheduledMsg = messages.length || 0;
					cb(err,response);
					return;
				});
			});
		});
	}
};

module.exports = scheduleMessages;