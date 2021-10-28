const utilSolicitud = require("../util/solicitud");

var solicitudOperation = function(req,res) {

    var us_id = req.user.response.payload;

    const command = req.body.command;
    switch(command){

        case "CREATE_SOLICITUD":
            utilSolicitud.createSolicitud(us_id,req,res);
            break;

        case "GET_SOLICITUDES": //Usuario como trabajador
            utilSolicitud.getSolicitudes(us_id,res);
            break;

        case "OBTAIN_SOLICITUD": //Solicitud donde usuario es trabajador
            utilSolicitud.obtainSolicitud(req,res);
            break;

        case "GET_MY_SOLICITUDES"://Usuario como cliente
            utilSolicitud.getMySolicitudes(us_id,res);
            break;

        case "OBTAIN_MY_SOLICITUD": //Solicitud donde usuario es cliente
            utilSolicitud.obtainMySolicitud(req,res);
            break;

        case "CHANGE_SOLICITUD_STATE":
            utilSolicitud.changeSolicitudState(req,res);
            break;

        case "GET_NOTIFICATIONS":
            utilSolicitud.getNotifications(us_id,res);
            break;

        case "RATE_SERVICE": //Calificar usuario
            utilSolicitud.rateService(req, res);
            break;

        case "RATE_CLIENT": //Calificar usuario
            utilSolicitud.rateClient(req, res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}



module.exports = solicitudOperation;
