const param = require('express-validator').param;

exports.validIcao = [
	param('icao', 'ICAO Code is invalid.').notEmpty().isString().isLength({min: 4, max: 4}).isUppercase().trim().escape(),
];