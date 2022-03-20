import verifyPostByCaption from '../utils/sheet/opa.js';

export async function verifyPostThenUpdateState(caption, updateFn) {
    const result = await verifyPostByCaption(caption);
    updateFn();
    return result;
}

export async function verifyPosts(captions, updateFn) {
    const promisedResult = [];
    for (const caption of captions) {
        promisedResult.push(verifyPostThenUpdateState(caption, updateFn));
    }

    const result = await Promise.all(promisedResult);
    return result;
}
