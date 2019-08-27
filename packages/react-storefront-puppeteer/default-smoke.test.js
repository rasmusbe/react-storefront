/**
 * This is the default smoke test run by Apollo when the Moovweb XDN Github app is not
 * installed, or the app does not have a `ci:smoke` script in package.json.
 *
 * We rely on elements with `data-th` attributes to guide the selenium test script through the
 * shopping flow.
 *
 * The hostname of the app to be tested is specified in the required environment variable `RSF_HOST`.
 */

const { createBrowser, createPage } = require('./index')

const startURL = process.env.RSF_URL
const sleepBetweenPages = process.env.RSF_SLEEP_BETWEEN_PAGES || 2000
const headless = process.env.RSF_HEADLESS || 'true'

if (!startURL) {
  console.error(
    'You must set the RSF_URL environment variable to the URL of the app you want to test.'
  )
  console.error('Example: export RSF_URL="https://myapp.moovweb.cloud"')
  process.exit(1)
}

describe('smoke tests', () => {
  jest.setTimeout(30000)
  // let driver
  let browser
  let page

  beforeAll(async () => {
    browser = await createBrowser({ headless })
    page = await createPage(browser)
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    await page.waitFor(sleepBetweenPages)
  })

  it('Navigate to landing page', async () => {
    await page.goto(startURL)
  })

  it('Navigate to category', async () => {
    await clickElement(page, '[data-th="topNavClicked"]')
  })

  it('Navigate to subcategory', async function() {
    const subcategories = await page.$x('//a[contains(@href, "s/1")]')
    await subcategories[0].click()
  })

  it('Navigate to product', async function() {
    const products = await page.$x('//a[contains(@href, "p/1")]')
    await products[0].click()
  })

  it('Add product to cart ', async function() {
    const addToCartElement = await page.$x('//span[contains(text(), "Add to Cart")]')
    await addToCartElement[0].click()
  })

  it('Navigate to cart', async function() {
    const cartBtn = await page.$x('//button[@aria-label="Cart"]')
    await cartBtn[0].click()
  })

  it('Verify product in cart', async function() {
    const products = await page.$x('//a[contains(@href, "p/1")]')
    expect(products.length).toBeTruthy()
  })

  it('Navigate to checkout', async function() {
    const checkoutElement = await page.$x('//span[contains(text(), "Checkout")]')
    await checkoutElement[0].click()
  })
})
