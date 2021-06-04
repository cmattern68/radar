const filterModal = loadPage("layout/Filter.html");

loadFilter = () => {
	return new Promise((resolve, reject) => {
		if ($('.loading-popup').length > 0) {
			$(".loading-popup").after(filterModal);
		} else {
			$(".container").append(filterModal);
		}
		resolve("ok");
	});
}

onSearch = () => {
	const searchInput = $('.search-input');
	if (searchInput.length > 0) {
		const searchContent = sanitize(searchInput.val());
		if (searchContent.length === 4) {
			if (Airports[searchContent] !== undefined || arpCtr[searchContent] !== undefined) {
				const airport = (Airports[searchContent] === undefined ? arpCtr[searchContent] : Airports[searchContent]);
				zoomOnPos(airport.lon, airport.lat, 10);
				showPopup(airport.icao);
			} else {
				console.log("No airport for this code.");
			}
		} else {
			console.log("Not ICAO")
		}
	}
}