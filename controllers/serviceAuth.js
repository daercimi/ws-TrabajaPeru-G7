const utilServices = require("../util/services");

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
            utilServices.createService(req,us_id,res);
            break;

        case "EDIT_SERVICE":
            utilServices.editService(req,us_id,res);
            break;

        case "DELETE_SERVICE":
            utilServices.deleteService(req,us_id,res);
            break;

        case "GET_MY_SERVICES":
            utilServices.getMyServices(us_id,res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}

module.exports = serviceOperation;
