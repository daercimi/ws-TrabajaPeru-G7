const server = require("../index");
const auth = require("../middleware/auth")
const serviceAuth = require("../controllers/serviceAuth.js");
const service = require("../controllers/service.js"); 
const user = require("../controllers/user.js");
const userAuth = require("../controllers/userAuth.js");
const dbConnection = require("../connect");
const connection = dbConnection();
const services = require("../services/index")

const chai = require("chai");
const chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);

let test_us_nombres = 'Test name';
let test_us_correo = 'testcorreo@testing.com';
let test_us_celular = "735712673";
let test_us_departamento = "Lima";
let test_us_provincia = "Lima";
let test_us_distrito = "Lima";
let test_us_contrasena = "testing";

let test_cat_nombre = "Mudanzas";

var test_tkn = "";

describe("PRUEBAS DEL BACK", () => {

  describe("Pruebas Generales", ()=>{

    it("Prueba de 404 Not Found" , function(done){
      chai.request(server)
      .post("/cualquierruta")
      .set('authorization','bearer eyJhbGciOI6IkpXVCJ9.eyJzdWIiOkwIiwibmWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2yN_lfWSFCms4z4')
      .send({})
      .end(function (err, response){
        expect(response).to.have.status(404);
        done();
      })
    })

    it("Prueba del index" , function(done){
      chai.request(server)
      .get("/")
      .end(function (err, response){
        expect(response).to.have.property('text',"Web service Trabaja Perú");
        done();
      })
    })

    it("Prueba de fallo en autenticación por falta de authorization" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .send({
          command:"",
          transaction: {}
      })
      .end(function (err, response){
        expect(response).to.have.status(401);
        done();
      })
    })

    it("Prueba de fallo en autenticación por error en authorization" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"",
          transaction: {}
      })
      .end(function (err, response){
        expect(response).to.have.status(401);
        done();
      })
    })

    it("Prueba de fallo en token invalido o expirado" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJhbGciOiJkUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"",
          transaction: {}
      })
      .end(function (err, response){
        expect(response).to.have.status(403);
        done();
      })
    })

});


  describe("PRUEBAS DE CONTROLADORES DE USUARIOS", () => {
    
    it("Prueba del comando REGISTER_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "REGISTER_USER",
        transaction : {
            us_nombres : test_us_nombres,
            us_celular : test_us_celular,
            us_correo : test_us_correo,
            us_departamento : test_us_departamento,
            us_provincia : test_us_provincia,
            us_distrito : test_us_distrito,
            us_contrasena : test_us_contrasena,
            us_imagen : ""
        }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    connection.connect()
    connection.query("SELECT us_id FROM Usuario WHERE us_correo = ?;",[test_us_correo],(err,result)=>{
      if(err == null){
        const usr = result[0];
        test_tkn = 'bearer ' + services.createToken(usr);
      }
    });

    it("Prueba del comando LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : {
            us_correo : test_us_correo,
            us_contrasena : test_us_contrasena
        }  
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba no existe usuario LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : {
            us_correo : "vgjkrsealrkcmslkrea",
            us_contrasena : "unmsm"
        }  
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba contraseña incorrecta LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : {
            us_correo : test_us_correo,
            us_contrasena : "gaaaaa"
        }  
      })
      .end(function (err, response){
        if(err){
          expect(err).to.have.status(200);
          done();
        }
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : test_us_nombres
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba no exite usuario SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : "njr;ktsntjkernfcjse;"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba error comando SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : {
          nombre: "Arian"
        }
        
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando GET_HOME_USERS" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
          command:"GET_HOME_USERS"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando GET_MY_USER" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn)
      .send({
          command:"GET_MY_USER"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })
    
    it("Prueba del comando EDIT_USER" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn)
      .send({
          command:"EDIT_USER",
          transaction:{
            us_nombres:"test editado",
            us_celular:987654321,
            us_departamento:"Lima",
            us_provincia:"Lima",
            us_distrito:"Lima",
            us_imagen:"link editado"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })
    
    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CUALQUIER_COMANDO"
      })
      .end(function (err, response){
        expect(response).to.have.status(500);
        done();
      })
    })
    
  })
  /////////////////////////////////////////////////////////////////////////////

describe("PRUEBAS DE CONTROLADORES DE SERVICIOS", () => {

  describe("Pruebas a serviceAuth", () => {

    it("Prueba del CREATE_SERVICE failed SQL" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      // no cambiar el token por test_tkn
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwibmFtZSI6InRlc3Qgbm9tYnJlIiwiaWF0IjoxNTE2MjM5MDIyfQ.t1Cy8EvsaFmAW9MinlhCc-0rERkJ5UHxrSwVP8kAd4A')
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del CREATE_SERVICE failed SQL2" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "/*",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })
  
    it("Prueba del comando EDIT_SERVICE Error SQL" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"EDIT_SERVICE",
          transaction: {
            cat_id:6,
            ser_descripcion: "/*",
            ser_imagen: "*/"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando DELETE_SERVICE Error SQL" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"DELETE_SERVICE",
          transaction: {
            cat_id:";;;;;"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando CREATE_SERVICE no existente" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "Mudanzas",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando GET_MY_SERVICES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"GET_MY_SERVICES",
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando CREATE_SERVICE existente" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "Mudanzas",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando DELETE_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"DELETE_SERVICE",
          transaction: {
            cat_id:10
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando CREATE_SERVICE eliminado" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "Mudanzas",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando EDIT_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"EDIT_SERVICE",
          transaction: {
            cat_id:10,
            ser_descripcion: "test descripcion editada",
            ser_imagen: "test link editado"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando GET_CATEGORIES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"GET_CATEGORIES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn)
      .send({
          command:"CUALQUIER_COMANDO"
      })
      .end(function (err, response){
        expect(response).to.have.status(500);
        done();
      })
    })

  })

  describe("Pruebas de service" , () => {

    it("Prueba del comando SEARCH_SERVICES" , function(done){
      chai.request(server)
      .post("/service",service)
      .send({
          command:"SEARCH_SERVICE",
          transaction: "nombre"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.be.a("Object");
        done();
      })
    })

    it("Prueba del comando GET_HOME_SERVICES" , function(done){
      chai.request(server)
      .post("/service",service)
      .send({
          command:"GET_HOME_SERVICES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando OBTAIN_SERVICE", function(done){
      chai.request(server)
      .post("/service",service)
      .send({
          command:"OBTAIN_SERVICE",
          transaction:{
            us_id:1,
            cat_id:4
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/service",service)
      .send({
          command:"CUALQUIER_COMANDO"
      })
      .end(function (err, response){
        expect(response).to.have.status(500);
        done();
      })
    })

  })

  })
})

connection.connect()
connection.query("CALL testRestore(?,?)",[test_us_correo, test_cat_nombre]);

