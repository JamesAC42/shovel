async function getFeedbackPostsByParentId(parentId, models) {
    let posts = {};
    try {
        const feedbackPosts = await models.Feedback.findAll({
            where: { parent: parentId },
            include: [{
                model: models.User,
                attributes: ['username', 'color']
            }],
            order: [['timestamp', 'DESC']],
            limit: parentId === null ? 50 : undefined
        });
        for (const post of feedbackPosts) {
            let postItem = {
                id: post.id,
                user_id: post.user_id,
                username: post.User.username,
                color: post.User.color,
                post: post.deleted ? '[deleted]' : post.post,
                timestamp: post.timestamp + "UTC",
                parent: post.parent,
                deleted: post.deleted,
                replies: {}
            };
            const childPosts = await getFeedbackPostsByParentId(postItem.id, models);
            posts[postItem.id]  = postItem;
            posts[postItem.id].replies = childPosts;
        }
        return posts;
    } catch (error) {
        console.error('Error fetching feedback posts:', error);
        throw error;
    }
}

async function getFeedback(req, res, models) {

    try {
        const topLevelPosts = await getFeedbackPostsByParentId(null, models);
        res.status(200).json({ success: true, posts: JSON.stringify(topLevelPosts) });
    } catch (error) {
        console.error('Failed to retrieve feedback:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve feedback' });
    }

}
module.exports = getFeedback;