require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);
const express = require('express');
const app = express();
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
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
    res.redirect('/competitions');
});

app.get('/competitions', competitionsController.get);

app.post('/competitions', competitionsController.post);

app.get('/competitions/:competition_id', competitionController.get);

app.get('/competitions/:competition_id/leaderboard', leaderboardController.get);

app.put('/matches/:match_id', matchController.put);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
