'use strict';

var should = require('should');
var senderController = require('../../utility/mails/senderController');
var config = require('../../../config/config');

describe('Read GMAIL_CREDENTIALS:', function() {
	it('expected to have a list of senders', function (done) {
		var senders = require('../../../config/gmailSenders');
		senders.constructor.should.equal(Array);
		senders.length.should.equal(1);
		senders[0].transporter.options.service.should.equal('gmail');
		done();
	});
	it('should create senderController', function (done) {
		var senders = require('../../../config/gmailSenders');
		var controller = senderController(senders[0]);
		console.log(controller.isAvailable());
		controller.isAvailable().should.equal(true);
		done(); 
	});
});

//var MultiSender = require('../../utility/mails/multiSender')
var multiSender = config.mailSender;

describe('Multi sender', function () {

	it('has sendMail function', function (done) {
		multiSender.sendMail({},function(err,res) {			
			should.not.exist(err);
			should.exist(res);
			done();
		});
	});

/*	it('can not sent when no available senders', function (done) {
		multiSender = MultiSender([nodemailer.createTransport(stubTransport())]);		
		multiSender.sendMail({},function(err,res) {			
			should.exist(err);
			should.not.exist(res);
			done();
		});
	});*/
});

/*function testuje() {var a = 0; var _setA = function(val) {a=val; }; var _showA = function() {console.log(a); }; return {setA : _setA, showA : _showA }; }*/