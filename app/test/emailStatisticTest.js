//var Subscriber = {}
var should = require('should');
var assert = require("assert");
var subscriber = require('../models/subscriber');
var bus = require("../utility/globalEventBus");
var redirectingTable = require("../models/redirectingTable");
var mongoose = require("mongoose");  
var	config = require("../../config/config");
var statistic = require("../emailStatistic");

describe('Email statistic tracker', function () {
	var hash;
	before(function () {
		db = mongoose.connect(config.db);
	});
	after(function () {
		db.disconnect();
	});

	beforeEach(function(done) {
		redirectingTable.createNewEntry({email : 'email@email.com', url:'http://efektjow.pl',campaignId :'campaignId'},function(err,doc) {			
			hash = doc._id;
			subscriber.register({nick:'nick',email:'email@email.com'}, function(doc){      
				done(); 
			});
		});
	});

	afterEach(function(done){    
		redirectingTable.model.remove({}, function() {      
			subscriber.model.remove({},function() {
				done();
			});
		});  
	});
	
	it('open email:', function (done) {
		statistic.mailOpened(hash,function() {
			subscriber.findByEmail('email@email.com',function(err,doc) {				
				doc.campaigns[0].campaignId.should.equal('campaignId');
				doc.campaigns[0].opened.counter.should.equal(1);
				done();
			});
		});
	});
	it('Campaign clicked:', function (done) {
		statistic.linkClicked(hash,function() {
			subscriber.findByEmail('email@email.com',function(err,doc) {				
				doc.campaigns[0].campaignId.should.equal('campaignId');				   
				doc.campaigns[0].linkClicked[0].clicked.should.equal(1);
				doc.campaigns[0].linkClicked[0].url.should.equal('http://efektjow.pl');
				done();
			});
		});
	});
	it('Unscubscribe clicked:', function (done) {
		statistic.mailOpened
		statistic.unsubscribeClicked(hash,function() {
			subscriber.findByEmail('email@email.com',function(err,doc) {				
				doc.status.should.equal('unsubscribed');
				done();
			});
		});
	});

});