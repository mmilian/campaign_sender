var Autolinker = require('autolinker');
var should = require('should');
var assert = require("assert");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var subscriber = require('../models/subscriber');

var	config = require("../../config/config");
var redirectingTable = require("../models/redirectingTable");

var mailUtils = require("../mailStatisticWraper")(config);

var uniqueIdAsString;
var uniqueIdAsStringArray = [];
var uniqueId;

var createUniqueId = function() {
	uniqueId = new ObjectId();
	uniqueIdAsString = uniqueId.toString();
	uniqueIdAsStringArray.push(uniqueIdAsString);
	return uniqueId;
}

describe('Wrap mail in url to collect statistics:', function() {
	before(function() {
		db = mongoose.connect(config.db);
	});
	after(function() {
		db.disconnect();
	});
	afterEach(function() {
		uniqueIdAsString = null;
		uniqueIdAsStringArray = [];
		uniqueId = null;
	});
	describe('Replace urls in href attr', function() {
		it('When find a href attribiute then should replace it by redirecting url', function() {
			var htmlContent = '<a href="http://efektjow.pl"> This is sample efektjow.pl url </a> <a href="http://efektjow.pl"> This is sample efektjow.pl url </a>';
			var htmlContentWithTrackingUrl = function(hash) {
				return '<a href="' + config.hostName + config.rederictingPath + '?id=' + hash[0] + '"> This is sample efektjow.pl url </a> <a href="' + config.hostName + config.rederictingPath + '?id=' + hash[1] + '"> This is sample efektjow.pl url </a>';
			};
			mailUtils.wrapMailInTrackingUrls(htmlContent, 'email@email.com','mati', 'campaignId', createUniqueId).should.equal(htmlContentWithTrackingUrl(uniqueIdAsStringArray));
		});
	});
	describe('Redirecting urls', function() {
		it('When find a url then should replace it by a tag with redirecting url', function() {
			var htmlContent = 'This is sample efektjow.pl url';
			var htmlContentWithTrackingUrl = function(hash) {
				return 'This is sample <a href="' +config.hostName + config.rederictingPath + '?id=' + hash + '" target="_blank">efektjow.pl</a> url';
			}
			mailUtils.wrapMailInTrackingUrls(htmlContent, 'email@email.com','mati', 'campaignId', createUniqueId).should.equal(htmlContentWithTrackingUrl(uniqueIdAsString));
		});
	});
	describe('Unsubscribing', function() {
		it('Add unsubscribe link', function() {
			var htmlContent = 'This is sample url <br> #Unsubscribe#';
			var htmlContentWithTrackingUrl = function(hash) {
				return 'This is sample url <br> <a href="'+config.hostName + config.unsubscribePath + '?id=' + hash + '" target="_blank">Nie chcę więcj otrzymywać maili od zmieleni.pl i efektjow.pl</a>';
			}
			mailUtils.wrapMailInTrackingUrls(htmlContent, 'email@email.com','mati', 'campaignId', createUniqueId).should.eql(htmlContentWithTrackingUrl(uniqueIdAsString));
		});
	});
	describe('Collect OpenRate stats', function() {
		it('Add open rate image', function() {
			var htmlContent = 'This is sample url #OpenRate#';
			var htmlContentWithTrackingUrl = function(hash) {
				return 'This is sample url <img href="'+config.hostName + config.openRatePath + '?id=' + hash + '"/>';
			}
			mailUtils.wrapMailInTrackingUrls(htmlContent, 'email@email.com','mati', 'campaignId', createUniqueId).should.equal(htmlContentWithTrackingUrl(uniqueIdAsString));
		});
	});
	describe('Replace placeholder by nick name in html content', function(done) {

		before(function(done) {
			//add some test data    
			subscriber.register({
				nick: 'mati',
				email: 'test@test.com'
			}, function(doc) {
				currentSubscriber = doc;
				done();
			});
		});
		after(function(done) {
			subscriber.model.remove({}, function() {
				done();
			});
		});

		before(function() {
			var htmlContent = '<a href="http://efektjow.pl/#Nick#/"> This is sample nick </a>';
			var htmlContentWithTrackingUrl = function(hash) {
				return '<a href="' + config.hostName + config.rederictingPath + '?id=' + hash + '"> This is sample nick </a>';
			};
			mailUtils.wrapMailInTrackingUrls(htmlContent, 'email@email.com','mati', 'campaignId', createUniqueId).should.equal(htmlContentWithTrackingUrl(uniqueIdAsStringArray));
		});

		it('Replace nick', function(done) {
			redirectingTable.findById(uniqueId, function(err, result) {
				result.url.should.equal('http://efektjow.pl/mati/');
				done();
			});
		});
	});
});