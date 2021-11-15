const utilServices = require("../util/services");

var serviceOperation = function(req,res) {

    var us_id = req.user.response.payload;

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

        case "GET_OTHERS_SERVICES":
            utilServices.getOthersServices(req,res);
            break;

        case "GET_CATEGORIES":
            utilServices.getCategories(us_id, res);
            break;
        
        case "OBTAIN_SERVICE":
            utilServices.obtainService(us_id,req,res);
            break;
            
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}

module.exports = serviceOperation;
