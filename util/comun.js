'use strict'
const fs = require('fs');
const config = require('../GlobalEnv');
const helper = require('sendgrid').mail;

function resFailed200(res, err){
    return res
    .status(200)
    .send({
        status: "FAILED",
        message: err
    })
}

function stringifyResult(res,result){
   return res.status(200).send(JSON.stringify(result)); 
}



function ObjectResponse(params) {
    return {
        "code": params[0],
        "status": params[1],
        "message": params[2],
        "Response": params[3]
    }

}

function sendMail(to_email, subject, type, content, attachments = []) {
    var from_email = new helper.Email(config.sendgrid_from);
    var to_email = new helper.Email(to_email);
    var subject = subject;
    var content = new helper.Content(type, content);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    attachments.forEach(fileattach => {
        var attachment = new helper.Attachment();
        attachment.setContent(fileattach.file)
        attachment.setType(fileattach.mime)
        attachment.setFilename(fileattach.filename)
        attachment.setDisposition("attachment")

        mail.addAttachment(attachment);
    });

    var sg = require('sendgrid')(config.sendgrid_api_key);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
}

function evalObjectValue(object) {
    let keys = Object.keys(object);
    keys.forEach(key => {
        if (object[key] !== '') {
            return true
        }
    });
    return false;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateUrl(url) {
    var re = /^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}/gi;
    return re.test(String(url));
}

module.exports = {
    ObjectResponse,
    sendMail,
    base64_encode,
    base64_decode,
    evalObjectValue,
    validateEmail,
    validateUrl,
    resFailed200,
    stringifyResult
}