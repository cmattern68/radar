//const validationResult = require('express-validator').validationResult;
const axios = require('axios');
const Plane = require("../object/Plane");

exports.getFlights = async (req, res) =>
{
	axios.get('https://opensky-network.org/api/states/all').then(response => {
		const flight = [];
		for (let [key, value] of Object.entries(response.data.states)){
			if (value[14] !== null && value[8] !== true && (value[7] !== null || value[13] === null))
				flight.push(Plane(value));
		}
		return res.status(200).json(flight);
	}).catch(error => {
		console.log(error)
		return res.status(200).json({ msg: "No results." });
	});
}