const sanitize = require('sanitize-html');
const bcrypt = require('bcrypt');

const createUser = async (req, res, models) => {

    let { firstName, lastName, username, password, color } = req.body;

    if (!firstName || !lastName || !username || !password) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }
    if (firstName.length > 50 || lastName.length > 50 || username.length > 50 || color.length > 20) {
        res.status(400).json({ success: false, message: 'Input exceeds maximum length' });
        return;
    }
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
        res.status(400).json({ success: false, message: 'Invalid color format. Please use hex color code.' });
        return;
    }

    firstName = sanitize(firstName);
    lastName = sanitize(lastName);
    username = sanitize(username);
    password = sanitize(password);
    color = sanitize(color);

    try {
        const existingUser = await models.User.findOne({ where: { username: username } });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Username already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const dateCreated = new Date();
        const newUser = await models.User.create({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            color,
            dateCreated
        });

        req.session.user = { username };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser.id,
                firstName,
                lastName,
                username,
                color,
                dateCreated
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = createUser;