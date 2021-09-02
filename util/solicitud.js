const Solicitud = require("../models/Solicitud");
const utilComun = require("./comun");
const dbConnection = require("../connect");
const connection = dbConnection();

/*
var express = require('express');
var app =  express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('public'));

io.on('connection', function(socket){ //escucha
    console.log('Alguien se ha conectado con Socket');

    //emitimos mensaje
    //nombre del evento: messages, objeto: {}
    socket.emit('messages', {
        id:1,
        text: "Hola soy un mensaje"
    })
})
*/

function createSolicitud(us_id,req, res) {
    const request = req.body.transaction;
    const newSolicitud = new Solicitud(us_id, request);

    connection.connect()
    connection.query("CALL createSolicitud(?,?,?,?)",[newSolicitud.us_id_cliente, newSolicitud.us_id_trabajador, newSolicitud.cat_id, newSolicitud.sol_mensaje], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });

    

}

function getSolicitudes(us_id, res) {
    connection.connect()
    connection.query("CALL getSolicitudes(?)",[us_id], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function obtainSolicitud(req, res) {
    const data = req.body.transaction;
    
    connection.connect()
    connection.query("CALL obtainSolicitud(?)",[data.sol_id], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function getMySolicitudes(us_id, res) {
    connection.connect()
    connection.query("CALL getMySolicitudes(?)",[us_id], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function obtainMySolicitud(req, res) {
    const data = req.body.transaction;
    
    connection.connect()
    connection.query("CALL obtainMySolicitud(?)",[data.sol_id], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function changeSolicitudState(req, res) {
    const data = req.body.transaction;
    
    connection.connect()
    connection.query("CALL changeSolicitudState(?,?)",[data.sol_id,data.sol_estado], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function getNotifications(us_id, res) {
    
    connection.connect()
    connection.query("CALL getNotifications(?)",[us_id], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function rateService(req, res) {
    
    const data = req.body.transaction;

    connection.connect()
    connection.query("CALL calificarServicio(?,?)",[data.id_solicitud, data.calif_tra], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}

function rateClient(req, res) {
    const data = req.body.transaction;

    connection.connect()
    connection.query("CALL calificarCliente(?,?)",[data.id_solicitud, data.calif_cli], (err, result) => {
        utilComun.errResult(res,err,result,200,200);
    });
}



module.exports = {
	createSolicitud,
    getSolicitudes,
    obtainSolicitud,
    getMySolicitudes,
    obtainMySolicitud,
    changeSolicitudState,
    getNotifications,
    rateService,
    rateClient
}