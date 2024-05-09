const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function deleteFeedbackPost(req, res, models, io) {

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

    try {

        const user = await getUserFromUsername(models, username);
        const feedbackPost = await models.Feedback.findByPk(postId);
        if (!feedbackPost) {
            res.status(404).json({ success: false, message: 'Feedback post not found' });
            return;
        }
        if (feedbackPost.user_id !== user.id) {
            res.status(403).json({ success: false, message: 'User does not have permission to delete this post' });
            return;
        }

        feedbackPost.deleted = true;
        await feedbackPost.save();
        io.emit('feedbackDeleted', { postId: postId });
        res.status(200).json({ success: true, message: 'Feedback post deleted successfully' });
    
    } catch (error) {
        console.error('Failed to add feedback post:', error);
        res.status(500).send({ error: 'Failed to add feedback post' });
    }

}
module.exports = deleteFeedbackPost;