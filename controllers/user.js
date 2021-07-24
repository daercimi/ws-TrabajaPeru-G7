const serviceUser = require("../util/user")
userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "REGISTER_USER":
            serviceUser.registerUser(req, res);
            break;
        case "LOGIN_USER":
            serviceUser.loginUser(req, res);
            break;
        case "SEARCH_USER":
            serviceUser.searchUser(req, res);
            break;
        case "GET_USERS": 
            serviceUser.getUsers(res);
            break;
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;
