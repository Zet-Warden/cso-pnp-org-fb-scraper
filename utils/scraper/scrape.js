import puppeteer from 'puppeteer';
import getCaptionFromPosts from './getCaption.js';
import screenshotPosts from './screenshot.js';
import getDateFromPost from './getDate.js';
import getLinkFromPosts from './getLink.js';

async function waitTillHTMLRendered(page, timeout = 30000) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            // console.log('Page rendered fully..');
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }
}

async function getPosts(page) {
    await page.setViewport({
        width: 800,
        height: page.viewport().height + 10000,
        deviceScaleFactor: 2,
    });

    await waitTillHTMLRendered(page);

    const posts = await page.$$('[aria-posinset]');
    //make sure to click the See More button of each post
    const seeMoreClicks = posts.map(async (post) => {
        return post.evaluate(async (node) => {
            const seeMoreBtn = node.querySelector(
                '[data-ad-comet-preview="message"] [role="button"][tabindex="0"]'
            );
            if (seeMoreBtn) seeMoreBtn.click();
        });
    });
    await Promise.all(seeMoreClicks);

    return posts;
}

async function scrape({
    url,
    startDate = new Date(new Date().setHours(23, 59, 59, 999)),
    endDate = new Date(startDate.setHours(0, 0, 0, 0)),
    email,
    password,
} = {}) {
    const browser = await puppeteer.launch({
        // headless: false,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4889.0 Safari/537.36'
    );
    await page.setViewport({
        width: 800,
        height: 10000,
        deviceScaleFactor: 2,
    });

    await page.goto('https://www.facebook.com/');
    await page.type('#email', email);
    await page.type('#pass', password);
    await page.click('[name="login"]');

    await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: 0,
    });

    await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 0,
    });
    await page.click('body');
    let posts = await getPosts(page);
    while ((await getDateFromPost(posts[posts.length - 1])) >= endDate) {
        posts = await getPosts(page);
    }

    posts = await filterPostByDate(posts, startDate, endDate);

    const captions = await getCaptionFromPosts(posts);
    const links = await getLinkFromPosts(posts);
    //getting the links needs mouse hover
    //this causes tooltips to appear when taking a screenshot
    //move mouse away to avoid such clutter
    await page.mouse.move(0, 0);

    return {
        takeScreenshotOfPosts: async () => {
            await screenshotPosts(posts);
        },
        captions: captions,
        links: links,
        finishScraping: () => {
            browser.close();
        },
    };
}

async function filterPostByDate(posts, startDate, endDate) {
    return await asyncFilter(posts, async (post) => {
        const dateOfPost = await getDateFromPost(post);
        return dateOfPost <= startDate && dateOfPost >= endDate;
    });
}

async function asyncFilter(arr, predicate) {
    // const newArr = [];
    // for (const item of arr) {
    //     if (await predicate(item)) {
    //         newArr.push(item);
    //     }
    // }
    // return newArr;

    const promisedResults = [];
    for (const item of arr) {
        promisedResults.push(predicate(item));
    }
    const results = await Promise.all(promisedResults);
    return arr.filter((_, index) => results[index]);
}

export default scrape;
