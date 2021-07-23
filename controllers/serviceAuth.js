const Servicio = require("../models/Servicios");
const dbConnection = require("../connect");
const connection = dbConnection();

function resFailed200(res, err){
    return res
    .status(200)
    .send({
        status: "FAILED",
        message: err
    })
}
serviceOperation = function(req,res) {

    us_id = req.user.response.payload;

    if(us_id == null){
        return res.status(200).send({
            status: "ERROR",
            message: "Servicios.js/serviceOperation() - CREATE_SERVICE: Usuario no loggeado",                    
        })
    }

    const command = req.body.command;
    switch(command){
        case "CREATE_SERVICE":
            validationCreateService(req,us_id,res);
            break;

        case "EDIT_SERVICE":
            editService(req,us_id,res);
            break;

        case "DELETE_SERVICE":
            deleteService(req,us_id,res);
            break;

        case "GET_MY_SERVICES":
            getMyServices(us_id,res);
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
    const service = req.body.transaction;
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
            return resFailed200(res, err)
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
            return resFailed200(res, err)
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
            return resFailed200(res, err)
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
            return resFailed200(res, err)
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
            return resFailed200(res, err)
        } else {
            return res.status(200).send(JSON.stringify(result));
        }         
    });

}

module.exports = serviceOperation;
