const parser = require("../parser");
const fs = require("fs")
let html;
let listings;

beforeAll(() => {
  html = fs.readFileSync("./test.html");
  listings = parser.listings(html);
})

it("should give the correct listing object", () => {
  expect(listings.length).toBe(144);
})

it("should give the correct hood", () => {
  expect(listings[0].neighborhood).toBe("(redwood city)");
})

it("should give the correct date", () => {
  expect(listings[0].datePosted).toStrictEqual(new Date("2019-12-05 14:34"));
})

it("should give the correct url", () => {
  expect(listings[0].url).toBe("https://sfbay.craigslist.org/pen/sof/d/redwood-city-senior-software-engineer/7033007594.html");
})

it("should give the correct title", () => {
  expect(listings[0].title).toBe("Senior Software Engineer â Query Optimizer");
})
