const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function addFeedbackPost(req, res, models, io) {

    const username = req.session.user?.username;
    let { post, parent } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    
    if(!post || post.length > 5000) {
        res.status(500).json({ success: false, message: 'Invalid format' });
        return;
    }

    if (parent !== undefined && parent !== null) {
        if (isNaN(parent)) {
            res.status(400).json({ success: false, message: 'Parent must be a number' });
            return;
        }
        const parentFeedback = await models.Feedback.findByPk(parent);
        if (!parentFeedback) {
            parent = null;
        }
    }

    try {
        const user = await getUserFromUsername(models, username);
        let newFeedback = await models.Feedback.create({
            userId: user.id,
            post: post,
            timestamp: new Date().toISOString(),
            parent: parent ? parent : null
        });

        newFeedback.color = user.color;
        newFeedback.username = username;

        io.emit('newFeedback', {
            newPost: JSON.stringify({
                post:newFeedback.post,
                timestamp: newFeedback.timestamp + "UTC",
                parent:newFeedback.parent,
                id: newFeedback.id,
                deleted: false,
                color:user.color,
                username:username,
                replies:{}
            })
        });
        res.status(201).send({success:true});

    } catch (error) {
        console.error('Failed to add feedback post:', error);
        res.status(500).send({ success:false, error: 'Failed to add feedback post' });
    }

}
module.exports = addFeedbackPost;