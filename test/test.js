const server = require("../index");
const auth = require("../middleware/auth")
const serviceAuth = require("../controllers/serviceAuth.js");
const service = require("../controllers/service.js"); 
const user = require("../controllers/user.js");

const chai = require("chai");
const chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);

describe("PRUEBAS DEL BACK", () => {

  describe("PRUEBAS DE CONTROLADORES DE USUARIOS", () => {
    
    it("Prueba del comando REGISTER_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "REGISTER_USER",
        transaction : {
            us_nombres : "Juan Diego",
            us_celular : "968200448",
            us_correo : "juan.perez@.gmail.com",
            us_departamento : "Lima",
            us_provincia : "Lima",
            us_distrito : "",
            us_contrasena : "unmsm",
            us_imagen : ""
        }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    
    it("Prueba del comando LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : {
            us_correo : "juan.perez@.gmail.com",
            us_contrasena : "unmsm"
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
            us_correo : "v gjkrsealrkcmslkrea",
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
            us_correo : "juan.perez@.gmail.com",
            us_contrasena : "gaaaaa"
        }  
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })


    it("Prueba del comando SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : "Arian"
        
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

    it("Prueba del comando GET_USERS" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
          command:"GET_USERS"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

    it("Prueba del comando OBTAIN_USER" , function(done){
      chai.request(server)
      .post("/user")
      .send({
          command:"OBTAIN_USER"
      })
      .end(function (err, response){
        expect(response).to.have.status(404);
        done();
      })
    })
    
    it("Prueba del comando EDIT_USER" , function(done){
      chai.request(server)
      .post("/user-auth")
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"EDIT_USER"
      })
      .end(function (err, response){
        expect(response).to.have.status(404);
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
  /////////////////////////////////////////////////////////////////////////////

describe("PRUEBAS DE CONTROLADORES DE SERVICIOS", () => {
  describe("Pruebas Generales", ()=>{

      it("Prueba de 404 Not Found" , function(done){
        chai.request(server)
        .post("/cualquierruta")
        .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
        .send({
            command:"CUALQUIER_COMANDO"
        })
        .end(function (err, response){
          expect(response).to.have.status(404);
          done();
        })
      })
  });

  describe("Pruebas a serviceAuth", () => {
  
    it("Prueba del comando CREATE_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_id: 10,
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
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"EDIT_SERVICE",
          transaction: {
            ser_descripcion: "test2",
            ser_imagen: "link2"
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
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"DELETE_SERVICE",
          transaction: {}
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })
  
    it("Prueba del comando GET_MY_SERVICES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"GET_MY_SERVICES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/service-auth",service)
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

    it("Prueba del comando GET_CATEGORIES" , function(done){
      chai.request(server)
      .post("/service",service)
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
