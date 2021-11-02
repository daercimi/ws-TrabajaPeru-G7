module.exports = {
    app_name: "Trabaja Peru",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "sql10.freemysqlhosting.net",
    //hostdb: "localhost",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,             
    //portdb:3306,
    userDb: process.env.USERDB || "sql10448614",        
    //userDb: "root",
    passwordDb: process.env.PASSWORDDB || "qNZlcTiYfT",     
    //passwordDb: "unmsm",
    database: process.env.DATABASE || "sql10448614",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
    //cloudinary vars
    cloud_name: process.env.CLOUD_NAME || "chambeafisi",
    api_key: process.env.API_KEY || "748141351746755",
    api_secret: process.env.API_SECRET || "2vh-kiFggGxcBD2-tQGiQi5pi8g"

}; 