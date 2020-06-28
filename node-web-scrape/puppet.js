// Scraping images from Instagram using Puppeteer

/*

Since Instagram loads images dynamically, so we can't grab the image URLs using a simple GET request.

We'll use the Puppeteer to control a chrome browser which lets us fully load and control pages.

Of course there's already a wrapper(actually a lot out there) to handle all this: 
https://github.com/ScriptSmith/instamancer

It's also a nice way to see how Puppeteer works

Note: 

Since Puppeteer is only able to control Chrome, it may be worth looking into 
Playwright: https://github.com/microsoft/playwright which supports multiple browsers.

*/

const puppeteer = require('puppeteer');
const cheerio = require('cheerio'); // we can still make use of cheerio for traversing the DOM
const axios = require('axios'); // using axios to request the img file
const fs = require('fs');

const dotenv = require('dotenv'); // to store our instagram username and pwd
dotenv.config();

let usr = process.env.INSTAGRAM_USERNAME;
let pwd = process.env.INSTAGRAM_PASSWORD;

// download function
const download = (url, destination) => {
    axios({method: "get", url: url, responseType: "stream"})
        .then((response) => {
            response.data.pipe(fs.createWriteStream(destination));
        })
        .catch (error => console.log("Unable to download: " + url));
}

(async () => {
    // launch the browser and create new page
    const browser = await puppeteer.launch({headless:false}); // set headless to false to show the browser (might be nice for visual things)
    const page = await browser.newPage();

    // log in to instagram
    console.log("logging in");
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', usr);
    await page.type('input[name="password"]', pwd);
    await page.click('button[type="submit"]');

    // in some situations, might be necessary to wait for the entire page to load
    await page.waitForNavigation();
    // await page.waitFor(1000); // another option

    // have to click "not now"
    // let content = await page.content();
    // let $ = cheerio.load(content);
    // // console.log($('button:contains("Not Now")').attr('class'));
    // await page.click('button.yWX7d'); // hard coded now, but might need to use Cheerio in future
    // await page.waitForNavigation();

    // another question?
    // await page.click('button.HoLwm');

    console.log("login complete, navigating to profile page");

    await page.goto('https://www.instagram.com/' + usr);

    // you could take a screenshot
    // await page.screenshot({path: 'page.png'});

    console.log("grabbing image urls");

    // try and download an image
    content = await page.content();
    $ = cheerio.load(content);

    // grab the img tags and extract the urls
    const img_elements = $('a div div img');

    // cycle through each element and store the src attribute
    let urls = [];
    img_elements.each((i, element) => {
        urls.push($(element).attr('src'));
    });

    // use each url to download the image
    console.log(`Attempting to download ${urls.length} images`);
    urls.forEach((url, index) => {
        download(url, `imgs/image-${index}.jpg`);
    });

    console.log("done.");


    // What if we also want to grab the location of each post

    // use cheerio to collect the anchor tags of each image 
    // (if we didn't want to use cheerio, we could fall back to: document.querySelector()
    const anchors = $('article a').toArray();

    console.log(`found ${anchors.length} tags`);

    // loop through the locations
    let locations = [];
    for(let i=0; i < anchors.length; i++){
        let anchor = anchors[i];

        await page.goto('https://www.instagram.com/' + $(anchor).attr('href'), { waitUntil: 'load' });
        content = await page.content();
        $ = cheerio.load(content);

        // then search for the location tag
        // from checking the page, the url always starts with "/explore/locations"
        let headers = $('header a');

        if(headers.length > 2 && $(headers[2]).attr('href').includes('/explore/locations')){
            locations.push($(headers[2]).text());
        }
    }

    console.log(locations);
    // save all the locations to a text file
    let file = fs.createWriteStream('locations.txt');

    file.on('error', error => { 
        console.log("problem writing to file: " + error) 
    });

    locations.forEach(loc => { 
        file.write(loc + '\n'); 
    });

    file.end();

    // close the browser when we're done
    await browser.close();
})();




/*
    Instagram also uses the 'srcset' attribute for image sources on the element

        srcset="http://url.com/img.jpg 400w, http://url.com/img-larger.jpg 800w" 

*/

// This function searches for the largest of the images based on the srcset attribute
const getSrcSetURL = (srcset) => {
    
    let url = '';
    let maxWidth = 0;
    let url_width, newWidth;

    srcset.split(',').forEach((item) => {
        url_width = item.trim().split(' ');
        newWidth = parseInt(url_width[1]);
        if(width > maxWidth) {
            maxWidth = newWidth;
            url = url_width[0];
        }
    });

    return url;
}