async function dragonTreasure(req, res) {
    const db = req.app.get('db');
    const result = await db.get_dragon_treasure(1);
    res.status(200).json(result);
}

async function getUserTreasure(req, res) {
    const db = req.app.get('db');
    const result = await db.get_user_treasure(req.session.user.id);
    res.status(200).json(result);
}

async function addUserTreasure(req, res) {
    const { treasureURL } = req.body;
    const { id } = req.session.user;
    console.log(treasureURL,id);
    
    const db = req.app.get('db');
    const result = await db.add_user_treasure(treasureURL,id);
    res.status(200).json(result);
}

async function getAllTreasure(req, res) {
    const db = req.app.get('db');
    const result = await db.get_all_treasure();
    res.status(200).json(result);
}

module.exports = {
    dragonTreasure,
    getUserTreasure,
    addUserTreasure,
    getAllTreasure
};