import puppeteer from "puppeteer";
// const puppeteer = require("puppeteer");

const initBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  return browser;
};

(async () => {
  const browser = await initBrowser();
  // page 인스턴스 생성.
  const page = await browser.newPage();

  const pageUrl = "https://medium.com/tag/react/recommended/";
  await page.goto(pageUrl);

  const getArticles = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      "article h2, article h3, article div.h > img, article div.l > img, article div.ff.fg.hj.hk.hl.ab > div:nth-child(2) > div > div > a > p, article div.l.er.ib > a:nth-child(1)",
    );
    // const titleEl = document.querySelectorAll("article h2");
    // const descriptionEl = document.querySelectorAll("article h3");
    // const mainImg = document.querySelectorAll("article div.h > img");
    // const avatarImg = document.querySelectorAll("article div.l > img");
    // const editorEl = document.querySelectorAll("article div.ff.fg.hj.hk.hl.ab > div:nth-child(2) > div > div > a > p");
    // const linkEl = document.querySelectorAll("article div.l.er.ib > a:nth-child(1)");

    // console.log('editorEl: ', editorEl);
    console.log("elements: ", elements);

    const articles = [];
    let obj = {};

    const checkObjKey = (obj, key) => {
      return obj[key] === undefined;
    };

    const resetObj = () => {
      articles.push(obj);
      obj = {};
    };

    const setObjKey = (obj, key, value) => {
      if (checkObjKey(obj, key)) {
        obj[key] = value;
      } else {
        resetObj();
      }
    };

    elements.forEach((el) => {
      // el.nodeName 의 결과가 대문자일줄은...
      switch (el.nodeName) {
        case "H2":
          setObjKey(obj, "title", el.textContent);
          break;
        case "H3":
          setObjKey(obj, "description", el.textContent);
          break;
        case "IMG":
          if (el.className === "l hs bx hn ho ec") {
            setObjKey(obj, "avatarImgUrl", el.src);
          } else {
            // obj.mainImgUrl = el.src;
            setObjKey(obj, "mainImgUrl", el.src);
          }
          break;
        case "P":
          setObjKey(obj, "editor", el.textContent);
          break;
        case "A":
          setObjKey(obj, "link", el.href);
          break;
        default:
          break;
      }
    });

    return articles;
  });

  console.log("getArticles: ", getArticles);
  await browser.close();
})();
