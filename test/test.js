const server = require("../index");
const auth = require("../middleware/auth")
const service = require("../controllers/service"); 

const chai = require("chai");
const chaiHttp = require("chai-http");

//chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

describe("Pruebas del controlador de servicios", function(done){
  it("Txt" , function(done){
    chai.request(server)
    .post("/service",auth,service)
    .set('authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
    .send({
      command: "EDIT_SERVICE"
    })
    .end(function (err, response){
      expect(response).to.have.status(500);
      done();
    })
  })

})