const Solicitud = require("../models/Servicios");
const utilComun = require("./comun");
const dbConnection = require("../connect");
const connection = dbConnection();

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
    connection.query("CALL getSolicitud(?)",[us_id], (err, result) => {
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




module.exports = {
	createSolicitud,
    getSolicitudes,
    obtainSolicitud
}