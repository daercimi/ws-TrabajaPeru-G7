const utilSolicitud = require("../util/solicitud");

var solicitudOperation = function(req,res) {

    const command = req.body.command;
    switch(command){

        case "CREATE_SOLICITUD":
            utilSolicitud.searchService(req,res);
            break;

        case "GET_SOLICITUDES":
            utilSolicitud.searchService(req,res);
            break;

        case "OBTAIN_SOLICITUD":
            utilSolicitud.searchService(req,res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}



module.exports = solicitudOperation;
