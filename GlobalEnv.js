module.exports = {
    app_name: "Trabaja Peru",
    uri_database: "",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "127.0.0.1",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,
    userDb: process.env.USERDB || "prueba",
    passwordDb: process.env.PASSWORDDB || "prueba",
    database: process.env.DATABASE || "sql10420317",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
};