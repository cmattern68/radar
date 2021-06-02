const validationResult = require('express-validator').validationResult;
const axios = require('axios');
const Airport = require("../object/Airport");
const csv = require('csv-string');

exports.getAirports = async (req, res) =>
{
	axios.get('https://raw.githubusercontent.com/datasets/airport-codes/master/data/airport-codes.csv').then(response => {
		const arr = csv.parse(response.data);
		let Airports = [];
		arr.forEach(airport => {
			if (airport[1] === "large_airport") {
				Airports.push(Airport(airport));
			}
		});
		return res.status(200).json(Airports);
	}).catch(error => {
		return res.status(200).json({ msg: "No results." });
	});
}

exports.getCountryAirports = async (req, res) =>
{
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(200).json({ err: errors.array()[0].msg });
	axios.get('https://raw.githubusercontent.com/datasets/airport-codes/master/data/airport-codes.csv').then(response => {
		const arr = csv.parse(response.data);
		let Airports = [];
		arr.forEach(airport => {
			if ((airport[1] === "large_airport" || airport[1] === "medium_airport") && airport[5] === req.params.country) {
				Airports.push(Airport(airport));
			}
		});
		return res.status(200).json(Airports);
	}).catch(error => {
		return res.status(200).json({ msg: "No results." });
	});
}