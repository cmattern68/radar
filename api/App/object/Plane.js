'use strict';
module.exports  = (object) => {
	return {
		icao24: object[0],
		callsign: object[1],
		origin_country: object[2],
		time_position: object[3],
		last_contact: object[4],
		lon: object[5],
		lat: object[6],
		baro_alt: object[7],
		on_ground: object[8],
		velocity: object[9],
		true_track: object[10],
		vertical_rate: object[11],
		sensors: object[12],
		geo_altitude: object[13],
		squawk: object[14],
		spi: object[15],
		position_source: object[16]
	};
};