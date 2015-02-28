var should = require('should');
var assert = require("assert");
var mongoose = require("mongoose");  
var _ = require('lodash');
var config = require("../../config/config");
var sentMailLogEvent = require("../models/sentMailLogEvent");
var yesterday = function() {
  var d = new Date
  d.setDate(d.getDate() - 1);
  return d
 };


//= require("../models/subscribers");  
//tell Mongoose to use a different DB - created on the fly
//mongoose.connect('mongodb://localhost/efektjow_test');  
var db;

describe("SentMailLogEvent:", function(){  
  before(function () {
    db = mongoose.connect(config.db);  
  });
  after(function () {
    db.disconnect();
  });
  afterEach(function (done) {
    sentMailLogEvent.model.remove({},function() {
      done();
    });
  });
  it('can create new entry', function (done) {
  	var data = {
  		senderId : 'senderId'
  	}
  	sentMailLogEvent.create(data,function(err,res) {
  		should.not.exist(err);
  		//res.senderId.equals()
  		done();
  	});
  });
  it('should return number of event stored within 24h for proper sender', function (done) {
    sentMailLogEvent.create({senderId : 'senderId', created : yesterday()},function(err,res) {
      should.not.exist(err);      
      sentMailLogEvent.create({senderId : 'senderId'},function(err,res) {
        should.not.exist(err);
        sentMailLogEvent.sentWithin24h({senderId : 'senderId'},function(err,data) {
          should.not.exist(err);
          data.counter.should.equal(1);          
          //console.log("yesterday " + yesterday());
          done();
        });
      });
    });
  });
 }); 
