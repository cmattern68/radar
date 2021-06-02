let arpCtr = {};
let countryAirport = {};
let loadedCountry = "";
let map = new OpenLayers.Map({
	div: "map",
	layers: [
		new OpenLayers.Layer.OSM("OSM (without buffer)"),
		new OpenLayers.Layer.OSM("OSM (with buffer)", null, {buffer: 2})
	],
	eventListeners: {
		"click": closeAirportPanel,
	},
	center: [0, 0],
	zoom: 3
});

const airportSize = new OpenLayers.Size(16,16);
const airportOffset = new OpenLayers.Pixel(-(airportSize.w/2), -airportSize.h);
const airportIcon = new OpenLayers.Icon('./img/airport.png', airportSize, airportOffset);

addAirportMarker = (Airport, registerLayer, airportsLayer) => {
	let Layer = new OpenLayers.Layer.Markers(Airport.icao + "_Layer");
	map.addLayer(Layer);
	const icon = airportIcon.clone();
	const airportMarker = new OpenLayers.Marker(new OpenLayers.LonLat(Airport.lon, Airport.lat).transform('EPSG:4326', 'EPSG:3857'), icon);
	airportMarker.id = Airport.icao;
	airportMarker.icon.imageDiv.setAttribute("id", "airport_pin");
	airportMarker.icon.imageDiv.setAttribute("class", Airport.icao);
	airportMarker.icon.imageDiv.setAttribute("title", Airport.icao);
	airportMarker.icon.imageDiv.setAttribute("style", "cursor: pointer;")
	Layer.addMarker(airportMarker);
	Layer.events.register('click', Airport, clickAirportMarker)
	if (registerLayer === true) {
		countryAirport[Airport.icao] = Layer;
	}
	if (airportsLayer !== null) {
		airportsLayer[Airport.icao] = Layer;
		return airportsLayer;
	}
}

clickAirportMarker = (object) => {
	showPopup((object.object.name).split("_")[0]);
}

zoomOnPos = (lon, lat, level) => {
	map.setCenter(new OpenLayers.LonLat(lon, lat).transform('EPSG:4326', 'EPSG:3857'), level);
}

getCountryFromPos = (lon, lat) => {
	$.get("http://localhost:3030/coordinate/" + lon + "/" + lat, function(country, status){
		return country;
	});
}

removeOldAirportPin = () => {
	if (Object.keys(countryAirport).length > 0) {
		for (let [key, value] of Object.entries(countryAirport)) {
			value.destroy();
		}
	}
	loadedCountry = "";
	countryAirport = {};
}

addNewAirportPin = (country) => {
	$.get("http://localhost:3030/airports/country/" + country.countryCode, function(airports, status){
		if (loadedCountry !== country.countryCode) {
			loadedCountry = country.countryCode;
			countryAirport = {};
			airports.forEach(airport => {
				if (airport.type === "medium_airport") {
					arpCtr[airport.icao] = airport;
					addAirportMarker(airport, true, null);
				}
			})
		}
	});
}

loadCountryAirport = () => {
	if (map.zoom >= 6) {
		const pos = (map.getCenter()).transform('EPSG:3857', 'EPSG:4326');
		$.get("http://localhost:3030/coordinate/" + pos.lon + "/" + pos.lat, function(country, status){
			if (country.countryCode !== undefined) {
				addNewAirportPin(country);
			}
		});
	} else {
		removeOldAirportPin();
	}
}

verifyCountryAirport = () => {
	if (map.zoom >= 6) {
		const pos = (map.getCenter()).transform('EPSG:3857', 'EPSG:4326');
		$.get("http://localhost:3030/coordinate/" + pos.lon + "/" + pos.lat, function(country, status){
			if (country.countryCode !== undefined && loadedCountry !== "" && loadedCountry !== country.countryCode) {
				removeOldAirportPin();
				addNewAirportPin(country);
			}
		});
	}
}

map.events.register('zoomend', map, loadCountryAirport);
map.events.register('moveend', map, verifyCountryAirport);