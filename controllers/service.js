const Servicio = require("../models/Servicios");
const dbConnection = require("../connect");
const connect = require("../connect");
const connection = dbConnection();

serviceOperation = function(req,middleware,res) {

    const command = req.body.command;
    switch(command){
        case "CREATE_SERVICE":
            validationCreateService(req,middleware,res);
            break;

        case "SEARCH_SERVICE":
            searchCategory(req,res);
            break;

        case "EDIT_SERVICE":
            //editService(req,middleware,res);
            //break;
            return res.status(200).send({
                status: "ERROR",
                message: "OPERACION TODAVÍA NO IMPLEMENTADA EN EL CONTROLADOR :´v",
            })

        case "DELETE_SERVICE":
            //deleteService(req,middleware,res);
            //break;
            return res.status(200).send({
                status: "ERROR",
                message: "OPERACION TODAVÍA NO IMPLEMENTADA EN EL CONTROLADOR :´v",
            })

        case "GET_SERVICES":
            //Los primeros 10 para el home
            //getServices(res);
            //break;
            return res.status(200).send({
                status: "ERROR",
                message: "OPERACION TODAVÍA NO IMPLEMENTADA EN EL CONTROLADOR :´v",
            })

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}

function validationCreateService(req,middleware,res) {
    /*Se creará el servicio solo si no existe una combinación (us_id, cat_id) 
    Además si es que ya ha existido antes y esa combinación, se colocará la nueva
    descripción e imagen, pero el resto de datos se mantendrá. Esto es para evitar
    que cuando se tenga una baja calificación en un servicio se borre y vuelva a crear uno
    sin bajas calificaciones.
    */

    const user = middleware.us_id // REVISAR
    const service = req.body.transaction;
    const newServicio = Servicio(user, service); // REVISAR

    servicioExiste = serviceExists(newServicio.us_id,cat_id);

    switch(servicioExiste){
        case -2:
            recoverService(newServicio,res);
            break;

        case -1:
            return res.status(200).send({
                status: "ERROR",
                message: "Servicios.js/serviceExists(): Error en consulta",
            });

        case 0:
            createService(newServicio,res);
            break;

        case 1:
            return res.status(200).send({
                status: "ERROR",
                message: "Servicios.js/serviceExist(): Existe servicio de usuario" + newServicio.us_id + " de categoria" + cat_id + " pero fue eliminado",
            });
            
    }

}

function serviceExists(us_id,cat_id){

    sql_existe = "SELECT * FROM Servicios WHERE us_id = ? AND cat_id = ?", [us_id,cat_id];

    connection.connect();
    connection.query(sql_existe, (err, result) =>{

        if (err) {
            console.log("Servicios.js/serviceExists(): Error en consulta");
            return -1;     
            
        } else if(result.length == 0){
            console.log("Servicios.js/serviceExists(): No existe servicio de usuario", us_id, " de categoria", cat_id);
            return 0;
            
        } else {

            if(result[0].ser_eliminado == 0) {
                console.log("Servicios.js/serviceExist(): Existe servicio de usuario", us_id, " de categoria", cat_id);
                return 1;
            }
            else{
                console.log("Servicios.js/serviceExist(): Existe servicio de usuario", us_id, " de categoria", cat_id, " pero fue eliminado");
                return -2;
            }

        }
    });

}

function recoverService(newServicio,res){
    sql_recuperar = "UPDATE Servicio SET " +
    "ser_descripcion = ?, ser_imagen = ?, ser_eliminado = 0", [newServicio.ser_descripcion, newServicio.ser_imagen];

    connection.connect();
    connection.query(sql_recuperar, (err, result) =>{

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
    sql_insertar = "INSERT INTO Servicio " +
    "(us_id, cat_id, ser_descripcion, ser_imagen)" 
    + " VALUES (?,?,?,?)", [newServicio.us_id, newServicio.cat_id, newServicio.ser_descripcion, newServicio.ser_imagen];

    connection.connect();
    connection.query(sql_insertar, (err, result) =>{

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


/* ///////////////////////////////////////////////////////////////////// */


function searchCategory(req, res) {
    /*Se harían 2 búsquedas:
    1) Buscar el cat_id según la cadena de texto
    2) Buscar los servicios que tienen ese cat_id*/
    const CatName = req.body.transaction;
    connection.connect()
    sql_buscarCat = "SELECT * FROM Categoria WHERE cat_nombre LIKE %?%", [CatName];

    connection.query(sql_buscarCat, (err, result) => {
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else if (result == null ) {
            return res.status(200).send({
                status: "SUCCESS",
                message: "No hay servicios encontrados",
            });
        } else {
            serviciosEncontrados = searchService(result[0].cat_id);
            return res.send(JSON.stringify(serviciosEncontrados))
        }
    });

}

function searchService(cat_id){
    connection.connect()
    sql_buscarSer = "SELECT * FROM Servicio WHERE cat_id = ?", [cat_id];

    connection.query(sql_buscarSer, (err, result) => {
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return result;
        }
    });
}


module.exports = serviceOperation;
