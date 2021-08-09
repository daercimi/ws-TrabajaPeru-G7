const utilSolicitud = require("../util/solicitud");

var solicitudOperation = function(req,res) {

    var us_id = req.user.response.payload;

    const command = req.body.command;
    switch(command){

        case "CREATE_SOLICITUD":
            utilSolicitud.createSolicitud(us_id,req,res);
            break;

        case "GET_SOLICITUDES":
            utilSolicitud.getSolicitudes(us_id,res);
            break;

        case "OBTAIN_SOLICITUD":
            utilSolicitud.obtainSolicitud(req,res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}



module.exports = solicitudOperation;
