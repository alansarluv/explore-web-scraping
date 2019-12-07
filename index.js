require('dotenv').config();
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const Listing = require("./model/Listing");

async function connectToMongoDb() {
  await mongoose.connect(
    process.env.DB_DETAIL,
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    }
  );
  console.log("connected to mongodb")
}

async function loginPage(page) {
  try {
    const waitforNav = page.waitForNavigation({ waitUntil: 'networkidle0' ,timeout: 5000});
    await page.goto(process.env.TARGETPAGE);
    await page.type("input#uid", process.env.USERN);
    await page.type("input#pwd", process.env.PASS);
    await page.click("#hero .btn-primary");

    await sleep(5000); // 5 second sleep
    await page.click("#onSubmit_noshowft");
    return page;
  } catch (error) {
    console.log(error);
  } 
}

async function getData(page) {
  console.log(await page.evaluate(() => {
    centerPopup('popupBrokerSum');
    loadPopup('popupBrokerSum');
    pop_brokersum_fullmenu();
  }));
}

async function scrapeListing(page) {
  await page.goto(
    "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/pen/sof"
  );
  const html = await page.content();
  const $ = cheerio.load(html);
  const listings = $(".result-info")
    .map((index, element) => {
      const titleElement = $(element).find(".result-title");
      const timeElement = $(element).find(".result-date");
      const hoodElement = $(element).find(".result-hood");
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      const datePosted = new Date($(timeElement).attr("datetime"));
      const hood = $(hoodElement)
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "")
      return { title, url, datePosted, hood };
    }).get();
  return listings;
};

async function scrapeJobDescriptions(listings, page) {
  for (let i = 0; i<listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);
    const jobDescription = $("#postingbody").text();
    const compensation = $("p.attrgroup > span:nth-child(1) > b").text();
    listings[i].jobDescription = jobDescription;
    listings[i].compensation = compensation;

    const listingModel = new Listing(listings[i]);
    listingModel.save();
    await sleep(1000); // 1 second sleep
  }
}

async function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function main() {
  await connectToMongoDb();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const authenticate = await loginPage(page);
  const getTLKMList = await getData(authenticate);
  // const listings = await scrapeListing(page);
  // const listingsWithJobDescriptions = await scrapeJobDescriptions(listings, page);
}


main();
