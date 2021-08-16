'use strict'
const fs = require('fs');
const config = require('../GlobalEnv');
const helper = require('sendgrid').mail;

//Función para mandar error
function resFailed(res, err, cod ){
    return res
    .status(cod)
    .send({
        status: "FAILED",
        message: err
    })
}
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    let mime = base64str.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
        // Delete base64 identificator from String
        base64str = base64str.replace(`data:${mime[1]};base64,`, '');
    }
    var bitmap = new Buffer.from(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

//Función para mandar resultado
function sendResult(res,result,cod){
   return res.status(cod).send(result[0]); 
}

//Función para trat ael error o resultado
function errResult(res, err, result,cod_err,cod_success){
    
    if (err) {
        return resFailed(res, err,cod_err)
    } else {
        return sendResult(res,result, cod_success);
    }         
}

module.exports = {
    resFailed,
    sendResult,
    errResult,
    base64_decode
}