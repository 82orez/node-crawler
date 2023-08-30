import puppeteer from "puppeteer";
// const puppeteer = require("puppeteer");

const initBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  return browser;
};

const main = async () => {
  const browser = await initBrowser();
  // page 인스턴스 생성.
  const page = await browser.newPage();

  const pageUrl = "https://www.saucedemo.com/";
  await page.goto(pageUrl);

  await page.type("#user-name", "standard_user");
  await page.type("#password", "secret_sauce");
  await page.click("#login-button");

  const productNames = await page.evaluate(() => {
    let pNames = [];
    const elements = document.querySelectorAll(".inventory_item_name");
    elements.forEach((el) => {
      pNames.push(el.textContent);
    });
    return pNames;
  });

  console.log(productNames);
  await browser.close();

  return "OK";
};

main().then(console.log);
