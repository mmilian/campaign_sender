var should = require('should');
var assert = require("assert");
var ScheduledMessage = require("../models/scheduledMessage.js");
var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');
var sendingEngine = require("../sendService.js");
var mongoose = require('mongoose');
var bus = require("../utility/globalEventBus.js");
var	config = require("../../config/config");

//var stubTransport = require('nodemailer-stub-transport');
var sendService = sendingEngine.sendService;

var db;
describe('Send messages service:', function(){
	before(function () {
		db = mongoose.connect(config.db.mongodb);  
	});
	after(function () {
		db.disconnect();
	});
	
	this.timeout(2000);
	
	var yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(new Date)
	
	var sender;
	beforeEach(function() {
		sender = nodemailer.createTransport(stubTransport());
	});

	it('no message to send', function(done){
		sendService.send([],sender,function(err,response) {
			should.not.exist(err);
			response.sent.should.equal(0);
			done();
		});
	});

	it('one message to send and one event should be emited ', function(done){
		var messages = [];
		messages.push(createInvitationScheduledMessage('fundacja@jow.pl',yesterday,'campaignId'));
		bus.registerEventOnce('mail_sent', function(data) {
			data.should.be.eql({email : 'fundacja@jow.pl', campaignId : 'campaignId'});
			done();
		});

		sendService.send(messages,sender,function(err,response) {
			if (err) console.log(err);
		});			
	});

	it('one message to send and we should nr in response', function(done){
		var messages = [];
		messages.push(createInvitationScheduledMessage('fundacja1@jow.pl',yesterday));
		messages.push(createInvitationScheduledMessage('fundacja2@jow.pl',yesterday));
		sendService.send(messages,sender,function(err,response) {
			(response.sent).should.be.exactly(2);
			(response.to[0]).should.be.eql('fundacja1@jow.pl');
			(response.to[1]).should.be.eql('fundacja2@jow.pl');
			response.transport[0].envelope.should.be.eql({from : 'kontakt@efektjow.pl', to : ['fundacja1@jow.pl']});
			response.transport[1].envelope.should.be.eql({from : 'kontakt@efektjow.pl', to : ['fundacja2@jow.pl']});
			done();
		});			
	});
	/*
	function validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	};		
	*/
	function createInvitationScheduledMessage(email,date,campaignId,from,subject,text,html) {
		
		var msg = ScheduledMessage(
		{
			to	: email,
			planedSendDate : date ? date : new Date(2014, 12, 25, 8, 30),
			campaignId : campaignId ? campaignId : 'invitation',
			from : from ? from : 'kontakt@efektjow.pl',
			subject : subject ? subject : 'This is sample subject',
			text : text ? text : 'This is sample text body',
			html : html || '<h1>This is sample html body </h1>'
		}
		);
		return msg;
	};
});
