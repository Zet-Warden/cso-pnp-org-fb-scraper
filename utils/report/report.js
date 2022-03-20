import scrape from '../scraper/scrape.js';
import verifyPostByCaption from '../sheet/opa.js';

const ORG_FB_MAP = {
    ENGLICOM: 'https://www.facebook.com/dlsu.englicom',
};

export async function report(captions) {
    const promisedResult = [];
    for (const caption of captions) {
        promisedResult.push(verifyPostByCaption(caption));
    }
    const result = await Promise.all(result);
    return result;
}

export async function startScraping(org, month) {
    const daysInMonth = getDaysInMonth(month);
    const startDate = new Date(
        `${month} ${daysInMonth} ${new Date().getFullYear()} 23:59:59`
    );
    const endDate = new Date(`${month} 1 ${new Date().getFullYear()} 00:00:00`);

    const { takeScreenshotOfPosts, captions, links, finishScraping } =
        await scrape({
            email: process.env.FB_EMAIL,
            password: process.env.FB_PW,
            url: ORG_FB_MAP[org],
            startDate,
            endDate,
        });

    return { takeScreenshotOfPosts, captions, links, finishScraping };

    function getDaysInMonth(month) {
        const currYear = new Date().getFullYear();
        const daysInMonth = new Date(currYear, month, 0).getDate();
        return daysInMonth;
    }
}
