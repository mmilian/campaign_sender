var nodemailer = require('nodemailer');
var _xoauth2 = require('xoauth2');

var GMAIL_CREDENTIALS = JSON.parse(process.env.GMAIL_CREDENTIALS);

var accounts = GMAIL_CREDENTIALS.map(function(credential) {
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
    console.log("Credentails: " +credential.name + "limit" + credential.limit)
    return {generator : generator, limit : credential.limit || 500, name : credential.name || "Społeczność efektjow.pl <" +credential.user + ">"};
});

// listen for token updates
// you probably want to store these to a db

// login
var senders = accounts.map(function(account) {
    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            xoauth2: account.generator
        }
    });
    return {sender : sender, limit : account.limit, name : account.name};
});

module.exports = senders;
