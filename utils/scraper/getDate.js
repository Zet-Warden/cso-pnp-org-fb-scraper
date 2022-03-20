async function getDateFromPost(post) {
    const dateString = await post.evaluate((node) => {
        //Filipino FB date selector
        //tries different selectors as date structure differs from post to post
        let fbDateTimeString =
            node.querySelector('b>b:not([style])')?.innerText;
        if (!fbDateTimeString) {
            fbDateTimeString = node.querySelector('b:not([style])')?.innerText;
        }

        if (!fbDateTimeString) {
            fbDateTimeString = node.querySelectorAll('a')[3].innerText;
        }

        // let fbDateTimeString = node.querySelector('b:not([style])').innerText;
        return fbDateTimeString;
    });
    // console.log(dateString);
    const date = convertFbDateStringToDate(dateString);
    return date;
}

/**
 * This function is used to standardized converting the date time string from FB
 * as its HTML structure differs, leading to various representation of the datetime string
 *
 * Setting the language to Filipino produces a much more consistent HTML structuring
 * as such this function should expect Filipino months
 * @param {string} fbDateTimeString
 */
function convertFbDateStringToDate(fbDateTimeString) {
    const enMonths = [
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

    const phMonths = [
        'Enero',
        'Pebrero',
        'Marso',
        'Abril',
        'Mayo',
        'Hunyo',
        'Hulyo',
        'Agosto',
        'Setyembre',
        'Oktubre',
        'Nobyembre',
        'Disyembre',
    ];

    const monthDictionary = new Map();
    enMonths.forEach((month) => monthDictionary.set(month, month));
    phMonths.forEach((month, index) =>
        monthDictionary.set(month, enMonths[index])
    );

    const [date, timestamp] = fbDateTimeString.split('nang');
    const [month, day, year] = date.trim().split(/\s+/);

    let actualMonth = monthDictionary.get(month);
    if (actualMonth == undefined) {
        // console.log(`Cannot evaluate month format: ${month}`);
        // console.log("Assuming it is today's month");

        //assume today's month when FB date is 5s, 51m, etc...
        //this indicates seconds, minutes, or hours ago
        actualMonth = enMonths[new Date().getMonth()];
        // throw new Error(`Cannot evaluate month format: ${month}`);
    }

    // const [time, ampm] = timestamp.trim().split(/\s+/);
    // const [hour, minutes] = time.split(':');
    // if (ampm.toUpperCase() == 'PM') {
    //     var actualTime = `${Number(hour) + 12}:${minutes}`;
    // } else {
    //     var actualTime = time;
    // }

    return new Date(
        `${actualMonth} ${day ? day : new Date().getDate()} ${
            year ? year : new Date().getFullYear()
        }`
    );
}

export default getDateFromPost;
