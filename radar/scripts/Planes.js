let Planes = {};
let PlanesLayers = {};
const planeModal = loadPage("layout/PlanePanel.html");

getPlanes = () => {
	return new Promise((resolve, reject) => {
		try {
			setLoadingText("Connecting to ADS-B Exchange API ...");
			$.get("http://localhost:3030/flights", function(planes, status){
				setLoadingText("Connection to ADS-B Exchange API. Recovering data ...");
				planes.forEach(plane => {
					Planes[plane.callsign] = plane;
					PlanesLayers = addPlaneMarker(plane, false, PlanesLayers);
				});
				setLoadingText("Airplane Data recovery complete.");
				resolve("plane ok");
			});
		} catch (e) {
			reject ("error");
		}
	});
}

showPlanePopup = (callsign) => {
	console.log("callsign " + callsign);
	let tmpModal = planeModal;
	if($(".airport-popup").length !== 0)
		$(".airport-popup").remove();
	if ($(".plane-popup").length !== 0)
		$(".plane-popup").remove();
	tmpModal = tagToText("{{callsign}}", tmpModal, Planes[callsign].callsign);
	tmpModal = tagToText("{{callsign}}", tmpModal, Planes[callsign].callsign);
	tmpModal = tagToText("{{altitude}}", tmpModal, (Planes[callsign].baro_alt === null ? Planes[callsign].geo_altitude : Planes[callsign].baro_alt));
	tmpModal = tagToText("{{speed}}", tmpModal, Planes[callsign].velocity);
	if (Planes[callsign].squawk === 7500 || Planes[callsign].squawk === 7600 || Planes[callsign].squawk === 7700)
		tmpModal = tagToText("{{squawk}}", tmpModal, "<font color='red'>" + Planes[callsign].squawk + "</font>");
	else
		tmpModal = tagToText("{{squawk}}", tmpModal, Planes[callsign].squawk);
	tmpModal = tagToText("{{heading}}", tmpModal, Planes[callsign].true_track);
	tmpModal = tagToText("{{longitude}}", tmpModal, Planes[callsign].lon);
	tmpModal = tagToText("{{latitude}}", tmpModal, Planes[callsign].lat);
	tmpModal = tagToText("{{longitude}}", tmpModal, Planes[callsign].lon);
	tmpModal = tagToText("{{latitude}}", tmpModal, Planes[callsign].lat);
	tmpModal = tagToText("{{vertical_rate}}", tmpModal, Planes[callsign].vertical_rate);
	if (Planes[callsign].position_source === 0)
		tmpModal = tagToText("{{adsb_origin}}", tmpModal, "ADS-B");
	else if (Planes[callsign].position_source === 1)
		tmpModal = tagToText("{{adsb_origin}}", tmpModal, "ASTERIX");
	else if (Planes[callsign].position_source === 2)
		tmpModal = tagToText("{{adsb_origin}}", tmpModal, "MLAT");
	$(".container").append(tmpModal);
}