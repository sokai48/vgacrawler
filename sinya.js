const puppeteer = require('puppeteer');
const random_useragent = require('random-useragent');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  while (true) { // 一直爬取，直到手動停止程式
    const userAgent = random_useragent.getRandom(); // 隨機選擇一個使用者代理
    await page.setUserAgent(userAgent); // 設定使用者代
    //await page.goto('https://www.sinya.com.tw/prod/162569');
	await page.goto('https://www.sinya.com.tw/prod/185201'); 

    // 等待網頁加載完成
    await page.waitForSelector('#prod_amount', { timeout: 60000 });

    const buyCount = await page.$('#prod_amount'); // 取得購買數量元素
    const productName = await page.$eval('#prodDetails > div.row.prodRow > div > div.prodIntroduction.row > div.col-md-8.col-xs-12.prodIntroductionText > h1', node => node.innerText); // 取得商品名稱
	const lastOption = await page.$eval('#prod_amount > option:last-of-type', node => node.value);
	//console.log(`商品庫存數量上限：${lastOption}`);

    // 判斷是否有庫存
    if (buyCount && await buyCount.evaluate(node => parseInt(node.innerText)) > 0) {
      const stockCount = await buyCount.evaluate(node => parseInt(node.innerText));
      //console.log(`${productName}有庫存，庫存數量為${lastOption}`);
	  console.log(`${new Date().toLocaleString()} ${productName}有庫存，庫存數量為 :${lastOption}`);
    } else {
      //console.log(`${productName}缺貨中`);
	  console.log(`${new Date().toLocaleString()} ${productName}缺貨中`);
    }

    //await page.waitForTimeout(5 * 60 * 1000); // 等待 5 分鐘後再次爬取
	await page.waitForTimeout(60 * 1000); // 等待 5 分鐘後再次爬取
  }

  await browser.close(); // 關閉瀏覽器
})();