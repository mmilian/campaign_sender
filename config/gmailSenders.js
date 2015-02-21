var nodemailer = require('nodemailer');
var _xoauth2 = require('xoauth2');

var GMAIL_CREDENTIALS = JSON.parse(process.env.GMAIL_CREDENTIALS);

var generators = GMAIL_CREDENTIALS.map(function(credential) {
    var generator = _xoauth2.createXOAuth2Generator({
        user: credential.user,
        clientId: credential.clientId,
        clientSecret: credential.clientSecret,
        refreshToken: credential.refreshToken,
    	accessToken: credential.accessToken // optional
    });
    generator.on('token', function(token){
        console.log('New token for %s: %s', token.user, token.accessToken);
    });
    return generator;
});

// listen for token updates
// you probably want to store these to a db

// login
var senders = generators.map(function(generator) {
    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    });
    return sender;
});

module.exports = senders;
