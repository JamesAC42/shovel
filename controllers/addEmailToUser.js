
async function addEmailToUser(req, res, models) {

    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not logged in.' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check email length
    if (email.length > 200) {
        return res.status(400).json({ success: false, message: 'Email must be 200 characters or less' });
    }

    try {

        let user = models.User.findOne({ where: { username: req.session.user.username } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await models.User.update(
            { email: email },
            { where: { username: req.session.user.username } }
        );

        return res.status(200).json({ success: true, message: 'Email added successfully' });
        
    } catch (error) {
        console.error('Error adding email to user:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = addEmailToUser;
