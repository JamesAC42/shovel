async function deleteUpdate(req, res, models, redisClient, io) {

    const username = req.session.user?.username;
    let { updateId } = req.body;
    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(isNaN(updateId)) {
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
            const update = await models.Update.findByPk(updateId);
            if (!update) {
                res.status(404).json({ success: false, message: 'Update not found' });
                return;
            }

            await update.destroy();
            io.emit('updateDeleted', { updateId: updateId });
            res.status(200).json({ success: true, message: 'Update deleted successfully' });
        } catch (error) {
            console.error('Failed to delete update:', error);
            res.status(500).json({ error: 'Failed to delete update' });
        }

    });

}
module.exports = deleteUpdate;