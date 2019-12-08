const request = require("request-promise");
const fs = require("fs");

async function main() {
  try {
    const html = await request.post(process.env.CLSAMPLEURL, {
      form: {
        inputEmailHandle: process.env.CLUSER,
        inputPassword: process.env.CLPASS
      },
      headers: {
        Referer: process.env.CLSAMPLEURL
      },
      simple: false,
      followAllRedirects: true
    });
    fs.writeFileSync("./login.html", html);
  }
  catch(err) {
    console.log(err);
  }
}

main();
