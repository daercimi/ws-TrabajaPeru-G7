'use strict'

const ResponseCode = {
	error : 'ERROR',
	success : 'SUCCESS'
}

function generateresponse(params){
	return Responsegenerated = {
		status : params.status,
		message : params.message
	}
}

module.exports = {
	ResponseCode,
	generateresponse
}