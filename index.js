const app = require('./app')
const GlobalEnv = require('./GlobalEnv')

module.exports = app.listen(GlobalEnv.port, () => {
    console.log(`Servidor web escuchando en ${GlobalEnv.host}:${GlobalEnv.port}`)
})