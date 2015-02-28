'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

 var yesterday = function() {
 	var d = new Date
 	d.setDate(d.getDate() - 1);
 	return d
 };

/**
 * Message sent event log
 */

 var SentMailLogSchema = new Schema({
 	created: {
 		type: Date,
 		default: Date.now
	 	},
 	senderId: {
 		type: String,
 		default: '',
 		trim: true,
 	}
 });

 SentMailLogSchema.statics.sentWithin24h = function(parameters,cb) {
 	//console.log(this);
 	this.count(parameters).where('created').gte(yesterday()).exec(function(err,events) {
 		cb(err,{counter : events});
 	});
 };

 var SentMailLogEvent = function() { 	
 	var _model = mongoose.model('sentMailLogEvents', SentMailLogSchema);  
 	return {
 		create : function(data,cb) {
 			var sentMailLogEvent = new _model(data);
 			_model.create(sentMailLogEvent,function(err,doc) {
 				cb(err,doc);
 			}); 
 		},
 		sentWithin24h : function(parameters,cb) {
 			_model.sentWithin24h(parameters,cb);
 		},
 		model : _model
 	};
 }();

 module.exports=SentMailLogEvent;