const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const scrapingResults = [
  {
    title: "Software Engineer, Core Technology",
    datePosted: new Date("2019-07-26 12:00:00"),
    neighborhood: "(san mateo)",
    url: "https://sfbay.craigslist.org/pen/sof/d/san-mateo-software-engineer-core/7024001832.html",
    jobDescription: "IXL Learning, a leading edtech company with products used by 8 million students worldwide, is seeking Software Engineers who have a passion for technology and...",
    compensation: "Competitive salary and benefits",

  }
]

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
    listings[i].jobDescription = jobDescription;
    await sleep(1000); // 1 second sleep

    console.log(listings[i].jobDescription);
  }
}

async function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function main() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const listings = await scrapeListing(page);
  const listingsWithJobDescriptions = await scrapeJobDescriptions(listings, page);
  // console.log(listings);
}


main();