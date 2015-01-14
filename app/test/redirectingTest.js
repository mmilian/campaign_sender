var should = require('should');
var assert = require("assert");
var bus = require("../utility/globalEventBus.js");
var sinon = require('sinon'),
	rewire = require('rewire');
var	config = require("../../config/config");

var redirectingTable = {
	findUrlById: function(hash, cb) {
		if (hash == 'hash') {
			cb('https://efektjow.pl/redirectUrl');
		} else {
			cb('https://efektjow.pl');
		}
	}
};

var redirectUrl = require("../routes/redirectingUrls")(config, redirectingTable);

//var redirectUrl = rewire("../routes/redirectingUrls")(config,redirectingTable);
/*
console.log(redirectUrl[config.hostName + config.openRatePath].fn({
	hash: 'hash'
}, {
	redirect: function(statusCode, location) {
		console.log('statusCode :' + statusCode);
		assert.equal(302, statusCode);
		assert.equal('https://efektjow.pl/redirectUrl', location);
	}
}));*/

describe('Routes definitions', function() {
	describe('simple redirect from db', function() {
		/*	beforeEach(function() {
					redirectUrl.__set__({'redirectingTable' : {
						findUrlById : function(hash,cb) {
							if (hash=='hash') {
								cb('https://efektjow.pl/redirectUrl');
							} else {
								cb('https://efektjow.pl');
							}
						}
					}});
				});
		*/
		it('redirect to proper destination', function(done) {

			redirectUrl[config.hostName + config.rederictingPath].fn({
				hash: 'hash'
			}, {
				redirect: function(statusCode, location) {
					console.log('statusCode :' + statusCode);
					assert.equal(302, statusCode);
					assert.equal('https://efektjow.pl/redirectUrl', location);
					done();
				}
			})
		});
		it('emit proper event when redirect', function(done) {
			bus.registerEventOnce('link_clicked', function(data) {
				data.should.be.equal('hash');
				done();
			});

			redirectUrl[config.hostName + config.rederictingPath].fn({
				hash: 'hash'
			}, {
				redirect: function(statusCode, location) {}
			});
		});
		it('process unsubscribe', function(done) {

			redirectUrl[config.hostName + config.unsubscribePath].fn({
				hash: 'hash'
			}, {
				redirect: function(statusCode, location) {
					assert.equal(302, statusCode);
					assert.equal(config.hostName, location);
					done();
				}
			})
		});
		it('emit proper event when unsubscribe', function(done) {
			bus.registerEventOnce('unsubscribe_clicked', function(data) {
				data.should.be.equal('hash');
				done();
			});

			redirectUrl[config.hostName + config.unsubscribePath].fn({
				hash: 'hash'
			}, {
				redirect: function(statusCode, location) {}
			});
		});

	});
});