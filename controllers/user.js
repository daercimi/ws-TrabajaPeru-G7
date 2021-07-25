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
            searchUser(req, res);
            break;
        case "RATE_USER": //Calificar usuario
            rateUser(req, res);
            break;
        case "GET_USERS": //PARA EL HOME, los 10 más recientes usuarios
            getUsers(res);
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
    //newUsuario.us_id = 1

    bcrypt.hash(newUsuario.us_contrasena, saltRounds).then((hash) => {
        connection.connect()
        connection.query(
        "INSERT INTO Usuario (us_nombres,us_celular,us_correo,us_departamento,us_provincia,us_distrito,us_contrasena) values(?,?,?,?,?,?,?)" , [newUsuario.us_nombres,newUsuario.us_celular, newUsuario.us_correo, newUsuario.us_departamento,newUsuario.us_provincia,newUsuario.us_distrito, hash],
            (err, result) => {
                //console.log(err)
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BUSCAR USUARIO
function searchUser(req, res) {
    const userName = req.body.transaction;
    connection.connect()
    connection.query(
        "SELECT * FROM Usuario Where us_nombres LIKE ?", [userName.nombre+'%'],    
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
                    Buscando: `${userName.nombre}`,
                    resultado: result
                });
            }
        }
    );
    console.log("Buscando a: " + userName.nombre);
}   


//CALIFICAR TRATO DE CLIENTE
function rateUser(req, res) {
    const newUsuario = req.body.transaction;
    connection.connect()

    var consulta
/*
    function select(){    
        connection.query(
            "SELECT * FROM Usuario Where us_id = ?", [newUsuario.id],    
            (err, result) => {
                if (err) {
                    return res.status(200).send({
                        status: "FAILED",
                        message: err,
                    });
                } else {
                    consulta = result
                    console.log(consulta)
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "Obtengo usuario",
                        Usuario: `${newUsuario.nombre}`,
                        resultado: result
                    });
                }
            }
        );  
        //connection.end  
    }
*/
    function deleteUser(){
        connection.query(
            "DELETE FROM Usuario Where us_id = ?", [newUsuario.id],    
            (err, result) => {
                if (err) {
                    return res.status(200).send({
                        status: "FAILED",
                        message: err,
                    });
                } else {
                    return res.status(200).send({
                        status: "SUCCESS",
                        message: "Eliminado",
                    });
                }
            }
        );  
    };

    select();
    deleteUser();


    /*connection.query(
        "DELETE * FROM Usuario Where us_id = ?", [newUsuario.id],    
        (err, result) => {
            if (err) {
                return res.status(200).send({
                    status: "FAILED",
                    message: err,
                });
            } else {
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Eliminado",
                });
            }
        }
    );
    connection.query(
        "INSERT INTO Usuario VALUES", [newUsuario],    
        (err, result) => {
            if (err) {
                return res.status(200).send({
                    status: "FAILED",
                    message: err,
                });
            } else {
                return res.status(200).send({
                    status: "SUCCESS",
                    message: "Eliminado",
                });
            }
        }
    );
    console.log("Calificando a: " + newUsuario.nombre);*/
}  



////////////////////////////////////////////////////////////////////////////////////////////////////

function getUsers(res) {

    connection.connect()
    connection.query(
        "SELECT * FROM Usuario LIMIT 3;",
        //WHERE nombre LIKE %?%", [userName.nombre],
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


module.exports = userOperation;
