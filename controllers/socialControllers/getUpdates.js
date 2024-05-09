async function getUpdates(req, res, models) {

    try {
        const updates = await models.Update.findAll({
            order: [['date', 'DESC']]
        });
        res.json({success:true, updates});
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch updates' });
    }

}
module.exports = getUpdates;