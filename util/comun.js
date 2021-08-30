'use strict'
const fs = require('fs');
const config = require('../GlobalEnv');
const helper = require('sendgrid').mail;
const dbConnection = require("../connect");
const connection = dbConnection();
const cloudinary = require("cloudinary").v2;
const path = require("path");

//Función para mandar error
function resFailed(res, err, cod ){
    return res
    .status(cod)
    .send({
        status: "FAILED",
        message: err
    })
}

function uploadImage(req,res){
    if(req.ser_imagen != null){
        base64_decode(req.ser_imagen,__dirname + "/../images/Service.jpg")
        cloudinary.uploader.upload(__dirname + "/images/Service.jpg", function(error, result) { 
            if(result){
                return result.url                
            }
        });
    }
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

function search(req, res) {
    const text = req.body.transaction;
    connection.connect()
    connection.query(
        "CALL search(?)",[text],
        (err, result) => {
            if (err) {
                return resFailed(res,err,200);
            } else {
                if (result[0].length == 0 ){
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "No se encontraron resultados",
                        resultado: result[0],
                    });
                }
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Búsqueda existosa",
                    resultado: result[0],
                });

            }
        }
    );
}

module.exports = {
    resFailed,
    sendResult,
    errResult,
    search
}