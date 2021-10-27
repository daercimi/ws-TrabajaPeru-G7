'use strict'
const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const dbConnection = require("../connect");
const connection = dbConnection();
const utilComun = require("./comun");
const services = require("../services/index")
const utilConstant = require("./constant");

function loginUser(req, res) {
    const newUsuario = new Usuario(req.body.transaction);
    connection.query(
        "SELECT * FROM Usuario WHERE us_correo = ?;", [newUsuario.us_correo],
        (err, result) => {
            if (err != null) {
            } else {
                if (!result || result.length <= 0) {
                    return utilComun.resFailed(res,"No se encontro el usuario",200);
                }
                if (result.length > 0) {
                    try {
                        bcrypt.compare(newUsuario.us_contrasena, result[0].us_contrasena,
                            (err2, result2) => {
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
                                else{
                                    return utilComun.resFailed(res,"La contraseña es incorrecta",200);
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
                    return utilComun.resFailed(res,err,200);
                } else {
                    return res.status(200).send(
                        utilConstant.generateresponse({
                            status: "SUCCESS",
                            message: "Usuario registrado correctamente"
                        })
                    );
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
                return utilComun.resFailed(res,err,200);
            } else {
                if (result[0].length == 0 ){
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "No se encontraron resultados",
                        resultado: result[0],
                    });
                }
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Búsqueda existosa",
                    resultado: result[0],
                });
                
            }
        }
    );
}

function getHomeUsers(res) {

    connection.connect()
    connection.query(
        "CALL getHomeUsers();",
        (err, result) => {
            utilComun.errResult(res, err,result,200,200);
        }
    );
}

function getMyUser(req,res) {
    const user = req.user.response.payload;
    connection.connect()
    connection.query(
        "CALL getMyUser(?);", [user],
        (err,result) => {
            utilComun.errResult(res,err,result[0],200,200);
        }
    )
}

function obtainUser(req,res) {
    const user = req.body.transaction;
    connection.connect()
    connection.query(
        "CALL obtainUser(?);", [user.us_id],
        (err,result) => {
            utilComun.errResult(res,err,result,200,200);
        }
    )
}

function editUser(req,res) {
    const user = req.user.response.payload;
    const newUsuario = new Usuario(req.body.transaction);
    connection.connect()
    connection.query(
        "CALL editUser(?,?,?,?,?,?,?);",[newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito, newUsuario.us_imagen, user],
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
	getHomeUsers,
    obtainUser,
    editUser,
    getMyUser
}