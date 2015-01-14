var should = require('should');
var assert = require("assert");
//var bus = require("../utility/globalEventBus.js");
var redirectingTable = require("../models/redirectingTable.js");
var mongoose = require('mongoose');
var	config = require("../../config/config");
var db;

describe('redirecting table to hold reference to orginal url ', function() {
	describe('creating new redirections', function() {
		before(function () {
			db = mongoose.connect(config.db);  
		});
		after(function () {
			db.disconnect();
		});

		afterEach(function(done) {
			redirectingTable.model.remove({},function() {
				done();
			});
		});

		it('create a new entry in redirection table', function(done) {	
			redirectingTable.createNewEntry({email:'fundacja@jow.pl',url:'https://efektjow.pl/redirectUrls', campaignId : 'campaignId'}, function(err,result) {
				should.not.exist(err);
				should.exist(result);
				redirectingTable.findById(result._id,function(err,result) {
					should.not.exist(err);
					result.email.should.equal('fundacja@jow.pl');
					result.url.should.equal('https://efektjow.pl/redirectUrls');
					result.campaignId.should.equal('campaignId');
					done();
				});
			});			
		});
	});
});
