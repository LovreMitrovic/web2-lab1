const generateLeaderboard = require("../utils/generateLeaderboard");
const get = async (req, res) => {
    const regex = /^[0-9]+$/;
    if (!regex.test(req.params.competition_id)) {
        res.status(400).render('Error',{error:'400 Invalid input'});
        return;
    }
    const competition_id = parseInt(req.params.competition_id);
    try {
        const competitions = await req.app.db.any('SELECT * FROM competitions WHERE competition_id = $1',[competition_id]);
        if (competitions.length === 0) {
            res.status(404).render('error', { error: '404 Competition not found.' });
            return
        }
        const competition = competitions[0];
        const competitors = await req.app.db.any('SELECT * FROM competitors WHERE competition_id = $1',[competition_id]);
        let matches = await req.app.db.any('SELECT * FROM matches WHERE competition_id = $1 ORDER BY round_no ASC',[competition_id]);
        const leaderboard = generateLeaderboard(competition, competitors, matches);
        matches = matches.map((match) => {
            let competitor1_name = competitors.find((obj) => obj.competitor_id === match.competitor1_id).competitor_name;
            let competitor2_name = competitors.find((obj) => obj.competitor_id === match.competitor2_id).competitor_name;
            return {...match, competitor1_name, competitor2_name};
        });
        //res.json({competition, competitors, matches, leaderboard});
        res.render('competition', {competition, competitors, matches, leaderboard})
    } catch(error) {
        console.error(`/competitions/${competition_id}`, error);
        res.status(500).render('error', { error: '500 Internal server error.' });
    }
}

module.exports = { get }