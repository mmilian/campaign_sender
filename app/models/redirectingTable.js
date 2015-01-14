var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;
var _ = require('lodash');

var RedirectingTable = function() {
	var redirectingTableSchema = new Schema({
		email: String,
		url: String,
		campaignId: String
	});

	var _model = mongoose.model('RedirectingTable', redirectingTableSchema);

	var _findById = function(id, cb) {
		_model.findOne({
			_id: id
		}, function(err, result) {
			console.log("How" + result);
			cb(err, result);
		});
	};

	var _findUrlById = function(id, cb) {
		_findById(id, function(err, result) {
			console.log("How2" + result);
			cb(result.url);
		});
	};

	var _createNewEntry = function(data, cb) {
		//var newEntry = new _model(data);
		if (!(data._id == null))  
			data._id = _.isFunction(data._id) ? data._id() : data._id;
		_model.create(data, cb);
	};

	return {
		findById: _findById,
		findUrlById: _findUrlById,
		createNewEntry: _createNewEntry,
		model: _model
	}
}();

module.exports = RedirectingTable;