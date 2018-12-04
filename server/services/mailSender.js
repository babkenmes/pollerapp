var nodemailer = require('nodemailer');
var emailTemplate = require('email-templates').EmailTemplate;
var config = require('../utils/config');
var fs = require('fs');
var smptAuthSettings = config.get('smpt');

var transOptions = {
    host: smptAuthSettings.smptServer,
    port: smptAuthSettings.smptPort,
    secure: smptAuthSettings.smptSSL,
    ignoreTLS: smptAuthSettings.smptIgnoreTSL,
    auth: {
        user: smptAuthSettings.clientId,
        pass: smptAuthSettings.clientPassword
    }
};

function sendTextEmail(mailTo , mailSubject , mailMessage) {
    var transporter = nodemailer.createTransport(transOptions);
    var mainOptions = {
        from: smptAuthSettings.notificationEmail,
        to: mailTo,
        subject: mailSubject,
        html: mailMessage
    };
    var callback = function (err, info) {
        if (err) {
            console.log(err);
        }
        console.log('Email sent to ' + mailTo);
    }
    transporter.sendMail(mainOptions, callback);
}

function sendHtmlEmail(mailTo , mailSubject , mailData , mailTemplateName) {
    
    var transporter = nodemailer.createTransport(transOptions);
    var html = '';    
    fs.readFile('./views/emailTemplates/' + mailTemplateName + '.html', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        html = data;
        
        for (var name in mailData) {
            var replace = String("{{" + name + "}}");           
            html = html.replace(replace, mailData[name]);
        }
        var transporter = nodemailer.createTransport(transOptions);
        var mainOptions = {
            from: smptAuthSettings.notificationEmail,
            to: mailTo,
            subject: mailSubject,
            html: html
        };
        var callback = function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log('Email sent to ' + mailTo);
        }
        transporter.sendMail(mainOptions, callback);
    });

   
}

module.exports.sendTextEmail = sendTextEmail;
module.exports.sendHtmlEmail = sendHtmlEmail;




