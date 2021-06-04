//const validationResult = require('express-validator').validationResult;
const axios = require('axios');
const Plane = require("../object/Plane");

exports.getFlights = async (req, res) =>
{
	axios.get('https://opensky-network.org/api/states/all').then(response => {
		const callsign = [];
		const flight = [];
		let maxLastContact = new Date()
		maxLastContact.setMinutes(maxLastContact.getMinutes() - 2);
		maxLastContact =  Math.floor(maxLastContact.getTime() / 1000);
		for (let [key, value] of Object.entries(response.data.states)){
			if (value[1] !== null && value[3] !== null && value[5] !== null && value[6] !== null
				&& (value[7] !== null || value[13] === null) && value[8] !== true && value[9] !== null
				&& value[10] !== null && value[14] !== null && value[3] > maxLastContact && (value[1].trim()).length >= 3
				&& value[1].trim() !== "00000000" && !callsign.includes(value[1].trim())) {
				flight.push(Plane(value));
				callsign.push(value[1].trim())
			}
		}
		return res.status(200).json(flight);
	}).catch(error => {
		return res.status(200).json({ msg: "No results." });
	});
}