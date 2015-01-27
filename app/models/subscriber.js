var mongoose = require("mongoose");  
var _ = require('lodash');

var Subscriber = function(){  
  var Schema = require('mongoose').Schema;  //bummer - have to declare this up-front  
  var subscriberSchema = new Schema({    
    //id    : Number,    
    nick : {type : String, index: { unique: true, required : true }},
    email : {type : String, index: { unique: true, required : true }},    
    status : String,
    campaigns : [{
      campaignId : String, 
      opened : {counter : Number,openDate: [{date: { type: Date, default: Date.now }}] },
      linkClicked : [{url : String, clicked : Number,  clickedDate: [{date: { type: Date, default: Date.now }}]}]
    }]
  });  
  //the model uses the schema declaration  
  var _model = mongoose.model('subscribers', subscriberSchema);  
  var _findByEmail = function(email, cb){    
    _model.findOne({email:email}, function(err, doc){      
      cb(err,doc);
     });    
   }; 

  var _register = function(data,success,fail) {
    var newSubscriber = new _model({nick : data.nick, email:data.email});
    _model.create(newSubscriber,function(err,doc) {
      if(err) {
        console.log(err);
        fail(err);
      } else {
        success(doc);
      }        
    }); 
  };

  var _findCampaign = function(campaignId,doc) {
    if (doc.campaigns === undefined) {
      doc.campaigns = [];
      _createCampaign(doc,campaignId);
      return doc.campaigns[0];
    }
    var index = _.findIndex(doc.campaigns, function(campaign) {
      return campaign.campaignId == campaignId;
    });
    if (index==-1)
      return _createCampaign(doc,campaignId);
    return doc.campaigns[index];
  };

  var _findClickedUrl = function(campaign,url) {
    var index = _.findIndex(campaign.linkClicked, function(link) {
      return link.url == url; 
    });
    if (index==-1)
      return campaign.linkClicked[campaign.linkClicked.push({clicked:0,url:url,clickedDate : []}) -1];
    return campaign.linkClicked[index];
  }; 


  var _createCampaign = function(doc,campaignId) {
    doc.campaigns.push({campaignId:campaignId,opened : {counter:0,openDate:[]}, linkClicked : []});
    var index = _.findIndex(doc.campaigns, function(campaign) {
      return campaign.campaignId == campaignId;
    });
    return doc.campaigns[index];
  }

  var _campaignOpened  = function(campaignId,email,success,fail) {
    _findByEmail(email,function(err,doc) { 
      console.log("Doc %s",doc);
      var campaign = _findCampaign(campaignId,doc);
      campaign.opened.counter++;
      campaign.opened.openDate.push({date : Date.now()});
      doc.save(function(err) {
        if (err) 
          fail(err);
        success(doc);
      });
    },fail);
      //success({email : email, campaigns : [{campaignId : 'campaignId', opened : 1}]});
    };

    var _linkClicked = function(campaignId,url,email,success,fail) {
      _findByEmail(email,function(err,doc) { 
        var campaign = _findCampaign(campaignId,doc);
        var clickedUrl = _findClickedUrl(campaign,url);
        clickedUrl.clicked++;
        clickedUrl.clickedDate.push({date:Date.now()});
        //campaign.linkClicked.push({clicked:1,url:'http://efektjow.pl/link',clickedDate : [{date:Date.now()}]});
        //console.log(doc);
        doc.save(function(err) {
          if (err) {
           console.log(err);
           fail(err);
           return;
         }
         success(doc);
       });
      },fail);
     //success({email : email, campaigns : [{campaignId : 'campaignId', linkClicked : [{clicked:1,url:'http://efektjow.pl/link',clickedDate : [{date:Date.now()}]}]}]});
   };

   var _unsubscribed = function(email,success,fail) {
    _findByEmail(email,function(err,doc) {
      console.log("Email " + email + " : " + err);
      doc.status = 'unsubscribed';
      doc.save(function(err) {
        if (err) {
         console.log(err);
         fail(err);
         return;
       } else {
        success(doc);
        return;
       } 
     });
    },function(err) {
      console.log(err);
      fail(err);
      return;
    });
  };

  return {    
    schema : subscriberSchema,    
    model : _model,    
    findByEmail : _findByEmail,
    register : _register,
    campaignOpened : _campaignOpened,
    linkClicked : _linkClicked,
    unsubscribe : _unsubscribed
  }
}();

module.exports=Subscriber;