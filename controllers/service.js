const dbConnection = require("../connect");
const connect = require("../connect");
const connection = dbConnection();

serviceOperation = function(req,res) {

    const command = req.body.command;
    switch(command){

        case "SEARCH_SERVICE":
           searchCategory(req,res);
           break;

        case "GET_HOME_SERVICES":
            //Los primeros 10 para el home
            getHomeServices(res);
            break;

        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            })
    }
}

function searchCategory(req, res) {
    /*Se harían 2 búsquedas:
    1) Buscar el cat_id según la cadena de texto
    2) Buscar los servicios que tienen ese cat_id*/
    let CatName = req.body.transaction;
    CatName = "%"+CatName+"%";
    connection.connect()
    connection.query("SELECT * FROM Categoria WHERE cat_nombre LIKE ? ;",[CatName], (err, result) => {
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } 
        if (Object.entries(result) == 0) {
            return res.status(200).send({
                status: "SUCCESS",
                message: "No hay servicios encontrados",
            });
        } else {
            serviciosEncontrados = searchService(result[0].cat_id, res);
        }
    });

}

function searchService(cat_id, res){
    connection.connect();

    connection.query("SELECT * FROM Servicio WHERE cat_id = ? AND ser_eliminado = 0;", [cat_id], (err, result) => {
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.send(JSON.stringify(result))
        }
    });
}

function getHomeServices(res){

    connection.connect();
    connection.query("SELECT * FROM Servicio WHERE ser_eliminado = 0 LIMIT 10;",(err, result) =>{
        if (err) {
            return res.status(200).send({
                status: "FAILED",
                message: err,
            });
        } else {
            return res.status(200).send(JSON.stringify(result));
        }        
    });
}

module.exports = serviceOperation;
