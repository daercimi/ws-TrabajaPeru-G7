const express = require("express");

const user = require("../controllers/user");
const userAuth = require("../controllers/userAuth");
const serviceAuth = require("../controllers/serviceAuth");
const service = require("../controllers/service");
const solicitudAuth = require("../controllers/solicitudAuth");

const api = express.Router();
const dbConnection = require("../connect");
const connection = dbConnection();
const auth = require("../middleware/auth");
api.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

api.get("/", function(req, res) {
    res.send("Web service Trabaja Perú");
});

api.post("/user", user);
api.post("/user-auth",auth,userAuth);
api.post("/service-auth",auth,serviceAuth);
api.post("/service",service);
api.post("/solicitud-auth",auth,service);
///////////////////////////////////////////////////////////////
//BUSCAR USUARIO
api.post("/search/user", user);

//CALIFICAR TRATO DE CLIENTE
api.post("/user/rate", user);
///////////////////////////////////////////////////////////////

module.exports = api;