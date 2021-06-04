let restrictedLayer = [];
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

const planeIcon = new OpenLayers.Icon('./img/plane.png', airportSize, airportOffset);

disableIf = (Layer) => {
	console.log(disableIf());
	if (isAirportDrawable())
		Layer.display(true);
	else
		Layer.display(false);
}

addAirportMarker = (Airport, registerLayer, airportsLayer) => {
	if (isAirportDrawable()) {
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
}

addPlaneMarker = (Plane, registerLayer, planesLayer) => {
	if (Plane.callsign.length < 3)
		console.log(Plane.callsign)
	let Layer = new OpenLayers.Layer.Markers(Plane.callsign + "_Layer");
	map.addLayer(Layer);
	const icon = planeIcon.clone();
	const heading = Math.floor(Plane.true_track) - 45;
	const planeMarker = new OpenLayers.Marker(new OpenLayers.LonLat(Plane.lon, Plane.lat).transform('EPSG:4326', 'EPSG:3857'), icon);
	planeMarker.id = Plane.callsign;
	planeMarker.icon.imageDiv.setAttribute("id", "plane_pin");
	planeMarker.icon.imageDiv.setAttribute("class", Plane.callsign);
	planeMarker.icon.imageDiv.setAttribute("title", Plane.callsign);
	planeMarker.icon.imageDiv.setAttribute("style", "cursor: pointer; transform: rotate(" + heading + "deg);")
	Layer.addMarker(planeMarker);
	Layer.events.register('click', Plane, clickPlaneMarker)
	if (!isPlaneDrawable())
		Layer.display(false);
	if (registerLayer === true) {
		countryAirport[Plane.callsign] = Layer;
	}
	if (planesLayer !== null) {
		planesLayer[Plane.callsign] = Layer;
		return planesLayer;
	}
}

clickAirportMarker = (object) => {
	showPopup((object.object.name).split("_")[0]);
}

clickPlaneMarker = (object) => {
	console.log("click");
	showPlanePopup((object.object.name).split("_")[0]);
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
	//console.log("remove");
	if (Object.keys(countryAirport).length > 0) {
		for (let [key, value] of Object.entries(countryAirport)) {
			//console.log(value);
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

drawGeojson = (path) => {
	const vector = new OpenLayers.Layer.Vector("GeoJSON", {
		projection: "EPSG:4326",
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP({
			url: path,
			format: new OpenLayers.Format.GeoJSON()
		})
	});
	let style = {
		strokeWidth: 2,
		strokeColor: '#c0392b',
		fillColor: '#c0392b',
		fillOpacity: 0.5
	};
	vector.style = style;
	map.addLayer(vector);
	restrictedLayer.push(vector);
}

resetZoom = () => {
	map.setCenter(new OpenLayers.LonLat("0", "0").transform('EPSG:4326', 'EPSG:3857'), 3);
}

map.events.register('zoomend', map, loadCountryAirport);
map.events.register('moveend', map, verifyCountryAirport);

map.events.register('zoomend', map, restrictedCheck);
map.events.register('moveend', map, restrictedCheck);

map.events.register('zoomend', map, airportCheck);
map.events.register('moveend', map, airportCheck);

map.events.register('zoomend', map, planeCheck);
map.events.register('moveend', map, planeCheck);