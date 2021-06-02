const validationResult = require('express-validator').validationResult;
const axios = require('axios');
const Airport = require("../object/Airport");
const CircularJSON = require('circular-json');

exports.getMetar = async (req, res) =>
{
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(200).json({ err: errors.array()[0].msg });
	axios.get('https://avwx.rest/api/metar/'+ req.params.icao + "?format=json", {
		headers: {
			Authorization: "Token 1swb-uwt2V_UOcB6jKS7mJdlAAwOmRdtWRcHPGiH2Dk"
		}
	}).then(response => {
		return res.status(200).json(response.data);
	}).catch(error => {
		console.log(error)
		return res.status(200).json({ err: error });
	});
}

exports.getTaf = async (req, res) =>
{
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(200).json({ err: errors.array()[0].msg });
	axios.get('https://avwx.rest/api/taf/'+ req.params.icao + "?format=json", {
		headers: {
			Authorization: "Token 1swb-uwt2V_UOcB6jKS7mJdlAAwOmRdtWRcHPGiH2Dk"
		}
	}).then(response => {
		return res.status(200).json(response.data);
	}).catch(error => {
		console.log(error)
		return res.status(200).json({ err: error });
	});
}