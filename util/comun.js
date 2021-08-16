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
                return utilComun.resFailed(res,err,200);
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