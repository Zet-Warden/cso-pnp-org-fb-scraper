async function screenshotPost(post, filename) {
    await post.screenshot({
        path: `./screenshots/${filename}.png`,
    });
}

async function screenshotPosts(posts) {
    const screenshots = [];
    posts.forEach((post, index) => {
        screenshots.push(screenshotPost(post, index + 1));
    });

    await Promise.all(screenshots);
}

export default screenshotPosts;
