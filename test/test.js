const server = require("../index");
const auth = require("../middleware/auth")
const service = require("../controllers/service");
const searchservices = require("../controllers/searchservices.js"); 

const chai = require("chai");
const chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);


describe("Pruebas del controlador de servicios", () => {

  describe("Pruebas del controlador de servicios", () => {
    it("Prueba del comando SEARCH_SERVICES" , function(done){
      chai.request(server)
      .post("/service/search",searchservices)
      .send({
          command:"SEARCH_SERVICE",
          transaction: "nombre"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        // expect(response).contain();
        expect(response).to.be.a("Object");
        done();
      })
    })
  
    it("Prueba del comando GET_HOME_SERVICES" , function(done){
      chai.request(server)
      .post("/service/search",searchservices)
      .send({
          command:"GET_HOME_SERVICES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        done();
      })
    })
  
    it("Prueba del comando CREATE_SERVICE" , function(done){
      chai.request(server)
      .post("/service",auth,service)
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
      .post("/service",auth,service)
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
      .post("/service",auth,service)
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
      .post("/service",auth,service)
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

  })
})
