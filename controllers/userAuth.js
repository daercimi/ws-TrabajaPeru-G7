const serviceUser = require("../util/user")
const utilComun = require("../util/comun")
var userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "EDIT_USER":
            serviceUser.editUser(req, res);
            break;

        case "GET_MY_USER": 
            serviceUser.getMyUser(req, res);
            break;

        case "SEARCH": 
            utilComun.search(req, res);
            break;

        case "OBTAIN_USER": //Para obtener el perfil de cualquier usuario
            serviceUser.obtainUser(req,res);
        break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;