async function getLinkFromPost(post) {
    //hovering activates the link
    await (await post.$$('a[aria-label]'))[1].hover();

    const link = await post.evaluate(async (node) => {
        // await new Promise((resolve) => setTimeout(resolve, 100));
        const link = node.querySelectorAll('a[aria-label]')[1];
        return link.href.split('?')[0];
    });

    return link;
}

async function getLinkFromPosts(posts) {
    const links = [];
    for (const post of posts) {
        //wait for each link to finish as we need to hover over the link for the proper href to appear
        links.push(await getLinkFromPost(post));
    }
    return links;
}

export default getLinkFromPosts;
