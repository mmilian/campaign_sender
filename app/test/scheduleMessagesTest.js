var should = require('should');
var assert = require("assert");
var	config = require("../../config/config");
var mongoose = require("mongoose");
var _ = require('lodash');
var Subscriber = require('../models/subscriber');
var ScheduledMessage = require("../models/scheduledMessage.js");
var Campaign = require('../models/campaign');
var mailStatisticWraper = require("../utility/mailStatisticWraper")(config);
var scheduleMessages = require("../utility/scheduleMessages");

var yesterday = (function(d) {
	d.setDate(d.getDate() - 1);
	return d
})(new Date);

var db;


describe('Send messages', function() {
	before(function() {
		db = mongoose.connect(config.db);
	});
	after(function() {
		db.disconnect();
	});
	beforeEach(function(done) {
		campaign = new Campaign({
			id: 'campaignId',
			name: 'Name',
			description: 'Full Name',
			html: '<html> #OpenRate# Mail</html>',
			text: 'text',
			from: 'mateusz.milian@gmail.com',
			subject: 'subject'
		});
		campaign.save(function() {
			done();
		});
	});
	beforeEach(function(done) {
		//add some test data    
		Subscriber.register({
			nick: 'nick1',
			email: 'test1@test.com'
		}, function(err, doc) {
			Subscriber.register({
				nick: 'nick2',
				email: 'test2@test.com'
			}, function(err, doc) {
				done();
			});
		})
	});
	afterEach(function(done) {
		ScheduledMessage.remove({}, function(err) {
			done();
		});
	});
	afterEach(function(done) {
		Subscriber.model.remove({}, function() {
			done();
		});
	});
	afterEach(function(done) {
		Campaign.remove({}, function() {
			done();
		});
	});


	it('send given campaign to all subscribers', function(done) {
		scheduleMessages.scheduleCampaignToAllSubscribers({campaignId :'campaignId', date : yesterday}, mailStatisticWraper.wrapMailInTrackingUrls, function(err, response) {
			response.scheduledMsg.should.equal(2);
			ScheduledMessage.findOne({to:'test1@test.com'},function (err, msg) {
				msg.html.indexOf(config.openRatePath).should.not.equal(-1);
				done();				
			});
		});
	});	
});