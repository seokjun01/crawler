const { chromium } = require("playwright");

let browser = null;

async function getBrowser() {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

async function getMenuByPlaceId(placeId) {
  const url = `https://place.map.kakao.com/${placeId}#menuInfo`;
  const b = await getBrowser();
  const page = await b.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // place_name 추출
    const placeName = await page
      .$eval(".tit_place", (el) => el.innerText.trim())
      .catch(() => "");

    const menuExists = await page.$(".wrap_goods");
    if (!menuExists) return { placeName, menus: [] };

    const menus = await page.$$eval(".wrap_goods .list_goods > li", (items) =>
      items.map((li) => ({
        name: li.querySelector(".tit_item")?.innerText?.trim() ?? "",
        price: (() => {
          const raw = li.querySelector(".desc_item")?.innerText?.trim() ?? "";
          const num = raw.replace(/[^0-9]/g, "");
          return num ? parseInt(num) : null;
        })(),
        description: li.querySelector(".desc_item2")?.innerText?.trim() ?? "",
        tags: [...li.querySelectorAll(".recomm_badge .badge_label")].map((b) =>
          b.innerText.trim(),
        ),
        aiRecommended: !!li.querySelector(".bdg_round"),
      })),
    );

    return { placeName, menus };
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (browser) await browser.close();
}

module.exports = { getMenuByPlaceId, closeBrowser };
