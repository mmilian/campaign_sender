'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	id: {
		type: String,
		default: '',
		trim: true,
		required: 'Unique id',
		index: { unique: true }
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	description: {
		type: String,
	},
	from: {
		type: String,
		default: ''
	},
	subject: {
		type: String,
		default: ''
	},
	text: {
		type: String,
		default: ''
	},
	html: {
		type: String,
		default: ''
	}
});

module.exports = mongoose.model('Campaigns', CampaignSchema);