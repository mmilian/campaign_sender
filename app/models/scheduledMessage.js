var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ScheduledMessageSchema = new Schema({
	to: String,
	planedSendDate: Date,
	campaignId : String,
	from: String,
	subject: String,
	text: String,
	html: String,
	sentLog: { type: String, default: null}
});

ScheduledMessageSchema.statics.findMessagesReadyToSendOut = function(cb) {
	this.findOne({sentLog: null}).where('planedSendDate').lte(Date.now()).exec(cb);
};

var ScheduledMessage = mongoose.model('ScheduledMessage', ScheduledMessageSchema);

module.exports = ScheduledMessage;