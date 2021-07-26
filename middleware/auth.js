const services = require('../services/index');
const comun = require('../util/comun');
const constant = require('../util/constant');

function ensureAuthenticated(req, res, next) {
  if(!req.headers.authorization) {
    return res
    .status(401)
    .send({
      message: "Fallo de Autenticación."
    }); //Unauthorized
  }
  let stringtoken = req.headers.authorization.split(" ");
  const token = stringtoken[1];

  if(token == null){
    return res
    .status(401)
    .send({
      message: "Fallo de Autenticación."
    }); //Unauthorized
  }

  services.decodeToken(token)
    .then(response =>{
      req.user = response
      next()
    })
    .catch(response =>{
      params[0] = response.code
      params[1] = constant.ResponseCode.error
      params[2] = `${response.message}`
      return res
        .status(403)
        .send({
          message: "Token expirado o inválido"
        });
    })
}

module.exports = ensureAuthenticated