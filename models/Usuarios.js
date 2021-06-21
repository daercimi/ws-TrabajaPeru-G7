
class Usuario {

    constructor(user) {
            this.id = user.id,
            this.nombres = user.nombres,
            this.apellidos = user.apellidos,
            this.celular = user.celular,
            this.departamento = user.departamento,
            this.provincia = user.provincia,
            this.distrito = user.distrito,
            this.clasificacion = user.clasificacion,
            this.email = user.email,
            this.password = user.password
            // this.createAt = user.createAt || new Date()
    }
}
module.exports = Usuario