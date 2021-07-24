const serviceUser = require("../util/user")
userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "EDIT_USER":
            serviceUser.editUser(req, res);
            break;
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

module.exports = userOperation;