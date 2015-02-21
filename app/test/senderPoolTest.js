'use strict';

/**
 * Module dependencies.
 */
 var should = require('should'),
 config = require("../../config/config"),
 multiSender = require("../utility/mails/multiSender")(config.senders),
 SenderController = require("../utility/mails/senderController");


 var sender = config.mailSender;

 describe('Multi sender', function () {


 	it('has sendMail function', function (done) {
 		multiSender.sendMail({},function(err,res) {			
 			should.not.exist(err);
 			should.exist(res);
 			done();
 		});
 	});

 	it('can not sent when no available senders', function (done) {
 		multiSender.sendMail({},function(err,res) {			
 			should.not.exist(err);
 			should.exist(res);
 			done();
 		});
 	});
 });

 describe('Sender controller', function () {
 	it('isAvailable() return true if bellow limit', function (done) {
 		var senderController = new SenderController({sender : sender, limitPerDay : 1});
 		var available = senderController.isAvailable();
 		available.should.equal(true);
 		done();
 	});
 	it('isAvailable() return false if no limit', function (done) {
 		var senderController = new SenderController({sender : sender, limitPerDay : 0});
 		var available = senderController.isAvailable();
 		available.should.equal(false);
 		done();
 	});
 	it('isAvailable() return false if limit exeded', function (done) {
 		var senderController = new SenderController({sender : sender, limitPerDay : 1});
 		senderController.sendMail({},function(err,res) {
 			var available = senderController.isAvailable();
 			available.should.equal(false);
 			done();
 		});
 	});
 });
 

