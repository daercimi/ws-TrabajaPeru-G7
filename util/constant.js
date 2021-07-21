'use strict'

const ResponseCode = {
	error : 'ERROR',
	success : 'SUCCESS'
}

function generateresponse(params){
	const Responsegenerated = {
		status : params.status,
		message : params.message
	}
}

module.exports = {
	ResponseCode
}