const timeModal = loadPage("layout/TimePanel.html");
const month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

setTimeText = () => {
	let dateTime = new Date();
	const time = (dateTime.getUTCHours() < 10 ? "0" : "") + dateTime.getUTCHours() + (dateTime.getUTCMinutes() < 10 ? ":0" : ":") + dateTime.getUTCMinutes() + (dateTime.getUTCSeconds() < 10 ? ":0" : ":") + dateTime.getUTCSeconds();
	const date = dateTime.getUTCDate() + " " + month[dateTime.getUTCMonth()] + " " + dateTime.getUTCFullYear();
	$('.time-txt').text(time);
	$('.date-txt').text(date);
}

setTime = () => {
	return new Promise((resolve, reject) => {
		if ($('.loading-popup').length > 0) {
			$(".loading-popup").after(timeModal);
		} else {
			$(".container").append(timeModal);
		}
		setInterval(setTimeText, 1000);
		resolve("ok");
	});
}