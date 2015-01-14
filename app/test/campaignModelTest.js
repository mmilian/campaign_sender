'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Campaign = require('../models/Campaign'),
	config = require("../../config/config");

/**
 * Globals
 */
var campaign,db;
/**
 * Unit tests
 */
describe('Campaign Model Unit Tests:', function() {
	before(function () {
		db = mongoose.connect(config.db);  
	});
	after(function () {
		db.disconnect();
	});

	beforeEach(function(done) {
		campaign = new Campaign({
			id: 'Some Id',
			name: 'Name',
			description: 'Full Name',
			html: '<html>Mail</html>',
			text: 'text',
			from: 'mateusz.milian@gmail.com'
		});
		campaign.save(function() { 
			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return campaign.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			campaign.name = '';

			return campaign.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Campaign.remove().exec();
		done();
	});
});