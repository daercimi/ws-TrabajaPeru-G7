'use strict'
const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const dbConnection = require("../connect");
const connection = dbConnection();

function loginUser(req, res) {
    console.log(req.body);
    const newUsuario = new Usuario(req.body.transaction);
    connection.query(
        "SELECT * FROM Usuario WHERE us_correo = ?", [newUsuario.us_correo],
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
                        bcrypt.compare(newUsuario.us_contrasena, result[0].us_contrasena,
                            (err2, result2) => {
                                if (err2) {
                                    return res.status(200).send({
                                        status: "FAILED",
                                        message: "La contraseña es incorrecta",
                                    });
                                }
                                if (result2) {
                                    const usr = result[0]
                                    delete usr.us_contrasena
                                    return res.status(200).send({
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
        "INSERT INTO Usuario (us_nombres,us_celular,us_correo,us_departamento,us_provincia,us_distrito,us_contrasena) values(?,?,?,?,?,?,?)" , [newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_correo, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito, hash],
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
            
        )
        ;
    
    },
    );
}

function searchUser(req, res) {
    const userName = req.body.transaction;
    connection.connect()
    connection.query(
        "SELECT * FROM Usuario",
        (err, result) => {
            if (err) {
                return res.status(200).send({
                    status: "FAILED",
                    message: err,
                });
            } else {
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Usuario encontrado",
                });
            }
        }
    );
    console.log("Buscando a: " + userName.nombre);
    res.send(`Buscando a: ${userName.nombre}`);
}
function getUsers(res) {

    connection.connect()
    connection.query(
        "SELECT * FROM Usuario",
        (err, result) => {
            if (err) {
                return res.status(200).send({
                    status: "FAILED",
                    message: err,
                });
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        }
    );
}
function editUser(req,res) {
    const user = req.user.response.payload;
    const newUsuario = new Usuario(req.body.transaction);
    connection.connect()
    connection.query(
        "UPDATE Usuarios SET (us_nombres,us_celular,us_correo,us_departamento,us_provincia,us_distrito) WHERE us_id = ? values(?,?,?,?,?,?,?) "[newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_correo, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito,user],
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
    editUser
}