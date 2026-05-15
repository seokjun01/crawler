const express = require("express");
const { getMenuByPlaceId, closeBrowser } = require("./menuCrawler");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/api/menu/:placeId", async (req, res) => {
  const { placeId } = req.params;

  if (!/^\d+$/.test(placeId)) {
    return res.status(400).json({ error: "invalid placeId" });
  }

  try {
    const { placeName, menus } = await getMenuByPlaceId(placeId);
    res.json({
      placeId,
      placeName,
      menus,
      menusJson: JSON.stringify(menus),
    });
  } catch (err) {
    console.error(`[crawler] placeId=${placeId}`, err.message);
    res.status(500).json({ error: "crawl failed" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Crawler service running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await closeBrowser();
  server.close();
});
