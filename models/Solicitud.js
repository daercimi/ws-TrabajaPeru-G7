class Solicitud {
    constructor(user, request) { 
            this.sol_estado = request.sol_estado;
            this.sol_leido = request.sol_leido;
            this.sol_mensaje = request.sol_mensaje;

            this.sol_calificacion_trabajador = request.sol_calificacion_trabajador;
            this.sol_calificacion_cliente = request.sol_calificacion_cliente;

            this.us_id_trabajador = request.us_id_trabajador;
            this.cat_id = request.cat_id;
            this.us_id_cliente = user;
    }
}
module.exports = Solicitud