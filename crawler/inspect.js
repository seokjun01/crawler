const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://place.map.kakao.com/11674834#menuInfo", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  await page.waitForTimeout(3000);

  const html = await page
    .$eval(".wrap_goods", (el) => el.outerHTML)
    .catch(() => null);

  if (html) {
    console.log("wrap_goods 찾았땅");
    console.log(html.slice(0, 3000));
  } else {
    console.log("wrap_goods 태그가 없습니다. 페이지 구조를 다시 탐색합니다");
    const bodyText = await page.evaluate(() => {
      const all = [...document.querySelectorAll("[class]")];
      return all
        .map((el) => el.className)
        .filter((c) => c)
        .slice(0, 50)
        .join("\n");
    });
    console.log(bodyText);
  }

  await browser.close();
})();
