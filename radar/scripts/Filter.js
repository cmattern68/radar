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