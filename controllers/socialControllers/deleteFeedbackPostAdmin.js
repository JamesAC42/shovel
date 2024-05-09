const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function deleteFeedbackPostAdmin(req, res, models, redisClient, io) {

    const username = req.session.user?.username;
    let { postId } = req.body;
    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(isNaN(postId)) {
        res.status(401).json({ success: false, message: 'Invalid format' });
        return;
    }

    redisClient.sismember('shovel:admin_usernames', username, async (err, isAdmin) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error checking admin status' });
            return;
        }
        if (!isAdmin) {
            res.status(403).json({ success: false, message: 'Access denied' });
            return;
        }

        try {
            const user = await getUserFromUsername(models, username);
            const feedbackPost = await models.Feedback.findByPk(postId);
            if (!feedbackPost) {
                res.status(404).json({ success: false, message: 'Feedback post not found' });
                return;
            }

            const authorUser = await models.User.findByPk(feedbackPost.user_id);
            if (!authorUser) {
                res.status(404).json({ success: false, message: 'Author user not found' });
                return;
            }
    
            feedbackPost.deleted = true;
            await feedbackPost.save();
            let newPost = {
                id: feedbackPost.id,
                user_id: feedbackPost.user_id,
                post: "[deleted]",
                deleted: feedbackPost.deleted,
                color:authorUser.color,
                username:authorUser.username,
                parent: feedbackPost.parent,
                timestamp: feedbackPost.timestamp + "UTC"
            }

            io.emit('feedbackDeleted', { post: newPost });
            res.status(200).json({ success: true, message: 'Feedback post deleted successfully' });

        } catch (error) {
            console.error('Failed to add feedback post:', error);
            res.status(500).send({ error: 'Failed to add feedback post' });
        }
    })

}
module.exports = deleteFeedbackPostAdmin;