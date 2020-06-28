// Basic Web Scrape using Axios (or Got) and Cheerio

/*

Step 1. Download the website as raw HTML
Step 2. Parse the HTML and grab the info you are looking for
Step 3. Store the info or Do something else with the info

*/

const axios = require('axios'); // grab the page with axios
const cheerio = require('cheerio'); // html parse module
const fs = require('fs');

// function for retrieving the page 
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

const writeToFile = (dataArray, fileName) => {
	const stringToWrite = dataArray.join();
	fs.writeFile(fileName, stringToWrite, err => {
		if (err) {
			return console.log(err);
		}

		console.log('file written!');
	});
}

// url to scrape
const booksPage = 'http://books.toscrape.com/';

// main program
(async () => {
	//grab the page to parse
	let myPage = await getPage(booksPage);
	console.log(myPage);

	// pass the page the parsing function
	const titles = parseHTML(myPage);
	console.log(titles);
	
	// write to file
})()
