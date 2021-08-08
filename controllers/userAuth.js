const utilUser = require("../util/user")
var userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "EDIT_USER":
            utilUser.editUser(req, res);
            break;

        case "GET_MY_USER": 
            utilUser.getMyUser(req, res);
            break;

        case "GET_HOME_USERS": //PARA EL HOME, los 10 más recientes usuarios
            utilUser.getHomeUsers(req,res);
        break;

        case "OBTAIN_USER": //Para obtener el perfil de cualquier usuario
            utilUser.obtainUser(req,res);
        break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;