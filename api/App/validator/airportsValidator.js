const param = require('express-validator').param;

exports.validCode = [
	param('country', 'Country Code is invalid.').notEmpty().isString().isLength({min: 2, max: 2}).isUppercase().trim().escape(),
];