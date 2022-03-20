async function screenshotPost(post, path, updateFn) {
    await post.screenshot({
        path: path,
    });
    updateFn();
}

async function screenshotPosts(posts, pathFn) {
    const screenshots = [];
    posts.forEach((post, index) => {
        screenshots.push(screenshotPost(post, pathFn(post, index), updateFn));
    });

    await Promise.all(screenshots);
}

export default screenshotPosts;
