require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);
const express = require('express');
const app = express();
const { auth, requiresAuth } = require('express-openid-connect');
const competitionsController = require('./controllers/competitions.controller');
const competitionController = require('./controllers/competition.controller');
const matchController = require('./controllers/match.controller');
const leaderboardController = require('./controllers/leaderboard.controller');
app.db = db;

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set("views", "./views")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use(auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN
}));

app.use((req,res,next)=>{
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user : null;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/competitions');
});

app.get('/competitions', competitionsController.get);

app.post('/competitions', requiresAuth(),competitionsController.post);

app.get('/competitions/:competition_id', competitionController.get);

app.get('/competitions/:competition_id/leaderboard', leaderboardController.get);

app.put('/matches/:match_id', function(req,res,next){
    if (!req.oidc.isAuthenticated()) {
        res.status(401).render('error', { error: '401 Unauthorized' });
        return;
    }
    next();
},matchController.put);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
