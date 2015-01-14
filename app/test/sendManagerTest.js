var should = require('should');
var assert = require("assert");
var ScheduledMessage = require("../models/scheduledMessage.js");
var mongoose = require('mongoose');
var SenderManager = require('../sendManager');
var	config = require("../../config/config");


var senderManager = new SenderManager(config);

var db;

describe('Send manager:', function(){
	this.timeout(10000);
	before(function () {
		db = mongoose.connect(config.db);  
	});
	after(function () {
		db.disconnect();
	});

	var yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(new Date)

	beforeEach(function(done) {
		ScheduledMessage.create(createInvitationScheduledMessage('fundacja1@jow.pl', yesterday.toISOString()),
			createInvitationScheduledMessage('fundacja2@jow.pl', yesterday.toISOString()),
			createInvitationScheduledMessage('fundacja3@jow.pl', new Date(2999,11,17).toISOString()),
			function() {
				done();
			});
	});



/*	beforeEach(function(done) {
		ScheduledMessage.create(createInvitationMail(details),
			function(err,doc) {
				console.log('Err: ',err);
				done();
			});
	});*/

	afterEach(function(done) {
		ScheduledMessage.remove({},function(err){
			if (err) {
				console.log("Problem removing ScheduledMessage");				
			}
			done();
		});
	});

	it('find all ready to send messages and send out them all', function(done){
		senderManager.sendAllMessages(function(err,response) {
			assert.equal(null,err);
			console.log("err " + err);
			console.log("response " + response);
			//response.should.have.property('sent',2);
			done();
		}); 
	});

	function createInvitationScheduledMessage(email,date,campaignType,from,subject,text,html) {

		var msg = ScheduledMessage(
		{
			to	: email,
			planedSendDate : date ? date : new Date(2014, 12, 25, 8, 30),
			campaignType : campaignType ? campaignType : 'invitation',
			from : from ? from : 'mateusz.milian@gmail.com',
			subject : subject ? subject : 'This is test message send by script from efektjow.pl',
			text : text ? text : 'Daj znać jak dostaniesz tą wiadomość /Mateusz',
			html : html || '<h1>Daj znać jak dostaniesz tą wiadomość /Mateusz</h1>'
		}
		);
		return msg;
	};		
});