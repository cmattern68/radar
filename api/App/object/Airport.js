'use strict';
module.exports = (array) => {
		return {
			icao: array[0],
			type: array[1],
			name: array[2],
			elevation: array[3],
			continent: array[4],
			country: array[5],
			region: array[6],
			municipality: array[7],
			lat: array[11].split(", ")[0],
			lon: array[11].split(", ")[1]
		};
};