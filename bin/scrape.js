import scrape from '../utils/scraper/scrape.js';
import { ORG_FB_MAP, MONTHS } from './const.js';

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

    return {
        takeScreenshotOfPosts,
        captions,
        links,
        finishScraping,
        numPosts: captions.length,
    };

    function getDaysInMonth(month) {
        const monthIndex = MONTHS.indexOf(month);
        const currYear = new Date().getFullYear();
        const daysInMonth = new Date(currYear, monthIndex, 0).getDate();
        return daysInMonth;
    }
}
