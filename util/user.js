'use strict'
const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const dbConnection = require("../connect");
const connection = dbConnection();
const utilComun = require("./comun");
const services = require("../services/index")

function loginUser(req, res) {
    console.log(req.body);
    const newUsuario = new Usuario(req.body.transaction);
    connection.query(
        "SELECT * FROM Usuario WHERE us_correo = ?", [newUsuario.us_correo],
        (err, result) => {
            if (err != null) {
            } else {
                if (!result || result.length <= 0) {
                    return utilComun.resFailed200(res,"No se encontro el usuario");
                }
                if (result.length > 0) {
                    try {
                        bcrypt.compare(newUsuario.us_contrasena, result[0].us_contrasena,
                            (err2, result2) => {
                                if (err2) {
                                    return utilComun.resFailed200(res,"La contraseña es incorrecta");
                                }
                                if (result2) {
                                    const usr = result[0]
                                    delete usr.us_contrasena
                                    return res.status(200).send({
                                        token: services.createToken(usr),
                                        status: "SUCCESS",
                                        message: "Usuario logeado correctamente",
                                        transaction: usr
                                    });
                                }
                            }
                        );
                    } catch {}
                }
            }
        }
    );
}

function registerUser(req, res) {

    const user = req.body.transaction;
    const saltRounds = 10;
    const newUsuario = new Usuario(user);

    bcrypt.hash(newUsuario.us_contrasena, saltRounds).then((hash) => {
        connection.connect()
        connection.query(
        "CALL registerUser(?,?,?,?,?,?,?,?)" , [newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_correo, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito, hash, newUsuario.us_imagen],
            (err, result) => {
                if (err) {
                    return utilComun.resFailed200(res,err);
                } else {
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "Usuario registrado correctamente",
                    });
                }
                
            }
            
        )
        ;
    
    },
    );
}

function searchUser(req, res) {
    const userName = req.body.transaction;
    connection.connect()
    connection.query(
        "CALL searchUser(?)",[userName],
        (err, result) => {
            if (err) {
                return utilComun.resFailed200(res,err);
            } else {
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Usuario encontrado",
                });
            }
        }
    );
}
function getUsers(res) {

    connection.connect()
    connection.query(
        "CALL getHomeUsers();",
        (err, result) => {
            if (err) {
                return utilComun.resFailed200(res,err);
            } else {
                return utilComun.stringifyResult(res,result);
            }
        }
    );
}

function obtainUser(req,res) {
    const user = req.user.response.payload;
    connection.connect()
    connection.query(
        "CALL obtainUser(?);", [user],
        (err,result) => {
            if(err) {
                return utilComun.resFailed200(res,err);
            }
            else {
                return utilComun.stringifyResult(res,result);
            }
        }
    )
}

function editUser(req,res) {
    const user = req.user.response.payload;
    const newUsuario = new Usuario(req.body.transaction);
    connection.connect()
    connection.query(
        "CALL editUser(?,?,?,?,?,?,?,?);",[newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito,newUsuario.us_contrasena, newUsuario.us_imagen, user],
        (err, result) => {
            if (err) {
                return res.status(200).send({
                    status: "FAILED",
                    message: err,
                });
            } else {
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Información de usuario modificada correctamente",
                });
            }
        }
    );
}
module.exports = {
	loginUser,
	registerUser,
	searchUser,
	getUsers,
    editUser,
    obtainUser
}