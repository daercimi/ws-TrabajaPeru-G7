const utilUser = require("../util/user")
const userOperation = function(req, res) {
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
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;
