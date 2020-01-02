const bcrypt = require('bcryptjs');

async function register(req, res) {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get('db');
    const result = await db.get_user(username);
    const existingUser = result[0];
    if (existingUser) {
        res.status(409).json('Username taken');
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const registerUser = await db.register_user(isAdmin, username, hash);
        const user = registerUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        res.status(201).json(req.session.user);
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    const db = req.app.get('db');
    const foundUser = await db.get_user(username);
    const user = foundUser[0];
    if (user) {
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (isAuthenticated){
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username
            }
            res.status(200).json(req.session.user);
        }else{
            res.status(403).json('Incorrect password');
        }
        
    } else{
        res.status(401).json('User not found. Please register as a new user before logging in.');
    }
}

async function logout(req,res){
    req.session.destroy();
    res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}