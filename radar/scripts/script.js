$(document).ready(function() {
	pollEvent();
});

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

init = () => {
	$('.olControlAttribution').remove();
	$('.olControlZoom').remove();
	getAirports();
}