const geoFile = [
	"./geojson/BLR.geo.json",
	"./geojson/IRN.geo.json",
	"./geojson/LBY.geo.json",
	"./geojson/PRK.geo.json",
	"./geojson/SYR.geo.json",
	"./geojson/YEM.geo.json",
]

drawRestrictedArea = () => {
	return new Promise((resolve, reject) => {
		if (isRestrictedAreaDrawable()) {
			try {
				setLoadingText("Fetching restricted data...");
				geoFile.forEach(file => {
					drawGeojson(file);
				});
				setLoadingText("Restricted data recovery complete.");
				resolve("restricted area ok");
			} catch (e) {
				reject ("error");
			}
		}
	});
}