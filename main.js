import 'dotenv/config';
import scrape from './utils/scraper/scrape.js';
import fs from 'fs';
import verifyPostByCaption from './utils/sheet/opa.js';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI);
// fs.rmSync('./screenshots', { recursive: true, force: true });
// fs.mkdirSync('./screenshots');

// const { takeScreenshotOfPosts, captions, links, finishScraping } = await scrape(
//     {
//         email: process.env.FB_EMAIL,
//         password: process.env.FB_PW,
//         url: 'https://www.facebook.com/dlsu.englicom',
//         // startDate: new Date('Marc2022'),
//         endDate: new Date('January 1 2022'),
//     }
// );

// const result = [];
// for (const caption of captions) {
//     result.push(verifyPostByCaption(caption));
// }

// console.log(links);
// console.log(captions);
// console.log(result);

// await takeScreenshotOfPosts();
// finishScraping();

console.log(await verifyPostByCaption('OPA-04330'));
await mongoose.disconnect();
console.log('end');
