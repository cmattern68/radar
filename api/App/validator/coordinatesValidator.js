const param = require('express-validator').param;

exports.validLonLat = [
	param('lon', 'Longitude is invalid.').notEmpty().isFloat({min:-180,max:180}).trim().escape(),
	param('lat', 'Latitude Code is invalid.').notEmpty().isFloat({min:-90,max:90}).trim().escape(),
];