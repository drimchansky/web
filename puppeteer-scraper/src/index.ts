import puppeteer, { Browser } from 'puppeteer'
const fs = require('fs')

enum ECategory {
    travel = 'Travel',
    mystery = 'Mystery',
    historicalFiction = 'Historical Fiction'
}

type TData = {
    bookTitle: string
    bookPrice: string // currency format
    numAvailable: string
    imageUrl: string
    bookDescription: string
    upc: string
}

class Scraper {
    protected _url: string = 'http://books.toscrape.com'
    protected _browser: Browser
    protected _scrapedData: { [key in ECategory]?: TData } = {}

    async run() {
        await this.startBrowser()
        await this.scrapeAll()
    }

    async startBrowser() {
        this._browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true
        })
    }

    async scrapeAll() {
        try {
            this._scrapedData[ECategory.travel] = await this.scraper(this._browser, ECategory.travel)
            this._scrapedData[ECategory.historicalFiction] = await this.scraper(this._browser, ECategory.historicalFiction)
            this._scrapedData[ECategory.mystery] = await this.scraper(this._browser, ECategory.mystery)

            await this._browser.close()

            fs.writeFile('data.json', JSON.stringify(this._scrapedData), 'utf8', function (err) {
                if (err) {
                    return console.log(err)
                }
                console.log("The data has been scraped and saved successfully! View it at './data.json'")
            })
        } catch (err) {
            console.log('Could not resolve the browser instance => ', err)
        }
    }

    async scraper(browser: Browser, category: string) {
        let page: puppeteer.Page = await this._browser.newPage()
        await page.goto(this._url)

        let selectedCategory = await page.$$eval(
            '.side_categories > ul > li > ul > li > a',
            (links: Array<HTMLLinkElement>, _category) => {
                links = links.map((a) => (a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, '') === _category ? a : null))
                return links.filter((tx) => tx !== null)[0].href
            },
            category
        )

        await page.goto(selectedCategory)
        let scrapedData = []

        async function scrapeCurrentPage() {
            await page.waitForSelector('.page_inner')

            let urls: Array<string> = await page.$$eval('section ol > li', (links) => {
                links = links.filter((link) => link.querySelector('.instock.availability > i').textContent !== 'In stock')
                return links.map((el) => el.querySelector<HTMLLinkElement>('h3 > a').href)
            })

            let pagePromise = (link: string) =>
                new Promise(async (resolve, reject) => {
                    let dataObj = {}

                    let newPage = await browser.newPage()
                    await newPage.goto(link)

                    dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', (text) => text.textContent)
                    dataObj['bookPrice'] = await newPage.$eval('.price_color', (text) => text.textContent)
                    dataObj['numAvailable'] = await newPage.$eval('.instock.availability', (text) => {
                        const textContent = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, '')
                        let regexp = /^.*\((.*)\).*$/i
                        let stockAvailable = regexp.exec(textContent)[1].split(' ')[0]
                        return stockAvailable
                    })
                    dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', (img: HTMLImageElement) => img.src)
                    dataObj['bookDescription'] = await newPage.$eval('#product_description', (div) => div.nextSibling.nextSibling.textContent)
                    dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', (table) => table.textContent)

                    resolve(dataObj)
                    await newPage.close()
                })

            for (const link in urls) {
                let currentPageData = await pagePromise(urls[link])
                scrapedData.push(currentPageData)
            }

            let nextButtonExist = false

            try {
                const nextButton = await page.$eval('.next > a', (a) => a.textContent)
                nextButtonExist = true
            } catch (err) {
                nextButtonExist = false
            }

            if (nextButtonExist) {
                await page.click('.next > a')
                return scrapeCurrentPage()
            }

            await page.close()
            return scrapedData
        }

        let data = await scrapeCurrentPage()
        return data
    }
}

new Scraper().run()
