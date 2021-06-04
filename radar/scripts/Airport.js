let Airports = {};
let AirportsLayers = {};
const modal = loadPage("layout/AirportPanel.html");

getAirports = () => {
	return new Promise((resolve, reject) => {
		try {
			setLoadingText("Connecting to Airport DataHub ...");
			$.get("http://localhost:3030/airports", function(airports, status){
				setLoadingText("Connection to Airport DataHub established. Recovering data ...");
				airports.forEach(airport => {
					Airports[airport.icao] = airport;
					AirportsLayers = addAirportMarker(airport, false, AirportsLayers);
				});
				setLoadingText("Airport Data recovery complete.");
				resolve("airport ok");
			});
		} catch (e) {
			reject ("error");
		}
	});
}

setMetar = (Metar) => {
	$('.altimeter').html(tagToText("{{altimeter}}", $('.altimeter').text(), Metar.altimeter.value));
	$('.altimeter').html(tagToText("{{altimeter_unit}}", $('.altimeter').text(), Metar.units.altimeter));
	$('.temperature').html(tagToText("{{temperature}}", $('.temperature').text(), Metar.temperature.value));
	if (Metar.wind_direction.value === null) {
		$('.img-wind-arrow').attr('src', 'img/vrb.png');
		$('.wind-token').html(tagToText("{{direction}}", $('.wind-token').text(), "VRB"));
	} else {
		$('.img-wind-arrow').css('transform', 'rotate(' + Metar.wind_direction.value + 'deg)');
		$('.wind-token').html(tagToText("{{direction}}", $('.wind-token').text(), (Metar.wind_direction.value < 100 ? "0" : "") + Metar.wind_direction.value + "°"));
	}
	$('.wind-token').html(tagToText("{{speed}}", $('.wind-token').text(), Metar.wind_speed.value));
	$('.metar-token').html(tagToText("{{metar}}", $('.metar-token').text(), Metar.sanitized));
	$(".metar-hidden").show();
	$(".metar-loading").hide();
}

showPopup = (icao) => {
	const arpList = {...Airports, ...arpCtr};
	if (arpList[icao] !== undefined) {
		let tmpModal = modal;
		if($(".airport-popup").length !== 0)
			$(".airport-popup").remove();
		if ($(".plane-popup").length !== 0)
			$(".plane-popup").remove();
		tmpModal = tagToText("{{airport}}", tmpModal, arpList[icao].name);
		tmpModal = tagToText("{{icao}}", tmpModal, arpList[icao].icao);
		tmpModal = tagToText("{{elevation}}", tmpModal, arpList[icao].elevation);
		tmpModal = tagToText("{{country}}", tmpModal, arpList[icao].country);
		tmpModal = tagToText("{{municipality}}", tmpModal, arpList[icao].municipality);
		tmpModal = tagToText("{{longitude}}", tmpModal, arpList[icao].lon);
		tmpModal = tagToText("{{latitude}}", tmpModal, arpList[icao].lat);
		tmpModal = tagToText("{{longitude}}", tmpModal, + arpList[icao].lon);
		tmpModal = tagToText("{{latitude}}", tmpModal, + arpList[icao].lat);
		tmpModal = tagToText("{{atc_href}}", tmpModal, "https://liveatc.net/search/?icao=" + arpList[icao].icao);
		tmpModal = tagToText("{{live_atc}}", tmpModal, "https://liveatc.net/search/?icao=" + arpList[icao].icao);
		$(".container").append(tmpModal);
		$(".metar-hidden").hide();
		$(".taf-hidden").hide();
		$.get("http://localhost:3030/weather/metar/" + icao, function(Metar, status){
			$.get("http://localhost:3030/weather/taf/" + icao, function(Taf, status){
				if (Metar.err !== undefined || Taf.err !== undefined) {
					$('.metar-token').html("No data to show.");
					$('.taf-token').html("No data to show.");
				} else {
					setMetar(Metar);
					$('.taf-token').html(tagToText("{{taf}}", $('.taf-token').text(), Taf.sanitized));
				}
				$(".taf-hidden").show();
				$(".taf-loading").hide();
			});
		});
	}
}