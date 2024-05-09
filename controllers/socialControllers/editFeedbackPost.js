async function editFeedbackPost(req, res, models, io) {

    const username = req.session.user?.username;
    let { postId, post } = req.body;
    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if (!postId || isNaN(postId)) {
        res.status(400).json({ success: false, message: 'Invalid or missing postId' });
        return;
    }

    if (typeof post !== 'string' || post.length < 1 || post.length > 5000) {
        res.status(400).json({ success: false, message: 'Post must be a string between 1 and 5000 characters' });
        return;
    }

    try {
        const feedbackPost = await models.Feedback.findByPk(postId);
        if (!feedbackPost) {
            res.status(404).json({ success: false, message: 'Feedback post not found' });
            return;
        }
        if (feedbackPost.user_id !== req.session.user.id) {
            res.status(403).json({ success: false, message: 'User does not have permission to edit this post' });
            return;
        }

        feedbackPost.post = post;
        await feedbackPost.save();
        io.emit('feedbackEdited', { postId: postId, post: post });
        res.status(200).json({ success: true, message: 'Feedback post updated successfully' });
    } catch (error) {
        console.error('Failed to edit feedback post:', error);
        res.status(500).json({ error: 'Failed to edit feedback post' });
    }

}
module.exports = editFeedbackPost;