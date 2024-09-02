const deleteDeepWorkHours = async (models, room) => {
    try {
        await models.DeepWorkHourTracker.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting deep work hours:', error);
        return false;
    }
}

const deleteJournalEntryTags = async (models, journalId) => {
    try {
        await models.JournalTag.destroy({ where: { journalEntry: journalId } });
        return true;
    } catch (error) {
        console.error('Error deleting journal entry tags:', error);
        return false;
    }
}

const deleteJournals = async (models, room) => {
    try {
        const journals = await models.Journal.findAll({ where: { room: room } });
        for (const journal of journals) {
            await deleteJournalEntryTags(models, journal.id);
        }
        await models.Journal.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting journals:', error);
        return false;
    }
}

const deleteRoomRequests = async (models, room) => {
    try {
        await models.RoomRequest.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting room requests:', error);
        return false;
    }
}

const deleteRoomUsers = async (models, room) => {
    try {
        await models.RoomUser.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting room users:', error);
        return false;
    }
}

const deleteStreakHighscores = async (models, room) => {
    try {
        await models.StreakHighscore.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting streak highscores:', error);
        return false;
    }
}

const deleteStreakTracker = async (models, room) => {
    try {
        await models.StreakTracker.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting streak tracker:', error);
        return false;
    }
}

const deleteTaskTags = async (models, taskId) => {
    try {
        await models.TaskTag.destroy({ where: { taskId: taskId } });
        return true;
    } catch (error) {
        console.error('Error deleting task tags:', error);
        return false;
    }
}

const deleteTasks = async (models, goalId) => {
    try {
        const tasks = await models.Task.findAll({ where: { goalId: goalId } });
        for (const task of tasks) {
            await deleteTaskTags(models, task.id);
        }
        await models.Task.destroy({ where: { goalId: goalId } });
        return true;
    } catch (error) {
        console.error('Error deleting tasks:', error);
        return false;
    }
}

const deleteGoals = async (models, room) => {
    try {
        const goals = await models.Goal.findAll({ where: { room: room } });
        for (const goal of goals) {
            await deleteTasks(models, goal.id);
        }
        await models.Goal.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting goals:', error);
        return false;
    }
}

const deleteTags = async (models, room) => {
    try {
        await models.Tag.destroy({ where: { room: room } });
        return true;
    } catch (error) {
        console.error('Error deleting tags:', error);
        return false;
    }
}

module.exports = {
    deleteDeepWorkHours,
    deleteJournals,
    deleteRoomRequests,
    deleteRoomUsers,
    deleteStreakHighscores,
    deleteStreakTracker,
    deleteGoals,
    deleteTags
}
