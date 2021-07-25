module.exports = {
    app_name: "Trabaja Peru",
    uri_database: "",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "localhost",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,
    userDb: process.env.USERDB || "root",
    passwordDb: process.env.PASSWORDDB || "discoMysql_1",
    database: process.env.DATABASE || "sql10420317",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
}; 