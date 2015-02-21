var should = require('should');
var assert = require("assert");
var mongoose = require("mongoose");  
var _ = require('lodash');
var config = require("../../config/config");

var sentMailLogEvent = require('../models/sentMailLogEvent');


//= require("../models/subscribers");  
//tell Mongoose to use a different DB - created on the fly
//mongoose.connect('mongodb://localhost/efektjow_test');  
var db;

describe("sentMailLogEvent:", function(){  
  before(function () {
    db = mongoose.connect(config.db);  
  });
  after(function () {
    db.disconnect();
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
});
