'use strict'

const ResponseCode = {
	error : 'ERROR',
	success : 'SUCCESS'
}

function generateresponse(params){
	return {
		status : params.status,
		message : params.message
	}
}

module.exports = {
	ResponseCode,
	generateresponse
}