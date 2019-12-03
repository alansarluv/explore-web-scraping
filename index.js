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

async function main() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(
    "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/pen/sof"
  );
  const html = await page.content();
  const $ = cheerio.load(html);
  const results = $(".result-info")
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
console.log(results);
};


main();