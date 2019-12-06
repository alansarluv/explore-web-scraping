const puppeteer = require("puppeteer");
const fs = require("fs");

async function getHtml(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto(url);
  const html = await page.content();
  return html;
}

function saveHtmlToFile(html) {
  fs.writeFileSync("./test.html", html);
}

async function main() {
  const html = await getHtml("https://sfbay.craigslist.org/d/software-qa-dba-etc/search/pen/sof")
  saveHtmlToFile(html);

}

main();