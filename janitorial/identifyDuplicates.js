const { Sequelize, Op } = require('sequelize');
const { User, RoomRequest, DeepWorkHourTracker, StreakHighscore, StreakTracker, Goal, Journal, RoomUser, Tag, Task, Feedback } = require('../models/models');
const psqlLogin = require('../psql_login.json');

async function identifyDuplicateEmails() {
    // Create a new Sequelize instance

    const sequelize = new Sequelize(`postgres://${psqlLogin.username}:${psqlLogin.password}@localhost:5432/shovel`, {
        logging: false
    });

    try {
        // Authenticate the connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Find users with duplicate emails (case insensitive)
        const duplicateUsers = await User.findAll({
            attributes: [
                [Sequelize.fn('LOWER', Sequelize.col('email')), 'email'],
                [Sequelize.fn('array_agg', Sequelize.col('id')), 'userIds'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                email: {
                    [Op.not]: null // Exclude null emails
                }
            },
            group: [Sequelize.fn('LOWER', Sequelize.col('email'))],
            having: Sequelize.literal('COUNT(*) > 1'),
            raw: true
        });

        if (duplicateUsers.length === 0) {
            console.log('No duplicate emails found.');
        } else {
            console.log('Users with duplicate emails:');
            duplicateUsers.forEach(duplicate => {
                console.log(`Email: ${duplicate.email}`);
                console.log(`User IDs: ${duplicate.userIds}`);
                console.log(`Count: ${duplicate.count}`);
                console.log('---');
            });
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

async function reassociateDuplicateUsers() {
    const sequelize = new Sequelize(`postgres://${psqlLogin.username}:${psqlLogin.password}@localhost:5432/shovel`, {
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Find users with duplicate emails (case insensitive)
        const duplicateUsers = await User.findAll({
            attributes: [
                [Sequelize.fn('LOWER', Sequelize.col('email')), 'email'],
                [Sequelize.fn('array_agg', Sequelize.col('id')), 'userIds'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                email: {
                    [Op.not]: null
                }
            },
            group: [Sequelize.fn('LOWER', Sequelize.col('email'))],
            having: Sequelize.literal('COUNT(*) > 1'),
            raw: true
        });

        for (const duplicate of duplicateUsers) {
            const userIds = duplicate.userIds.sort((a, b) => a - b);
            const oldestUserId = userIds[0];
            const newerUserIds = userIds.slice(1);

            console.log(`Processing duplicate email: ${duplicate.email}`);
            console.log(`Oldest user ID: ${oldestUserId}`);
            console.log(`Newer user IDs: ${newerUserIds.join(', ')}`);

            // Reassociate all related data to the oldest user
            await sequelize.transaction(async (t) => {
                const updateOptions = { where: { userId: newerUserIds }, transaction: t };

                await RoomRequest.update({ userId: oldestUserId }, updateOptions);
                await DeepWorkHourTracker.update({ userId: oldestUserId }, updateOptions);
                await StreakHighscore.update({ userId: oldestUserId }, updateOptions);
                await StreakTracker.update({ userId: oldestUserId }, updateOptions);
                await Goal.update({ userId: oldestUserId }, updateOptions);
                await Journal.update({ userId: oldestUserId }, updateOptions);
                await RoomUser.update({ userId: oldestUserId }, updateOptions);
                await Tag.update({ userId: oldestUserId }, updateOptions);
                await Task.update({ userId: oldestUserId }, updateOptions);
                await Feedback.update({ userId: oldestUserId }, updateOptions);

                // Update the oldest user's email to lowercase
                await User.update(
                    { email: Sequelize.fn('LOWER', Sequelize.col('email')) },
                    { where: { id: oldestUserId }, transaction: t }
                );

                // Update newer users
                for (const newerId of newerUserIds) {
                    const newerUser = await User.findByPk(newerId, { transaction: t });
                    await User.update(
                        { 
                            username: `${newerUser.username}_merged_${oldestUserId}`,
                            email: null
                        },
                        { where: { id: newerId }, transaction: t }
                    );
                }
            });

            console.log(`Reassociation completed for email: ${duplicate.email}`);
            console.log('---');
        }

        console.log('All duplicate users have been processed.');

    } catch (error) {
        console.error('Error processing duplicate users:', error);
    } finally {
        await sequelize.close();
    }
}

// You can run this function manually
// identifyDuplicateEmails();

module.exports = { identifyDuplicateEmails, reassociateDuplicateUsers };
