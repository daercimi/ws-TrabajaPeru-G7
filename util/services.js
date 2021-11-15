const Servicio = require("../models/Servicios");
const utilComun = require("./comun");
const dbConnection = require("../connect");
const connection = dbConnection();

function searchService(req, res) {
    const busq = req.body.transaction;

    connection.connect()
    connection.query("CALL searchService(?)",busq, (err, result) => {
        utilComun.errResult(res, err,result,200,200);
    });
}

function getHomeServices(res){

    connection.connect();
    connection.query("CALL GetHomeServices();",(err, result) =>{
        utilComun.errResult(res, err,result,200,200);      
    });
}

function obtainService(us_id,req,res){
    const data = req.body.transaction;

    connection.connect();
    connection.query("CALL obtainService(?,?);",[data.us_id,data.cat_id],(err, result) =>{
        utilComun.errResult(res,err,result,200,200);      
    });

}

/****************
-----------------
------AUTH-------
-----------------
*****************/
async function createService(req,us_id,res){

    const service = req.body.transaction;
    const newServicio = new Servicio(us_id, service);
    if(req.body.transaction.ser_imagen != null){
        newServicio.ser_imagen = await utilComun.uploadImage(service.ser_imagen)
}
    connection.connect();
    connection.query("CALL serviceExistance(?,?);",[newServicio.us_id,newServicio.cat_nombre], (err,result) =>{
        if (err) {
            return utilComun.resFailed(res, err,200) 
        }
        else {
            var existencia = result[0][0].existe;
            connection.query("CALL createOrRecoverService(?, ?, ?, ?);", [newServicio.us_id,newServicio.cat_nombre, newServicio.ser_descripcion, newServicio.ser_imagen],(err2, result2)=>{
                if (err2) {
                    return utilComun.resFailed(res, err2,200)  
                }
                else {
                    switch (existencia){
                        case 0:
                            return res.status(200).send({
                                status: "SUCCESS",
                                message: "Servicio de usuario " + newServicio.us_id + " de categoria " + newServicio.cat_nombre + " creado correctamente."
                            });
                        case 1:
                            return res.status(200).send({
                                status: "SUCCESS",
                                message: "Servicio de usuario " + newServicio.us_id + " de categoria " + newServicio.cat_nombre + " ya existe, no se permiten duplicados."
                            });
                        case 2:
                            return res.status(200).send({
                                status: "SUCCESS",
                                message: "Servicio de usuario " + newServicio.us_id + " de categoria " + newServicio.cat_nombre + " reestablecido correctamente."
                            });
                    }
                }
            })
        }
    })
}

async function editService(req,us_id,res){
    const service = req.body.transaction;
    if(req.body.transaction.ser_imagen != null){
            service.ser_imagen = await utilComun.uploadImage(service.ser_imagen)
    }
    connection.connect();
    connection.query("CALL editService(?,?,?,?);", [us_id,service.cat_id,service.ser_descripcion, service.ser_imagen], (err, result) =>{
        if (err) {
            return utilComun.resFailed(res,err,200)
        } else {
            return res.status(200).send({
                status: "SUCCESS",
                message: "Servicio editado correctamente",
            });
        }
    });
    
}

function deleteService(req,us_id,res){

    var cat_id = req.body.transaction.cat_id;
    connection.connect();
    connection.query("CALL deleteService(?,?);",[us_id,cat_id],(err, result) =>{
        if (err) {
            return utilComun.resFailed(res, err,200)
        } else {
            return res.status(200).send({
                status: "SUCCESS",
                message: "Servicio eliminado correctamente",
            });
        }        
    });
}

function getMyServices(us_id,res){

    connection.connect();
    connection.query("CALL getMyServices(?);;",[us_id], (err,result) => {
        const numReg = result[0].length;

        for(let i=0 ; i<numReg; i++){
            if(result[0][i].ser_calificacion == null){
                result[0][i].ser_calificacion = 0;
            }
        }
        utilComun.errResult(res, err,result,200,200);       
    });
}

function getOthersServices(req,res){

    data = req.body.transaction;
    connection.connect();
    connection.query("CALL getMyServices(?);;",[data.us_id], (err,result) => {
        const numReg = result[0].length;

        for(let i=0 ; i<numReg; i++){
            if(result[0][i].ser_calificacion == null){
                result[0][i].ser_calificacion = 0;
            }
        }
        utilComun.errResult(res, err,result,200,200);       
    });
}


function getCategories(us_id,res){

    connection.connect();
    connection.query("CALL getCategories(?);",[us_id],(err, result) =>{
        utilComun.errResult(res, err,result,200,200);      
    });

}


module.exports = {
	searchService,
	getHomeServices,
	getCategories,
    createService,
    editService,
    deleteService,
    getMyServices,
    getOthersServices,
    obtainService
}