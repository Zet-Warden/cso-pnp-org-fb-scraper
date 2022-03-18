#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import nanospinner from 'nanospinner';

const ORG_LIST = [
    'ChemSoc',
    'MC',
    'PhySoc',
    'SV',
    'AIESEC',
    'AJA ANIMO',
    'ArCG',
    'AU',
    'EA',
    'ECO',
    'ENGLICOM',
    'GAS',
    'GMC',
    'HFH',
    'IS',
    'OC',
    'PRISM',
    'ROTARACT',
    'UNITED',
    'VA',
    'WG',
    'AMSTUD',
    'BSS',
    'CULTURA',
    'DANUM',
    'DEVINT',
    'ESA',
    'NKK',
    'PILOSOPO',
    'POLISCY',
    'SDH',
    'SEASON',
    'SMS',
    'TEAMCOMM',
    'ACCESS',
    'CES',
    'ChEn',
    'ECES',
    'IMES',
    'LSCS',
    'MES',
    'SME',
    'Adcreate',
    'BMS',
    'Econorg',
    'JEMA',
    'JPIA',
    'LLS',
    'MAFIA',
    'YES',
].sort();

const AVC = [
    'Jacob Sy',
    'Alicia Concepcion',
    'Ry De Vicente',
    'Nathan Go',
    'Jaisa Perez',
    'Fritz Beloso',
    'Miguel Panganiban',
    'Ruiz Chavez',
    'Allen Ereña',
].sort();

const AVC_ORG_MAP = {
    'Jacob Sy': ['PILOSOPO', 'POLISCY', 'SDH', 'SEASON', 'SMS', 'TEAMCOMM'],
    'Alicia Concepcion': ['PRISM', 'ROTARACT', 'UNITED', 'VA', 'WG', 'AMSTUD'],
    'Ry De Vicente': ['ArCG', 'AU', 'EA', 'ECO', 'ENGLICOM', 'GAS'],
    'Nathan Go': ['ACCESS', 'CES', 'ChEn', 'ECES', 'IMES', 'LSCS'],
    'Jaisa Perez': ['BSS', 'CULTURA', 'DANUM', 'DEVINT', 'ESA', 'NKK'],
    'Fritz Beloso': ['MES', 'SME', 'Adcreate', 'BMS', 'Econorg', 'JEMA'],
    'Miguel Panganiban': ['ChemSoc', 'MC', 'PhySoc', 'SV', 'AIESEC'],
    'Ruiz Chavez': ['AJA ANIMO', 'GMC', 'HFH', 'IS', 'OC'],
    'Allen Ereña': ['JPIA', 'LLS', 'MAFIA', 'YES'],
};

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

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

// const answers = await inquirer.prompt([]);

console.log(answers);
