var should = require('should');
var assert = require("assert");
var ScheduledMessage = require("../models/scheduledMessage.js");
var mongoose = require('mongoose');
var	config = require("../../config/config");

var db;
describe('Scheduled messages', function(){
	before(function () {
		db = mongoose.connect(config.db);  
	});
	after(function () {
		db.disconnect();
	});
	afterEach(function(done) {
		ScheduledMessage.remove({},function(err){
			if (err) {
				console.log("Problem removing ScheduledMessage");				
			}
			done();
		});
	});

	it('create object from model ScheduledMessage', function(){
		var msg = createInvitationScheduledMessage({email : 'fundacja@jow.pl', campaignId : 'campaignId'});		
		msg.should.be.an.instanceOf(ScheduledMessage);
		msg.should.have.property('to', 'fundacja@jow.pl');
		msg.should.have.property('planedSendDate', new Date(2014, 12, 25, 8, 30));
		msg.should.have.property('campaignId');
		msg.should.have.property('from','kontakt@efektjow.pl');
		msg.should.have.property('subject', 'This is sample subject');
		msg.should.have.property('text','This is sample text body');
		msg.should.have.property('html', '<h1>This is sample html body </h1>'); 
	});

	it('save scheduledMessage and find it', function(done){
		var scheduledMessage = createInvitationScheduledMessage({email : 'fundacja@jow.pl'});
		scheduledMessage.save(function(err) {
			if (err) {
				console.log("err");
			} else {
				ScheduledMessage.findOne({to:'fundacja@jow.pl'},function(err,scheduled) {
					scheduled.should.have.property('to', 'fundacja@jow.pl');					
				});
			}
			done();
		});
	});

	it('findAll scheduled messages, which are ready to send (planedSendDate < now())',function(done) {
		ScheduledMessage.create(createInvitationScheduledMessage({email : 'fundacja1@jow.pl', date : Date.now()}),
			createInvitationScheduledMessage({email:'fundacja2@jow.pl', date:Date.now()}),
			createInvitationScheduledMessage({email:'fundacja3@jow.pl', date:new Date(2999,11,17).toISOString()}),			
			function(err) {
				ScheduledMessage.findMessagesReadyToSendOut(function(err,messages) {
					if (err) {
						console.log("Can not save collcection");
					}					
					(messages.length).should.be.exactly(2);
					done();
				});
			});		
	});

	function createInvitationScheduledMessage(data) {
		
		return new ScheduledMessage(
		{
			to	: data.email,
			planedSendDate : data.date || new Date(2014, 12, 25, 8, 30),
			campaignId : data.campaign || null,
			from : data.from || 'kontakt@efektjow.pl',
			subject : data.subject || 'This is sample subject',
			text : data.text || 'This is sample text body',
			html : data.html || '<h1>This is sample html body </h1>'
		}
		);
	};
})
