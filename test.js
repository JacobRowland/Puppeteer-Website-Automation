const faker = require('faker');
const puppeteer = require('puppeteer');
const { get } = require('http');
const jestConfig = require('./jest.config');
const { start } = require('repl');
const { execFile } = require('child_process');
let browser
let page
var newRole = `header[class*='list-content-left-header'] > div:nth-of-type(2) > button:nth-of-type(2)`;

const user = {
  roleId: faker.random.uuid()
};

const id = user.roleId

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    waitForNavigation: ["domcontentloaded", "networkidle0"],
    waitForAction: 500,
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    defaultViewport: null,
    args: ['--window-size=1920,1080']
  })

  page = await browser.newPage()
  //   VIEWPORT = { width: 1920, height: 1080 };
})



describe('Roles Function', () => {
  jest.setTimeout(30000)
  beforeEach(async () => {
    await page.goto('https://dev.curlywurly.me', { waitUntil: 'networkidle0' });
    await page.type('input[name=Email]', 'Username', { delay: 5 });
    await page.type('input[name=Password]', 'Password', { delay: 5 });
    await page.click('#loginForm > button', { waitUntil: 'networkidle0' });
    await page.waitFor(3000)
    await page.click('#mainMenu > .nav > ul > li > .users-link')
    await page.waitFor(3000)
    await page.waitForSelector('#tab-l1-3');
    await page.click('#tab-l1-3', { delay: 500 });

  });

  test('A Role Can Be Added"', async () => {
    await page.$eval(`header[class*='list-content-left-header'] > div:nth-of-type(2) > button:nth-of-type(2)`, el => el.click())
    await page.waitFor(500)
    await page.type(`input[id='displayNameInput']`, id)
    await page.waitFor(500)
    await page.click('label[for="permission-toggle-860350d4-4dd8-499a-a56b-939c2cf28246"]');
    await page.waitFor(500)
    await page.click('button[id=saveRoleButton]')
  })

  test('A Role Can Be Edited"', async () => {
    const role = "New Role" + id
    await page.waitFor(500);
    const handle = await page.$x("//button[contains(.,'" + role + "')]");
    if (handle.length > 0) {
      await handle[0].click(),
        await page.waitFor(500);
      await page.waitForSelector('label[for="permission-toggle-4a180aad-5ae6-47bc-8f97-e0dff3f5dbb5"]')
      await page.click('label[for="permission-toggle-4a180aad-5ae6-47bc-8f97-e0dff3f5dbb5"]')
      await page.waitFor(500)
      await page.click('button[id=saveRoleButton]')
    }
  })

  test('A Role Can Be Deleted"', async () => {
    const role = "New Role" + id
    await page.waitFor(500);
    const handle = await page.$x("//button[contains(.,'" + role + "')]");
    if (handle.length > 0) {
      await handle[0].click(),
        await page.waitFor(1000);
      await page.waitForSelector('[class="list-item-delete-button tooltip-title"]')
      await page.waitFor(500)
      await page.click('[class="list-item-delete-button tooltip-title"]')
      await page.waitFor(500)
      await page.waitForSelector('#deleteRoleConfirmSave')
      await page.waitFor(500)
      await page.click('#deleteRoleConfirmSave')
    }
  })

  afterEach(async () => {
    await page.waitFor(500)
    await page.click('button[id=accountPopupToggle]')
    await page.waitFor(500)
    await page.$eval('#accountPopup > ul > li:nth-child(1) > a', el => el.click())
    await browser.close()
  }



  )

})
// afterAll(async () => {
//   await browser.close()
// })