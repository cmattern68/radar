'use strict';
module.exports  = (object) => {
	return {
		icao24: object[0].trim(),
		callsign: object[1].trim(),
		origin_country: object[2].trim(),
		time_position: object[3],
		last_contact: object[4],
		lon: object[5],
		lat: object[6],
		baro_alt: Math.floor(object[7]),
		on_ground: object[8],
		velocity: Math.floor(object[9]),
		true_track: Math.floor(object[10]),
		vertical_rate: Math.floor(object[11]),
		sensors: object[12],
		geo_altitude: Math.floor(object[13]),
		squawk: object[14].trim(),
		spi: object[15],
		position_source: object[16]
	};
};