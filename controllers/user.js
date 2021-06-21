const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const dbConnection = require("../connect");
const connection = dbConnection();


userOperation = function(req, res) {
    const command = req.body.command;
    switch (command) {
        case "REGISTER_USER":
            registerUser(req, res);
            break;
        case "LOGIN_USER":
            loginUser(req, res);
            break;
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }
};

function registerUser(req, res) {
    const user = req.body.transaction;
    const saltRounds = 10;
    const newUsuario = new Usuario(user);

    bcrypt.hash(newUsuario.password, saltRounds).then((hash) => {
        connection.query(
            "INSERT INTO usuario values(?,?,?,?)", [newUsuario.id, newUsuario.nombre, newUsuario.email, hash],
            (err, result) => {
                if (err) {
                    return res.status(200).send({
                        status: "FAILED",
                        message: err,
                    });
                } else {
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "Usuario registrado correctamente",
                    });
                }
            }
        );

    });
}

function loginUser(req, res) {
    const newUsuario = new Usuario(req.body.transaction);
    connection.query(
        "SELECT * FROM usuario WHERE email = ?", [newUsuario.email],
        (err, result) => {
            if (err != null) {
            } else {
                if (!result || result.length <= 0) {
                    return res.status(200).send({
                        status: "Failed",
                        message: "No se encontro el usuario",
                    });
                }
                if (result.length > 0) {
                    try {
                        bcrypt.compare(newUsuario.password, result[0].contrasenia,
                            (err2, result2) => {
                                if (err2) {
                                    return res.status(200).send({
                                        status: "FAILED",
                                        message: "La contraseña es incorrecta",
                                    });
                                }
                                if (result2) {
                                    const usr = result[0]
                                    delete usr.contrasenia
                                    return res.status(200).send({
                                        status: "SUCCESS",
                                        message: "Usuario logeado correctamente",
                                        transaction: usr
                                    });
                                }
                            }
 
                        );
                        /* bcrypt.compare(newUsuario.password, result.contrasenia, function(err, res2) {
                            return res.status(200).send({
                                status: "SUCCESS",
                                message: "Usuario logeado correctamente",
                            });
                        }); */
                    } catch {}
                }
            }
        }
    );
}
module.exports = userOperation;