var should = require('should');
var assert = require("assert");
var mongoose = require("mongoose");  
var _ = require('lodash');
var config = require("../../config/config");

var subscriber = require('../models/subscriber');


//= require("../models/subscribers");  
//tell Mongoose to use a different DB - created on the fly
//mongoose.connect('mongodb://localhost/efektjow_test');  
var db;

describe("Subscribers:", function(){  
  before(function () {
    db = mongoose.connect(config.db);  
  });
  after(function () {
    db.disconnect();
  });
  describe('managing subscribe(registration) process', function () {
    var currentSubscriber = null;  

    beforeEach(function(done){    
    //add some test data    
    subscriber.register({nick:'nick',email:'test@test.com'}, function(doc){      
      currentSubscriber = doc;      
      done();    
    });  
  });  

    afterEach(function(done){    
      subscriber.model.remove({}, function() {      
        done();    
      });  
    });

    it("registers a new subscriber", function(done){    
      subscriber.register({nick : 'nick2', email : "test2@test.com"}, function(doc){      
        doc.email.should.equal('test2@test.com');      
        doc.nick.should.equal('nick2');
        done();    
      }); 
    });
  });

  describe('subscribers open campaigns', function () {

    beforeEach(function(done){    
    //add some test data    
    subscriber.register({nick:'nick',email:'test@test.com'}, function(doc){      
      currentSubscriber = doc;      
      done();    
    });  
  });  

    afterEach(function(done){    
      subscriber.model.remove({}, function() {      
        done();    
      });  
    });


    it("campaig open first time for a user", function(done){    
      subscriber.campaignOpened('campaignId','test@test.com',function(doc){      
        doc.email.should.equal('test@test.com');
        (doc.campaigns[0].opened.counter).should.equal(1);
        (doc.campaigns[0].campaignId).should.equal('campaignId');
        done();    
      }); 
    });
    it("campaig open second time for a user", function(done){    
      subscriber.campaignOpened('campaignId','test@test.com',function(doc){      
        subscriber.campaignOpened('campaignId','test@test.com', function(doc) {
          doc.email.should.equal('test@test.com');
          (doc.campaigns[0].opened.counter).should.equal(2);
          (doc.campaigns[0].opened.openDate.length).should.equal(2);
          (doc.campaigns[0].opened.counter).should.equal(2);
          (doc.campaigns[0].campaignId).should.equal('campaignId');
          done();
        });  
      }); 
    });

    it("two diffrent campaign opened", function(done){    
      subscriber.campaignOpened('campaignId','test@test.com',function(doc){      
        subscriber.campaignOpened('campaignId2','test@test.com', function(doc) {
          doc.email.should.equal('test@test.com');
          (doc.campaigns.length).should.equal(2);
          (doc.campaigns[0].opened.openDate.length).should.equal(1);
          (doc.campaigns[0].opened.counter).should.equal(1);
          (doc.campaigns[0].campaignId).should.equal('campaignId');
          (doc.campaigns[1].opened.openDate.length).should.equal(1);
          (doc.campaigns[1].opened.counter).should.equal(1);
          (doc.campaigns[1].campaignId).should.equal('campaignId2');
          done();
        });  
      }); 
    });
  });
describe('subscribers click links', function () {
  beforeEach(function(done){    
    //add some test data    
    subscriber.register({nick:'nick',email:'test@test.com'}, function(doc){      
      currentSubscriber = doc;      
      done();    
    });  
  });  

  afterEach(function(done){    
    subscriber.model.remove({}, function() {      
      done();    
    });  
  });
  
  it('link clicked once', function (done) {
    subscriber.linkClicked('campaignId','http://efektjow.pl/link','test@test.com', function(doc) {
      doc.email.should.equal('test@test.com');          
      doc.campaigns[0].campaignId.should.equal('campaignId');          
      doc.campaigns[0].linkClicked[0].url.should.equal('http://efektjow.pl/link');
      doc.campaigns[0].linkClicked[0].clicked.should.equal(1);
      doc.campaigns[0].linkClicked[0].clickedDate.length.should.equal(1);
      done();
    });
  });
  it('the same link clicked twice', function (done) {
    subscriber.linkClicked('campaignId','http://efektjow.pl/link','test@test.com', function(doc) {
      subscriber.linkClicked('campaignId','http://efektjow.pl/link','test@test.com', function(doc) {
        doc.email.should.equal('test@test.com');          
        doc.campaigns[0].campaignId.should.equal('campaignId');          
        doc.campaigns[0].linkClicked[0].url.should.equal('http://efektjow.pl/link');
        doc.campaigns[0].linkClicked[0].clicked.should.equal(2);
        doc.campaigns[0].linkClicked[0].clickedDate.length.should.equal(2);
        done();
      });
    });
  });
  it('two diffrent links from the same campaign clicked', function (done) {
    subscriber.linkClicked('campaignId','http://efektjow.pl/link','test@test.com', function(doc) {
      subscriber.linkClicked('campaignId','http://efektjow.pl/link2','test@test.com', function(doc) {
        doc.email.should.equal('test@test.com');          
        doc.campaigns[0].campaignId.should.equal('campaignId');          
        doc.campaigns[0].linkClicked[0].url.should.equal('http://efektjow.pl/link');
        doc.campaigns[0].linkClicked[0].clicked.should.equal(1);
        doc.campaigns[0].linkClicked[0].clickedDate.length.should.equal(1);
        doc.campaigns[0].linkClicked[1].url.should.equal('http://efektjow.pl/link2');
        doc.campaigns[0].linkClicked[1].clicked.should.equal(1);
        doc.campaigns[0].linkClicked[1].clickedDate.length.should.equal(1);
        done();
      });
    });
  });
  it('two diffrent links from two diffrent campaigns clicked', function (done) {
    subscriber.linkClicked('campaignId','http://efektjow.pl/link','test@test.com', function(doc) {
      subscriber.linkClicked('campaignId2','http://efektjow.pl/link2','test@test.com', function(doc) {
        doc.email.should.equal('test@test.com');          
        doc.campaigns[0].campaignId.should.equal('campaignId');          
        doc.campaigns[0].linkClicked[0].url.should.equal('http://efektjow.pl/link');
        doc.campaigns[0].linkClicked[0].clicked.should.equal(1);
        doc.campaigns[0].linkClicked[0].clickedDate.length.should.equal(1);
        doc.campaigns[1].linkClicked[0].url.should.equal('http://efektjow.pl/link2');
        doc.campaigns[1].linkClicked[0].clicked.should.equal(1);
        doc.campaigns[1].linkClicked[0].clickedDate.length.should.equal(1);
        done();
      });
    });
  });
});
describe('managing unsubscribe process', function () {
 beforeEach(function(done){    
    //add some test data    
    subscriber.register({nick:'nick',email:'test@test.com'}, function(doc){      
      currentSubscriber = doc;      
      done();    
    });  
  });  

 afterEach(function(done){    
  subscriber.model.remove({}, function() {      
    done();    
  });  
});
 it('unsubscribe link clicked', function(done) {
  subscriber.unsubscribe('test@test.com',function(doc) {
    doc.status.should.equal('unsubscribed');
    done();
  });    
});
});
});  