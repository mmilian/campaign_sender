'use strict';

module.exports = {
	app: {
		title: 'Campaign_Sender',
		description: 'Campaign_Sender',
		keywords: ''
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 	'MEAN',
	sessionCollection: 'sessions',
	rederictingPath : "/redirecting",
	unsubscribePath : "/unsubscribe",
	openRatePath : "/openRate"	
};