// scraping test (right now using axios, but could also use requests or got)

/*

Step 1. Download the website as raw HTML
Step 2. Parse the HTML and grab the info you are looking for
Step 3. Store the info or Do something else with the info

*/

const axios = require('axios'); // request module
const cheerio = require('cheerio'); // html parse module

// url to scrape
const url = 'http://books.toscrape.com/';


// grab the page with axios
const getPage = async () => {
	try {
		const page = await axios(url);
		return page.data;
	} catch (error) {
		console.error(error);
	}
}

// Example using 'got' module
// const got = require('got');

// const getPage = async () => {
// 	try {
// 	  const { body } = await got(url);
// 	  return body;
// 	} catch (error) {
// 		console.log('error:', error);
// 	}
// }


// parse the html with cheerio
const parseHTML = (html) => {
	// load page into cheerio
	const $ = cheerio.load(html);
	
	// look for class 'product_pod' with h3 tag and an anchor inside
	const titles = $('.product_pod h3 a');

	// add the text of each title to an array
	const results = [];
	titles.each( (i, element) => {
		results.push($(element).text()) 
	});

	return results;
}


// main program
(async () => {
	const myPage = await getPage();
	console.log(parseHTML(myPage));
})()
