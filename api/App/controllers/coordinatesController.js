const validationResult = require('express-validator').validationResult;
const axios = require('axios');

exports.getCountry = async (req, res) =>
{
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(200).json({ err: errors.array()[0].msg });
	axios.get('http://api.geonames.org/countryCodeJSON?lat=' + req.params.lat + '&lng=' + req.params.lon + '&username=blackwidou671').then(response => {
		return res.status(200).json(response.data);
	}).catch(error => {
		return res.status(200).json({ msg: "No results." });
	});
}