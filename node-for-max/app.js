// grab the max api for getting ins / outs of the object
const Max = require("max-api");

// set up a handler for bang message
Max.addHandler("bang", () => {
	// grab some data
	if(data){
		// need to convert the value to a number 
		const val = Number(data[data_counter].v);
		Max.outlet(val);

		data_counter++;
		if(data_counter >= data.length) {
			data_counter = 0;
		}
	}
});

// use got for retreiving data
const got = require("got");

// url for data: had to rely heavily on this page to understand the url format (https://tidesandcurrents.noaa.gov/api/)
const station_id = "8518750";
const url = `https://tidesandcurrents.noaa.gov/api/datagetter?date=today&station=${station_id}&product=water_level&datum=MSL&units=english&time_zone=lst&format=json`;

// set data to null for now
data = null;
data_counter = 0;

// grab data immediately on start
(async () => {
	try {
		Max.post("grabbing data");
      	const { body } = await got(url, {responseType: 'json'});
		data = body.data;
		Max.post("received data");
	} catch (error) {
		Max.post(error);
	}
})();

