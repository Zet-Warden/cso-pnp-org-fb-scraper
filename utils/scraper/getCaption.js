async function getCaptionFromPost(post) {
    const caption = await post.evaluate(async (node) => {
        const caption = node.querySelector('[data-ad-comet-preview="message"]');
        return caption?.innerText || '<<NO CAPTION>>';
    });

    // console.log(caption);
    return caption;
}

async function getCaptionFromPosts(posts) {
    const captions = [];
    for (const post of posts) {
        captions.push(getCaptionFromPost(post));
    }

    return Promise.all(captions);
}

export default getCaptionFromPosts;
