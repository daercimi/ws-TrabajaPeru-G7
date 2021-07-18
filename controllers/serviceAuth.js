const Servicio = require("../models/Servicios");
const dbConnection = require("../connect");
const connect = require("../connect");
const connection = dbConnection();
const auth = require("../middleware/auth");

serviceOperation = function(req,res) {

    us_id = req.user.response.payload;
    //console.log("Valor de us.id en controllers/service.js: ", us_id)

    const command = req.body.command;
    switch(command){
        case "CREATE_SERVICE":
            if(us_id == null){
                return res.status(200).send({
                    status: "ERROR",
                    message: "Servicios.js/serviceOperation() - CREATE_SERVICE: Usuario no loggeado",                    
                })
            } else {
                validationCreateService(req,us_id,res);
            }
            break;

        case "EDIT_SERVICE":
            if(us_id == null){
                return res.status(200).send({
                    status: "ERROR",
                    message: "Servicios.js/serviceOperation() - EDIT_SERVICE: Usuario no loggeado",                    
                })
            } else {
                editService(req,us_id,res);
            }
            break;

        case "DELETE_SERVICE":
            if(us_id == null){
                return res.status(200).send({
                    status: "ERROR",
                    message: "Servicios.js/serviceOperation() - DELETE_SERVICE: Usuario no loggeado",                    
                })
            } else {
                deleteService(req,us_id,res);
            }
            break;

        case "GET_MY_SERVICES":
            if(us_id == null){
                return res.status(200).send({
                    status: "ERROR",
                    message: "Servicios.js/serviceOperation() - GET_MY_SERVICES: Usuario no loggeado",                    
                })
            } else {
                getMyServices(us_id,res);
            }
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}

function validationCreateService(req,us_id,res) {
    const user = us_id 
    const service = req.body?.transaction;
    const newServicio = new Servicio(user, service);
    return serviceExists(newServicio,res);

}

function serviceExists(NewServicio, res,){

    connection.connect();
    connection.query("SELECT * FROM Servicio WHERE us_id = ? AND cat_id = ? ;", [NewServicio.us_id,NewServicio.cat_id],(err, result)=>{

        if (err) {
            console.log("Servicios.js/serviceExists(): Error en consulta");
            return res.status(200).send({
                status: "ERROR",
                message: "Servicios.js/serviceExists(): Error en consulta",
            });   
        } 

        else {
            if(result.length == 0){
                console.log("Servicios.js/serviceExists(): No existe servicio de usuario", NewServicio.us_id, " de categoria", NewServicio.cat_id);
                return createService(NewServicio,res); 
            } 
            if(result[0].ser_eliminado == 0) {
                console.log("Servicios.js/serviceExist(): Existe servicio de usuario", NewServicio.us_id, " de categoria", NewServicio.cat_id);
                return res.status(200).send({
                    status: "ERROR",
                    message: "Servicios.js/serviceExists(): Existe servicio de usuario" + newServicio.us_id + " de categoria" + cat_id
                });
            }
            else{
                console.log("Servicios.js/serviceExist(): Existe servicio de usuario", NewServicio.us_id, " de categoria", NewServicio.cat_id, " pero fue eliminado");
                return recoverService(NewServicio,res);
            }
        }
    });
}

function recoverService(newServicio,res){

    connection.connect();
    connection.query("UPDATE Servicio SET ser_descripcion = ?, ser_imagen = ?, ser_eliminado = 0 ;", [newServicio.ser_descripcion, newServicio.ser_imagen], (err, result) =>{

        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.status(200).send({
                status: "SUCCESS",
                message: "Servicio recuperado correctamente",
            });
        }
    });

}

function createService(newServicio,res){
    connection.connect();
    connection.query("INSERT INTO Servicio (us_id, cat_id, ser_descripcion, ser_imagen) VALUES (?,?,?,?) ;", 
    [newServicio.us_id, newServicio.cat_id, newServicio.ser_descripcion, newServicio.ser_imagen], 
    (err, result) =>{

        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.status(200).send({
                status: "SUCCESS",
                message: "Servicio registrado correctamente",
            });
        }
    });
}

function editService(req,us_id,res){

    const user = us_id
    const service = req.body.transaction;

    connection.connect();
    connection.query("UPDATE Servicio SET ser_descripcion = ?, ser_imagen = ? WHERE us_id = ? AND cat_id = ? ;", [service.ser_descripcion, service.ser_imagen,us_id,service.cat_id], (err, result) =>{

        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.status(200).send({
                status: "SUCCESS",
                message: "Servicio editado correctamente",
            });
        }
    });
    
}

function deleteService(req,us_id,res){

    cat_id = req.body.transaction.cat_id;

    connection.connect();
    connection.query("UPDATE Servicio SET ser_eliminado = 1 WHERE us_id = ? AND cat_id = ?",[us_id,cat_id],(err, result) =>{
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
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
    connection.query("SELECT * FROM Servicio WHERE us_id = ? WHERE ser_eliminado = 0;",[us_id], (err,result) => {
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.status(200).send(JSON.stringify(result));
        }         
    });

}

module.exports = serviceOperation;
