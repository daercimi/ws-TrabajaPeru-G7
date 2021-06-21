PruebaCtrl = function(req,res){
    //const command = req.body.command;
    valor_busqueda = req.body;
    search(req, res);
    
    /*switch (command) {
        case "SEARCH":
            search(req, res);
            break;
        default:
            return res.status(500).send({
                status: "ERROR",
                message: "No se ha encontrado la operación",
            });
    }*/
};

function search(req,res){
    console.log("Conexión al back exitosa");
    res.json({
        mensaje:"Respuesta al front"
    })
}

module.exports = PruebaCtrl;