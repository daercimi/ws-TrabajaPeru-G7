module.exports = {
    app_name: "Trabaja Peru",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "sql10.freemysqlhosting.net",
    //hostdb: "localhost",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,             
    //portdb:3306,
    userDb: process.env.USERDB || "sql10420317",        
    //userDb: "root",
    passwordDb: process.env.PASSWORDDB || "6cbrNQwyDU",     
    //passwordDb: "unmsm",
    database: process.env.DATABASE || "sql10420317",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
    //cloudinary vars
    cloud_name: process.env.CLOUD_NAME || "trabaja-peru",
    api_key: process.env.api_key || "655682455259227",
    api_secret: process.env.api_secret || "jGB0CZQ5KMa3F-pBwR6WOfZWOEA"

}; 