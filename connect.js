const mysql = require("mysql");
const GlobalEnv = require("./GlobalEnv");

module.exports = () => {
    return mysql.createConnection({
        host: GlobalEnv.hostdb,
        user: GlobalEnv.userDb,
        port: GlobalEnv.portdb,
        password: GlobalEnv.passwordDb,
        database: GlobalEnv.database,
    });
};