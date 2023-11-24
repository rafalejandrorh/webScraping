const fs = require('fs/promises');
const puppeteer = require('puppeteer');
const moment = require('moment');

const time = moment();

async function openWebPage() {
    const browser = await puppeteer.launch({
        //headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        //slowMo: 200 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://es.wikipedia.org/wiki/Node.js');

    //await browser.close();
}

async function captureScreenshot() {
    const browser = await puppeteer.launch({
        headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        slowMo: 500 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://www.bcv.org.ve/');
    await page.screenshot({
        path: 'screenshots/example.png'
    })

    await browser.close();
}

async function clickToNavigateOtherPage() {
    const browser = await puppeteer.launch({
        //headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        //slowMo: 500 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://quotes.toscrape.com/');
    await page.screenshot({
        path: 'screenshots/initialPage.png'
    })

    await new Promise(r => setTimeout(r, 5000));

    await page.click('a[href="/login"]');
    await page.screenshot({
        path: 'screenshots/nextPage.png'
    })

    await browser.close();
} 

async function getDataFromWebPage() {
    const browser = await puppeteer.launch({
        //headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        //slowMo: 500 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://example.com/'); //https://www.bcv.org.ve/ //https://example.com/

    // Se ejecuta en el navegador
    const result = await page.evaluate(() => {
        return 1 + 1;
    });
    console.log(result);

    const getText = await page.evaluate(() => {
        const elements = {};
        elements.title = document.querySelector('h1').innerText;
        elements.description = document.querySelector('p').innerText;
        elements.more = document.querySelector('a').innerText;
        return elements;
    });
    console.log(getText);

    await browser.close();
}

async function handleDynamicWebPage() {
    const browser = await puppeteer.launch({
        headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        //slowMo: 500 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://quotes.toscrape.com/');

    const getQuotes = await page.evaluate(() => {

        const quotes = document.querySelectorAll('.quote');
        console.log(quotes);
        
        const data = [...quotes].map(quote => {
            const elements = {};
            elements.text = quote.querySelector('.text').innerText;
            elements.author = quote.querySelector('.author').innerText;
            elements.tag = [...quote.querySelectorAll('.tag')].map((tag) => tag.innerText);
            return elements;
        });console.log(data);

        return data;
    });
    console.log(getQuotes);

    await fs.writeFile('files/quotes.json', JSON.stringify(getQuotes));

    await browser.close();
}

async function handleDynamicContentBCV() {
    const browser = await puppeteer.launch({
        //headless: false, // 'new' : para que no se abra el navegador, false : para que se abra el navegador
        //slowMo: 500 // Tiempo de pausa 
    });

    const page = await browser.newPage();
    await page.goto('https://www.bcv.org.ve/');

    const getDivisas = await page.evaluate(() => {
        const elements = {};

        const dolarId = document.querySelector('#dolar');
        const dolarValue = dolarId.querySelector('strong');
        console.log(dolarValue);
        elements.dolar = dolarValue.innerText;

        const euroId = document.querySelector('#euro');
        const euroValue = euroId.querySelector('strong');
        console.log(euroValue);
        elements.euro = euroValue.innerText;

        const rubloId = document.querySelector('#rublo');
        const rubloValue = rubloId.querySelector('strong');
        console.log(rubloValue);
        elements.rublo = rubloValue.innerText;
        //return {dolar:'40,48540000',euro:'42,71173256',rublo:'1,40015471'}
        return elements;
    });
    getDivisas.fecha = time.format('YYYY-MM-DD HH:mm:ss');

    const valorDivisasBCV = await fs.readFile('files/valorDivisasBCV.json', 'utf-8');
    if(valorDivisasBCV) {
        data = JSON.parse(valorDivisasBCV);
        writingData = [
            ...data,
            getDivisas
        ];
    }else{
        writingData = [getDivisas];
    }
    console.log(writingData);

    fs.writeFile('files/valorDivisasBCV.json', JSON.stringify(writingData));

    await browser.close();
}

//openWebPage();
//captureScreenshot();
//clickToNavigateOtherPage();
//getDataFromWebPage();
//handleDynamicWebPage();
handleDynamicContentBCV();
