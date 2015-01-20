var subscriber = require('./models/subscriber');
var bus = require("./utility/globalEventBus.js");
var redirectingTable = require("./models/redirectingTable.js");
var mongoose = require("mongoose");  
var	config = require("../config/config");


var EmailStatistic = function() {
	
	var _mailOpened = function(id,cb) {
		redirectingTable.findById(id, function(err,data) {
			console.log("Find by id %s", data);
			subscriber.campaignOpened(data.campaignId,data.email,function() {
				console.log('Campaign with id %s has been opened by %s and added to statistics',id,data.email);
				cb();
			}, function(err) {
				console.log('Campaign with id %s has been opened by %s but could not be added to statistics: %s',id,data.email,err);
				cb();
			});
		});
	};
	var test = 'test';
	var _linkClicked = function(id,cb) {
		redirectingTable.findById(id, function(err,data) {
			subscriber.linkClicked(data.campaignId,data.url,data.email,function() {
				console.log('Campaign with id %s has been opened by %s and added to statistics',id,data.email);
				cb();
			}, function(err) {
				console.log('Campaign with id %s has been opened by %s but could not be added to statistics: %s',id,data.email,err);
				cb();
			});
		});
	};

	var _unsubscribeClicked = function(id,cb) {
		console.log("WWWW");
		redirectingTable.findById(id, function(err,data) {
			console.log("Find by id %s", data);
			subscriber.unsubscribe(data.email,function() {
				console.log('Campaign with id %s has been opened by %s and added to statistics',id,data.email);
				cb();
			}, function(err) {
				console.log('Campaign with id %s has been opened by %s but could not be added to statistics: %s',id,data.email,err);
				cb();
			});
		});
	};

	bus.registerEvent('mail_opened', function(id) {
		_mailOpened(id);
	});
	bus.registerEvent('link_clicked', function(id) {
		_linkClicked(id);
	});
	bus.registerEvent('unsubscribe_clicked', function(id) {
		_unsubscribeClicked(id);
	});
	
	return {
		mailOpened : _mailOpened,
		linkClicked : _linkClicked,
		unsubscribeClicked : _unsubscribeClicked	
	}
}();

module.exports=EmailStatistic;