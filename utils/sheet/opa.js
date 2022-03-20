import { GoogleSpreadsheet } from 'google-spreadsheet';
import OpaReference from '../../model/reference.js';
import mongoose from 'mongoose';

let opaSheet, rows;
let hasLoaded = false;

async function load() {
    const doc = new GoogleSpreadsheet(
        '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
    );
    doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await Promise.all([doc.loadInfo()]);
    opaSheet = doc.sheetsByTitle['OPA'];
    rows = await opaSheet.getRows();
    hasLoaded = true;
}

async function verifyPostByCaption(caption) {
    if (!hasLoaded) await load();

    const opaMatch = /\bOPA-\d{5}\b/g;
    const matchResult = caption.match(opaMatch);

    //only use the first matched opa number
    const opaNumber = matchResult ? matchResult[0] : null;

    const index = rows.findIndex((row) => row['OPA #'] === opaNumber);
    if (index === -1) {
        return { status: opaNumber ? 'OPA# NOT FOUND' : 'NO OPA INDICATED' };
    }

    //check if opa is already used
    const result = await OpaReference.findOne({ opaNumber });
    if (result) return { status: 'OPA HAS ALREADY BEEN USED' };

    //if not yet used then add it to the database if the pub is not under Template
    if (!rows[index]['Type of Publicity Material'].includes('Template')) {
        await OpaReference.create({ opaNumber });
    }

    const status = rows[index].Status;
    return {
        status: status ? status.toUpperCase() : 'NOT YET CHECKED',
    };
}

export default verifyPostByCaption;
