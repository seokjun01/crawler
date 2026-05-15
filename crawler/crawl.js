const { chromium } = require('playwright');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 크롤링할 Kakao Place URL을 여기에 입력
const TARGET_URL = 'https://place.map.kakao.com/11674834#menuInfo';

async function crawlKakaoMenu(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`크롤링 중: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const menuExists = await page.$('.wrap_goods');
  if (!menuExists) {
    console.error('메뉴 정보를 찾을 수 없습니다. (.wrap_goods 없음)');
    await browser.close();
    return [];
  }

  const menus = await page.$$eval('.wrap_goods .list_goods > li', items =>
    items.map(li => {
      const name = li.querySelector('.tit_item')?.innerText?.trim() ?? '';
      const price = li.querySelector('.desc_item')?.innerText?.trim() ?? '';
      const description = li.querySelector('.desc_item2')?.innerText?.trim() ?? '';
      const tags = [...li.querySelectorAll('.recomm_badge .badge_label')]
        .map(b => b.innerText.trim())
        .join(', ');
      const isAiRecommended = !!li.querySelector('.bdg_round');

      return { 메뉴명: name, 가격: price, 설명: description, AI추천태그: tags, AI추천여부: isAiRecommended ? 'Y' : 'N' };
    })
  );

  await browser.close();
  return menus;
}

function saveToJson(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  console.log(`JSON 저장 완료: ${filename}`);
}

function saveToExcel(data, filename) {
  const ws = XLSX.utils.json_to_sheet(data);

  // 컬럼 너비 자동 조정
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] ?? '').length)) + 2,
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '메뉴');
  XLSX.writeFile(wb, filename);
  console.log(`Excel 저장 완료: ${filename}`);
}

(async () => {
  const menus = await crawlKakaoMenu(TARGET_URL);

  if (menus.length === 0) {
    console.log('추출된 메뉴가 없습니다.');
    return;
  }

  console.log(`\n총 ${menus.length}개 메뉴 추출:`);
  menus.forEach(m => console.log(`  - ${m.메뉴명} / ${m.가격}`));

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  saveToJson(menus, path.join(__dirname, `menu_${timestamp}.json`));
  saveToExcel(menus, path.join(__dirname, `menu_${timestamp}.xlsx`));
})();
