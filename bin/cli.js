#!/usr/bin/env node

import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { promptUser } from './prompt.js';
import { startScraping } from './scrape.js';
import { verifyPosts } from './verify.js';
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI);

const __dirname = dirname(fileURLToPath(import.meta.url));
const spinner = createSpinner();

console.log('start');
const { org, month } = await promptUser();
console.log('end');
const basePath = path.join(__dirname, org);

if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

//start scraping
console.log();
spinner.start({
    text: `Scraping Facebook posts of ${org} for ${month}`,
    color: 'yellow',
});
const { takeScreenshotOfPosts, numPosts, captions, links, finishScraping } =
    await startScraping(org, month);
spinner.success({
    text: `Done Scraping ${chalk.yellow(`[Found ${numPosts} posts]`)}`,
});

//start verifying
let numPostVerified = 0;
spinner.start({
    text: `Validating each post ${chalk.yellow(
        `(${numPostVerified}/${numPosts})`
    )}`,
    color: 'yellow',
});

const postStatus = await verifyPosts(captions, () => {
    numPostVerified++;
    spinner.update({
        text: `Validating each post ${chalk.yellow(
            `(${numPostVerified}/${numPosts})`
        )}`,
    });
});
const approvedPosts = postStatus.filter(
    (status) => status.status === 'APPROVED'
);
spinner.success({
    text: `Done Verifying ${chalk.yellow(
        `[Approved: (${approvedPosts.length}/${numPosts})]`
    )}`,
});

//generate report
spinner.start({
    text: `Generating report for ${org}`,
    color: 'yellow',
});

const opas = extractOpa(captions);
const headers = ['Post #', 'OPA #', 'Link to Post', 'Status'];
const values = [];

postStatus.forEach((status, index) => {
    const info = [index + 1, opas[index], links[index], status.status];
    values.push(info);
});

const report = `${headers.join(',')}\n${values
    .map((info) => info.join(','))
    .join('\n')}`;

fs.writeFileSync(`${path.join(basePath, month, 'report.csv')}`, report);
spinner.success({ text: 'Done generating report' });

//generate screenshots
let numPostScreenshoted = 0;
spinner.start({
    text: `Generating screenshots. ${chalk.yellow(
        `(${numPostScreenshoted}/${numPosts})`
    )}`,
    color: 'yellow',
});

await takeScreenshotOfPosts(
    (index) => path.join(basePath, month, 'screenshots', `${index + 1}.png`),
    () => {
        numPostScreenshoted++;
        spinner.update({
            text: `Validating each post ${chalk.yellow(
                `(${numPostScreenshoted}/${numPosts})`
            )}`,
        });
    }
);

spinner.success({ text: 'Done generating screenshots' });

mongoose.disconnect();
finishScraping();

function extractOpa(captions) {
    const opas = [];
    captions.forEach((caption) => {
        const opaMatch = /\bOPA-\d{5}\b/g;
        const matchResult = caption.match(opaMatch);

        opas.push(matchResult ? matchResult[0] : 'N/A');
    });
    return opas;
}
