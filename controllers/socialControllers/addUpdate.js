async function addUpdate(req, res, models, redisClient, io) {

    
    const username = req.session.user?.username;
    let { post } = req.body;
    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    redisClient.sismember('shovel:admin_usernames', username, (err, isAdmin) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error checking admin status' });
            return;
        }
        if (!isAdmin) {
            res.status(403).json({ success: false, message: 'Access denied' });
            return;
        }
        
        const currentDate = new Date().toISOString().split('T')[0];
        models.Update.create({
            date: currentDate,
            info: post
        }).then(update => {
            res.status(201).json({ success: true, message: 'Update added successfully', updateId: update.id });
            io.emit('newUpdate', { date: currentDate, info: post, id: update.id });
        }).catch(error => {
            res.status(500).json({ success: false, message: 'Failed to add update', error: error.message });
        });

    });

}
module.exports = addUpdate;