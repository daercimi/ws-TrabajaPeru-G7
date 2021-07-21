const server = require("../index");
const auth = require("../middleware/auth")
const serviceAuth = require("../controllers/serviceAuth");
const service = require("../controllers/service.js"); 

const chai = require("chai");
const chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);


describe("PRUEBAS DE CONTROLADORES DE SERVICIOS", () => {

  describe("Pruebas del controlador de service.js", () => {
  
    it("Prueba del comando CREATE_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({
          command:"CREATE_SERVICE",
          transaction: {}
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
          transaction: {}
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
          command:"GET_MY_SERVICES",
          transaction: {}
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })

    })

  describe("Pruebas del controlador searchservices.js" , () => {

    it("Prueba del comando SEARCH_SERVICES" , function(done){
      chai.request(server)
      .get("/service",service)
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
      .get("/service",service)
      .send({
          command:"GET_HOME_SERVICES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })

  })

  })
})
