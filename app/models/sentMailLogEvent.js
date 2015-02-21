'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message sent event log
 */

var SentMailLogEvent = function() {
	return {
		create : function(data,cb) {
			return cb(null,data);
		}
	};
}();

 module.exports=SentMailLogEvent;