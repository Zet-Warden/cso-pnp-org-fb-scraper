import inquirer from 'inquirer';
import chalk from 'chalk';
import { AVC, AVC_ORG_MAP, MONTHS } from './const.js';

export async function promptUser() {
    console.log('prompting');
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'avc',
            message: chalk.green('Please choose an AVC-in-charge:'),
            choices: AVC,
            loop: false,
            pageSize: 9,
        },
        {
            type: 'list',
            name: 'org',
            message: chalk.green('Please choose an organization:'),
            choices: ({ avc }) => AVC_ORG_MAP[avc].sort(),
            loop: false,
            pageSize: 6,
        },
        {
            type: 'list',
            name: 'month',
            message: chalk.green(
                'Please choose the month you want to perform the audit:'
            ),
            default: () => new Date().getMonth(),
            choices: MONTHS,
            loop: false,
            pageSize: 12,
        },
    ]);
    console.log('end prompt');
    return answers;
}
