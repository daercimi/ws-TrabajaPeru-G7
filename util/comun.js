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

function uploadImage(path, res ){
    cloudinary.uploader.upload(path ,
    function(error, result) {
        console.log(result)
    });
}

//Función para mandar resultado
function sendResult(res,result,cod){
   return res.status(cod).send(result); 
}

//Función para tratael error o resultado
function errResult(res, err, result,cod_err,cod_success){
    
    if (err) {
        return resFailed(res, err,cod_err)
    } else {
        return sendResult(res,result, cod_success);
    }         
}

function ObjectResponse(params) {
    return {
        "code": params[0],
        "status": params[1],
        "message": params[2],
        "Response": params[3]
    }

}

module.exports = {
    ObjectResponse,
    resFailed,
    sendResult,
    errResult
}