// scraping test (right now using axios, but could also use requests or got)

/*

Step 1. Download the website as raw HTML
Step 2. Parse the HTML and grab the info you are looking for
Step 3. Store the info or Do something else with the info

*/

const cheerio = require('cheerio'); // html parse module

// grab the page with axios
const axios = require('axios');
const getPage = async (url) => {
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

// url to scrape
const booksPage = 'http://books.toscrape.com/';

// main program
(async () => {
	let myPage = await getPage(booksPage);
	// console.log(myPage);

	console.log(parseHTML(myPage));

})()
