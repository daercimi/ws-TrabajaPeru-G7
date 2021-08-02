const dbConnection = require("../connect");
const utilServices = require("../util/services");


var serviceOperation = function(req,res) {

    const command = req.body.command;
    switch(command){

        case "SEARCH_SERVICE":
            utilServices.searchService(req,res);
           break;

        case "GET_HOME_SERVICES":
            utilServices.getHomeServices(res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}



module.exports = serviceOperation;
