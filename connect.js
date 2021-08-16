const mysql = require("mysql2");
const GlobalEnv = require("./GlobalEnv");

module.exports = () => {
    return mysql.createPool({
        connectionLimit : 30,
        host: GlobalEnv.hostdb,
        user: GlobalEnv.userDb,
        port: GlobalEnv.portdb,
        password: GlobalEnv.passwordDb,
        database: GlobalEnv.database,
        debug    :  false
    });
};