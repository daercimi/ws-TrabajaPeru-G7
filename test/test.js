const server = require("../index");
//const auth = require("../middleware/auth");
const user = require("../controllers/user"); 

const chai = require("chai");
const chaiHttp = require("chai-http");

//chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe("Pruebas de funcion Buscar usuario", function(done){
  it("Prueba JuanD" , function(done){
    chai.request(server)
    .post("/search/user",user)
    .send({
      command : "SEARCH_USER",
      transaction : {
            nombre : "Juand"
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba Vacio" , function(done){
    chai.request(server)
    .post("/search/user",user)
    .send({
      command : "SEARCH_USER",
      transaction : {
            nombre : ""
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba Error en ruta" , function(done){
    chai.request(server)
    .post("/search/use",user)
    .send({
      command : "SEARCH_USER",
      transaction : {
            nombre : ""
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(404);
      done();
    })
  })

  it("Prueba Error en command" , function(done){
    chai.request(server)
    .post("/search/use",user)
    .send({
      command : "SEARCH_USE",
      transaction : {
            nombre : ""
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(404);
      done();
    })
  })

  it("Prueba Error en transaccion" , function(done){
    chai.request(server)
    .post("/search/use",user)
    .send({
      command : "SEARCH_USE",
      transaction : {
            n : ""
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(404);
      done();
    })
  })

  it("Prueba No hay transaccion" , function(done){
    chai.request(server)
    .post("/search/use",user)
    .send({
      command : "SEARCH_USE",
    })
    .end(function (err, response){
      expect(response).to.have.status(404);
      done();
    })
  })

  it("Prueba Error peticion" , function(done){
    chai.request(server)
    .get("/search/user",user)
    .send({
      command : "SEARCH_USER",
      transaction : {
            nombre : "Juand"
      }
    })
    .end(function (err, response){
      expect(response).to.have.status(404);
      done();
    })
  })

})