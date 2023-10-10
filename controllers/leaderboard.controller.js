const generateLeaderboard = require("../utils/generateLeaderboard");
const get = async (req, res) => {
    const regex = /^[0-9]+$/;
    if (!regex.test(req.params.competition_id)) {
        res.status(400).render('Error',{error:'400 Invalid input'});
        return;
    }
    const competition_id = parseInt(req.params.competition_id);
    try {
        const competitions = await req.app.db.any('SELECT * FROM competitions WHERE competition_id = $1', [competition_id]);
        if (competitions.length === 0) {
            res.status(404).render('error', {error: '404 Competition not found.'});
            return
        }
        const competition = competitions[0];
        const competitors = await req.app.db.any('SELECT * FROM competitors WHERE competition_id = $1', [competition_id]);
        let matches = await req.app.db.any('SELECT * FROM matches WHERE competition_id = $1 ORDER BY round_no ASC', [competition_id]);
        const leaderboard = generateLeaderboard(competition, competitors, matches);
        res.render('partials/leaderboard', {leaderboard, competitors});
    } catch (error) {
        console.error(req.url, error);
        res.status(500).render('error', {error: '500 Internal server error.'});
    }
}

module.exports = {get}