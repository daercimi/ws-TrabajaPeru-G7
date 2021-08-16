const server = require("../index");
const auth = require("../middleware/auth")

const serviceAuth = require("../controllers/serviceAuth.js");
const service = require("../controllers/service.js"); 
const user = require("../controllers/user.js");
const userAuth = require("../controllers/userAuth.js");
const solicitudAuth = require("../controllers/solicitudAuth.js");

const dbConnection = require("../connect");
const connection = dbConnection();
const services = require("../services/index")

const chai = require("chai");
const chaiHttp = require("chai-http");

var expect = chai.expect;
chai.use(chaiHttp);

const test1 = {
  us_nombres:"Test name",
  us_correo: 'testcorreo@testing.com',
  us_celular: "735712673",
  us_departamento: "Lima",
  us_provincia: "Lima",
  us_distrito: "Lima",
  us_contrasena: "testing",
  us_imagen:""
}

const test2 = {
  us_id:100,
  us_nombres:"Test2 services",
  us_correo: 'test2@correo.com',
  us_celular: "987654321",
  us_departamento: "Lima",
  us_provincia: "Lima",
  us_distrito: "Lima",
  us_contrasena: "testing",
  us_imagen:"",

  cat_id:1,
  cat_nombre:"Albañilería"
}

var test_tkn1 = "";
var test_tkn2 = "";

//////////////////////////////////////
  test_tkn2 = 'bearer ' + services.createToken(test2);
