class Servicio {

    // REVISAR

    constructor(user, service) { 
            this.us_id = user;
            this.cat_id = service.cat_id;
            this.ser_descripcion = service.ser_descripcion;
            this.ser_calificacion = service.ser_calificacion;
            this.ser_imagen = service.ser_imagen
    }
}
module.exports = Servicio