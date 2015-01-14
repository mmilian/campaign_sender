'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Start the app by listening on <port>
app.listen(config.port);


//schedule sending messages
var SenderManager = require('./app/sendManager');
var senderManager = new SenderManager(config);
setInterval(senderManager.sendAllMessages, 10000, function(err,result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result);
	}
});

var emailStatistic = require('./app/emailStatistic');
// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Application Campaign_Sender up and running on port ' + config.port);