const utilUser = require("../util/user")
userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "REGISTER_USER":
            utilUser.registerUser(req, res);
            break;
        case "LOGIN_USER":
            utilUser.loginUser(req, res);
            break;
        case "SEARCH_USER":         
            utilUser.searchUser(req, res);
            break;
        case "RATE_USER": //Calificar usuario
            utilUser.rateUser(req, res);
            break;
        case "GET_USERS": //PARA EL HOME, los 10 más recientes usuarios
            utilUser.getUsers(res);
            break;
        case "OBTAIN_USER": 
            utilUser.obtainUser(res);
            break;
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;
