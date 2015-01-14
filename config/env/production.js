'use strict';



var generator = require('xoauth2').createXOAuth2Generator({
    user: '*',
    clientId: '*',
    clientSecret: '*',
    refreshToken: '*',
   	accessToken: '*' // optional
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// login
var sender = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));


module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/efektjow_test',
	mailSender : sender,
	hostName : "http://localhost/"
};
