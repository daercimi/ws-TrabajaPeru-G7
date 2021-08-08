var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../GlobalEnv');

function createToken(user){
	const payload = {
		"sub" : user.us_id,
		"iat" : moment().unix(),
		"exp": moment().add(30, "days").unix(),
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
}

function decodeToken(token){
	let params = [];
	params.code = 'ERROR'
	return new Promise((resolve, reject) =>{
		try{
			const payload = jwt.decode(token, config.TOKEN_SECRET);
			if(payload.exp <= moment().unix()) {
				params.message = ''
				params.status = 401
				params.code = "0002"
				reject(params);
			}
			params.message = ''
			params.status = 200
			params.code = '0004'
			params.response = {
				payload : payload.sub
			}
			resolve(params);
		}catch(err){
			params.message = err
			params.status = 403
			params.code = "0003"
			reject(params);
		}
	});
}
module.exports = {
	createToken,
	decodeToken
}