/////////////////////////////////

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
      .send({})
      .end(function (err, response){
        expect(response).to.have.status(401);
        done();
      })
    })

    it("Prueba de fallo en token invalido" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJhbGciOiJkUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Lxz0UOj2iwKalBcvvkw8yN_lfWSFCXpqK1UEI4ms4z4')
      .send({})
      .end(function (err, response){
        expect(response).to.have.status(403);
        done();
      })
    })

    it("Prueba de fallo en token expirado" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization','bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEwMCwiaWF0IjoxNjI4MjE3NTg0LCJleHAiOjE2MTYyMzkwMjJ9.Zl-Z14j6bWf3bRkN8DQV8inNv7Y7T2qcoVgVGw02sl8')
      .send({})
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
        transaction : test1
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS",
          'body.message':"Usuario registrado correctamente"
        });
        done();
      })
    })

    it("Prueba del comando LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : test2
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS",
          'body.message':"Usuario logeado correctamente"
        });
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
        expect(response).to.nested.include({
          'body.status':"FAILED",
          'body.message':"No se encontro el usuario"
        });
        done();
      })
    })

    it("Prueba contraseña incorrecta LOGIN_USER" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
        command : "LOGIN_USER",
        transaction : {
            us_correo : test2.us_correo,
            us_contrasena : "gaaaaa"
        }  
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"FAILED",
          'body.message':"La contraseña es incorrecta"
        });
        done();
      })
    })

    it("Prueba del comando SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : test2.us_nombres
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS"
        });
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
        expect(response).to.nested.include({
          'body.message':"No se encontraron resultados"
        });
        done();
      })
    })

    it("Prueba error comando SEARCH_USER" , function(done){
      chai.request(server)
      .post("/search/user",user)
      .send({
        command : "SEARCH_USER",
        transaction : {
          nombre: test2.us_nombres
        }
        
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"FAILED"
        });
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
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/user",user)
      .send({
          command:"CUALQUIER_COMANDO"
      })
      .end(function (err, response){
        expect(response).to.have.status(500);
        done();
      })
    })

    it("Prueba del comando GET_MY_USER" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"GET_MY_USER"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })


    it("Prueba del comando EDIT_USER" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn2)
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
        expect(response).to.nested.include({
          'body.status':"SUCCESS",
          'body.message':'Información de usuario modificada correctamente'
        });
        done();
      })
    })
    
    it("Prueba del comando OBTAIN_USER" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"OBTAIN_USER",
          transaction:{
            us_id: test2.us_id,  
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/user-auth",auth,userAuth)
      .set('authorization',test_tkn2)
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
      .set('authorization',test_tkn2)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"FAILED"
        });
        done();
      })
    })
  

    it("Prueba del comando CREATE_SERVICE no existente" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: test2.cat_nombre,
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando GET_MY_SERVICES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"GET_MY_SERVICES",
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando GET_NOT_MY_SERVICES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"GET_NOT_MY_SERVICES",
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando CREATE_SERVICE existente" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "Carpintería",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS"
        });
        done();
      })
    })

    it("Prueba del comando DELETE_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"DELETE_SERVICE",
          transaction: {
            cat_id:3
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS",
          'body.message':'Servicio eliminado correctamente'
        });
        done();
      })
    })

    it("Prueba del comando CREATE_SERVICE eliminado" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"CREATE_SERVICE",
          transaction: {
            cat_nombre: "Cocina",
            ser_descripcion: "test",
            ser_imagen: "link"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS"
        });
        done();
      })
    })

    it("Prueba del comando EDIT_SERVICE" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"EDIT_SERVICE",
          transaction: {
            cat_id:1,
            ser_descripcion: "test descripcion editada",
            ser_imagen: "test link editado"
          }
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).to.nested.include({
          'body.status':"SUCCESS",
          'body.message':'Servicio editado correctamente'
        });
        done();
      })
    })

    it("Prueba del comando GET_CATEGORIES" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
      .send({
          command:"GET_CATEGORIES"
      })
      .end(function (err, response){
        expect(response).to.have.status(200);
        expect(response).not.to.nested.include({
          'body.status':"FAILED"
        })
        done();
      })
    })

    it("Prueba del comando por default" , function(done){
      chai.request(server)
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
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
      .post("/service-auth",auth,serviceAuth)
      .set('authorization',test_tkn2)
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

describe("PRUEBAS DE CONTROLADORES DE SOLICITUD", ()=>{
  it("Prueba del comando CREATE_SOLICITUD" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"CREATE_SOLICITUD",
        transaction: {
          us_id_cliente: test2.us_id,
          us_id_trabajador: test2.us_id,
          cat_id: 2,
          sol_mensaje: "Enviada"
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando GET_SOLICITUDES" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"GET_SOLICITUDES"
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando GET_MY_SOLICITUDES" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"GET_MY_SOLICITUDES"
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando OBTAIN_SOLICITUD" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"OBTAIN_SOLICITUD",
        transaction: {
          sol_id: 4
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando OBTAIN_MY_SOLICITUD" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"OBTAIN_MY_SOLICITUD",
        transaction: {
          sol_id: 4
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })
  it("Prueba del comando CHANGE_SOLICITUD_STATE" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"CHANGE_SOLICITUD_STATE",
        transaction: {
          sol_id: 4,
          sol_estado: "Completada"
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando GET_NOTIFICATIONS" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"GET_NOTIFICATIONS",
        transaction: {
          us_id: test2.us_id
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando RATE_SERVICE" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"RATE_SERVICE",
        transaction: {
          id_solicitud:4,
          calif_tra:3
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba del comando RATE_CLIENT" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"RATE_CLIENT",
        transaction: {
          id_solicitud:4,
          calif_cli:3
        }
    })
    .end(function (err, response){
      expect(response).to.have.status(200);
      done();
    })
  })

  it("Prueba de comando por defecto" , function(done){
    chai.request(server)
    .post("/solicitud-auth",auth,solicitudAuth)
    .set('authorization',test_tkn2)
    .send({
        command:"CUALQUIER_COMANDO"
    })
    .end(function (err, response){
      expect(response).to.have.status(500);
      connection.query("CALL testRestore(?,?,?);",[test1.us_correo,test2.us_id,test2.cat_id],(err,result)=>{
        console.log(" BD Restaurada: \n");
      });

      done();
    })
  })
})


})
