import 'dotenv/config';
import scrape from './utils/scraper/scrape.js';
import fs from 'fs';
import verifyPostByCaption from './utils/sheet/opa.js';
import mongoose from 'mongoose';

// await mongoose.connect(process.env.MONGO_URI);
// fs.rmSync('./screenshots', { recursive: true, force: true });
// fs.mkdirSync('./screenshots');

const { takeScreenshotOfPosts, captions, links, finishScraping } = await scrape(
    {
        email: process.env.FB_EMAIL,
        password: process.env.FB_PW,
        url: 'https://www.facebook.com/dlsu.englicom',
        startDate: new Date('March 31 2022 23:59:59'),
        endDate: new Date('March 1 2022 00:00:00'),
    }
);

console.log(captions.length);
// const result = [];
// for (const caption of captions) {
//     result.push(verifyPostByCaption(caption));
// }

// console.log(links);
// console.log(captions);
// console.log(result);

// await takeScreenshotOfPosts((index) => `./screenshots/${index}Hello.png`);
// finishScraping();

// console.log(await verifyPostByCaption('OPA-04330'));
// await mongoose.disconnect();
// console.log('end');
