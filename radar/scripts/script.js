$(document).ready(function() {
	pollEvent();
});


restrictedCheck = () => {
	if ($('.restricted-check').is(':checked')) {
		restrictedLayer.forEach(layer => {
			layer.display(true);
		});
		$('.restricted-label').text('Toggle Restricted Area On');
	} else {
		restrictedLayer.forEach(layer => {
			layer.display(false);
		});
		$('.restricted-label').text('Toggle Restricted Area Off');
	}
}

airportCheck = () => {
	if ($('.airport-check').is(':checked')) {
		for (let [key, layer] of Object.entries(AirportsLayers)) {
			layer.display(true);
		}
		for (let [key, layer] of Object.entries(countryAirport)) {
			layer.display(true);
		}
		$('.airport-label').text('Toggle Airport On');
	} else {
		for (let [key, layer] of Object.entries(AirportsLayers)) {
			layer.display(false);
		}
		for (let [key, layer] of Object.entries(countryAirport)) {
			layer.display(false);
		}
		$('.airport-label').text('Toggle Airport Off');
	}
}

planeCheck = () => {
	if ($('.plane-check').is(':checked')) {
		for (let [key, layer] of Object.entries(PlanesLayers)) {
			layer.display(true);
		}
		$('.plane-label').text('Toggle Plane On');
	} else {
		for (let [key, layer] of Object.entries(PlanesLayers)) {
			layer.display(false);
		}
		$('.plane-label').text('Toggle Plane Off');
	}
}

isRestrictedAreaDrawable = () => {
	if ($('.loading-popup').length === 0)
		return true;
	return $('.restricted-check').is(':checked');
}

isAirportDrawable = () => {
	if ($('.loading-popup').length === 0)
		return true;
	return $('.airport-check').is(':checked');
}

isPlaneDrawable = () => {
	if ($('.loading-popup').length === 0)
		return false;
	return $('.plane-check').is(':checked');
}

tagToText = (tag, text, replace) => {
	return text.replace(tag, replace);
}

loadPage = (href) => {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", href, false);
	xmlhttp.send();
	return xmlhttp.responseText;
}

loading = () => {
	if ($('.loading-popup').length === 0) {
		const page = loadPage("./layout/WaitingPage.html");
		$('body').prepend(page);
	}
}

setLoadingText = (text) => {
	if ($('.loading-popup').length > 0) {
		$('.loading-element').text(text);
	}
}

loaded = () => {
	if ($('.loading-popup').length > 0) {
		$('.loading-popup').remove()
	}
}

loadedError = () => {
	if ($('.loading-popup').length > 0) {
		$('.loading-spinner').remove()
	}
}

init = () => {
	$('.olControlAttribution').remove();
	$('.olControlZoom').remove();
	loading();
	loadFilter().then(() => {
		setTime().then(() => {
			drawRestrictedArea().then(() => {
				getAirports().then(() => {
					loaded();
					/*getPlanes().then(() => {
						loaded();
					}).catch(() => {
						setLoadingText("An error occured, please try again later.");
						loadedError();
					});*/
				}).catch(() => {
					setLoadingText("An error occured, please try again later.");
					loadedError();
				});
			}).catch(() => {
				setLoadingText("An error occured, please try again later.");
				loadedError();
			});
		}).catch((err) => {
			setLoadingText("An error occured, please try again later.");
			loadedError();
		});
	}).catch(() => {
		setLoadingText("An error occured, please try again later.");
		loadedError();
	})
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}