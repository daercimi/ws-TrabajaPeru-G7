module.exports = {
    app_name: "Trabaja Peru",
    host: process.env.HOST || "http://localhost",
    hostdb: process.env.HOSTDB || "ro2padgkirvcf55m.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    //hostdb: "localhost",
    port: process.env.PORT || 4000,
    portdb: process.env.PORTDB || 3306,             
    //portdb:3306,
    userDb: process.env.USERDB || "g0f9200gz3nnmt52",        
    //userDb: "root",
    passwordDb: process.env.PASSWORDDB || "y4ln5cq43z71addn",     
    //passwordDb: "unmsm",
    database: process.env.DATABASE || "ie6vlyj8y825umfi",
    TOKEN_SECRET: process.env.TOKEN_SECRET || "trabajaperu-access",
    //cloudinary vars
    cloud_name: process.env.CLOUD_NAME || "trabaja-peru",
    api_key: process.env.API_KEY || "655682455259227",
    api_secret: process.env.API_SECRET || "jGB0CZQ5KMa3F-pBwR6WOfZWOEA"

}; 