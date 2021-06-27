const express = require("express");
const user = require("../controllers/user");
//agregado por dan
const PruebaCtrl = require("../controllers/pruebaCtrl");
//agregado por dan
const api = express.Router();
const dbConnection = require("../connect");
const connection = dbConnection();
const auth = require("../middleware/auth")
api.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

api.get("/", function(req, res) {
    res.send("Web service Trabaja Perú");
});

//agregado por DAN
api.post("/", (req,res)=>{
    valor_busqueda = req.body;
    res.send("respuesta al fron");
});
//agregado por DAN

api.post("/user", user);
api.post("/login", (req, res) => {
    res.send("Registrado");
});

module.exports = api;