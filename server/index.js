require('dotenv').config();
const express = require('express');
const app = express();
const { SERVER_PORT, DB_STRING, SESSION_SECRET } = process.env;
const session = require('express-session');
const massive = require('massive');

const authC = require('./controllers/authController');
const treasureC = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

// middleware
app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// db
massive(DB_STRING).then(db => {
    app.set('db', db);
    console.log('DB connected!');
})

// endpoints
// auth
app.post('/auth/register', authC.register);
app.post('/auth/login', authC.login);
app.get('/auth/logout', authC.logout);
// treasure
app.get('/api/treasure/dragon', treasureC.dragonTreasure);
app.get('/api/treasure/user', auth.userOnly, treasureC.getUserTreasure);
app.post('/api/treasure/user', auth.userOnly, treasureC.addUserTreasure);
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureC.getAllTreasure);

app.listen(SERVER_PORT, () => { console.log('Server is listening to port', SERVER_PORT); })
