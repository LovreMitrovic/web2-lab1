const put = async (req, res) => {
    const regex = /^[0-9]+$/;
    if (!regex.test(req.params.match_id)) {
        res.status(400).render('Error',{error:'400 Invalid input'});
        return;
    }
    const match_id = parseInt(req.params.match_id);
    const { outcome } = req.body;
    if (outcome !== 0 && outcome !== 1 && outcome !== 2 && outcome !== null) {
        res.status(400).render('Error',{error:'400 Invalid input'});
        return;
    }
    try {
        let match = await req.app.db.any(`SELECT matches.*, comp1.competitor_name AS name1, comp2.competitor_name AS name2
                FROM matches
                INNER JOIN competitors AS comp1 on matches.competitor1_id = comp1.competitor_id
                INNER JOIN competitors AS comp2 on matches.competitor2_id = comp2.competitor_id
                WHERE match_id = $1 AND comp1.competitor_name IS NOT NULL AND comp2.competitor_name IS NOT NULL
                `,[match_id]);
        if (match.length === 0) {
            res.status(404).render('error', { error: '404 Match not found.' });
            return
        }
        match = match[0];
        await req.app.db.none('UPDATE matches SET outcome = $1 WHERE match_id = $2', [outcome, match_id]);
        match = {...match, outcome};
        res.status(200).render('partials/outcome', {match});
    } catch(error) {
        console.error(`/match/${match_id}`, error);
        res.status(500).render('error', { error: '500 Internal server error.' });
        return;
    }
}

module.exports = { put }