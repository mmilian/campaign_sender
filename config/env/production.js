'use strict';
var nodemailer = require('nodemailer');


var generator = require('xoauth2').createXOAuth2Generator({
    user: 'spolecznoscjow@gmail.com',
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
   	accessToken: process.env.GMAIL_ACCESS_TOKEN // optional
});

console.log(process.env.GMAIL_CLIENT_ID);
console.log(process.env.GMAIL_CLIENT_SECRET);
console.log(process.env.GMAIL_REFRESH_TOKEN);
console.log(process.env.GMAIL_ACCESS_TOKEN);

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
	hostName : "http://powerful-spire-9361.herokuapp.com/"
};
