module.exports = {
    app_name: "Trabaja Peru",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "localhost",
    //hostdb: "localhost",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,             
    //portdb:3306,
    userDb: process.env.USERDB || "root",        
    //userDb: "root",
    passwordDb: process.env.PASSWORDDB || "discoMysql_1",     
    //passwordDb: "unmsm",
    database: process.env.DATABASE || "ie6vlyj8y825umfi",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
    //cloudinary vars
    cloud_name: process.env.CLOUD_NAME || "trabaja-peru",
    api_key: process.env.API_KEY || "655682455259227",
    api_secret: process.env.API_SECRET || "jGB0CZQ5KMa3F-pBwR6WOfZWOEA"

}; 