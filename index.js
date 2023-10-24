require('dotenv').config();
const fs = require('fs');
const https = require('https');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);
const express = require('express');
const { auth } = require('express-openid-connect');
const competitionsController = require('./controllers/competitions.controller');
const competitionController = require('./controllers/competition.controller');
const matchController = require('./controllers/match.controller');
const leaderboardController = require('./controllers/leaderboard.controller');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = express();

app.db = db;
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

app.use(auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: externalUrl || `https://localhost:${port}`,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN
}));

app.use((req,res,next)=>{
    res.locals.user = req.oidc.isAuthenticated() ? req.oidc.user : null;
    next();
});

const requiresAuth = function(req,res,next){
    if (!req.oidc.isAuthenticated()) {
        res.status(401).render('error', { error: '401 Unauthorized' });
        return;
    }
    next();
}

app.get('/', (req, res) => {
    res.redirect('/competitions');
});

app.get('/competitions', competitionsController.get);

app.post('/competitions', requiresAuth,competitionsController.post);

app.get('/competitions/:competition_id', competitionController.get);

app.get('/competitions/:competition_id/leaderboard', leaderboardController.get);

app.delete('/competitions/:competition_id', requiresAuth, competitionController.del);

app.put('/matches/:match_id', requiresAuth,matchController.put);

if(externalUrl){
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server is running locally on http://${hostname}:${port}/ and from outside on ${externalUrl}`);
    });
} else {
    https.createServer({
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem'),
    },app).listen(port, () => {
        console.log(`Server is running on https://localhost:${port}/`);
    });
}