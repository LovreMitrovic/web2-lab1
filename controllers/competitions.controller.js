const generateMatches = require("../utils/generateMatches");
const get = async (req, res) => {
    try {
        const competitions = await req.app.db.any('SELECT * FROM competitions');
        res.render('competitions', {competitions,errors:null});
    } catch(error) {
        console.error('/competitions', error);
        res.status(500).render('error', { error: '500 Internal server error.' });
    }
}

const post = async (req, res) => {
    const { competition_name, won_points, neutral_points, loss_points, competitors } = req.body;
    if(!competition_name && !won_points && !neutral_points && !loss_points && !competitors){
        res.status(400).render('error',{ error: '400 Invalid input: missing fields' });
        return;
    }
    const listOfCompetitors = competitors.split(/\n|;|\r\n/);
    const errors = [];
    if (!competition_name) {
        errors.push('Competition name is required.');
    }
    if (competition_name.length > 255) {
        errors.push('Competition name must be less than 255 characters.');
    }
    let regex = /^[a-zA-Z0-9 ŠšĐđŽžČčĆć]*$/;
    if (!regex.test(competition_name)) {
        errors.push('Competition name must be alphanumeric.');
    }
    try {
        const competition = await req.app.db.any('SELECT * FROM competitions WHERE competition_name = $1', [competition_name]);
        if (competition.length > 0) {
            errors.push('Competition name must be unique.');
        }
    } catch(error) {
        console.error('/competitions', error);
        res.status(500).render('error', { error: '500 Internal server error.' });
        return;
    }
    if (listOfCompetitors.length < 4 || listOfCompetitors.length > 8) {
        errors.push('You must have between 4 and 8 competitors.');
    }
    if (competitors.length > 255) {
        errors.push('Competitor names filed must be less than 255 characters.');
    }
    listOfCompetitors.forEach((competitor) => { competitor.trim() });
    for (let competitor of listOfCompetitors) {
        if (competitor.length === 0 || competitor.length > 255 || !regex.test(competitor)) {
            errors.push(`Each competitor name must not be empty, it must be alphanumeric and it must be less than 255 characters.`);
            break;
        }
    }
    if(listOfCompetitors.length !== new Set(listOfCompetitors).size){
        errors.push('Competitor names must be unique.');
    }
    if (isNaN(won_points) || isNaN(neutral_points) || isNaN(loss_points) || won_points === '' || neutral_points === '' || loss_points === '') {
        errors.push('Points must be numbers.');
    }
    if (errors.length > 0) {
        res.status(400).render('error',{ error: '400 Invalid input' ,errors });
        return;
    }
    try {
        await req.app.db.none('INSERT INTO competitions (competition_name, won_points, neutral_points, loss_points, owner_email) VALUES ($1, $2, $3, $4, $5)', [competition_name, won_points, neutral_points, loss_points, req.oidc.user.email]);
        const {competition_id} = await req.app.db.one('SELECT competition_id FROM competitions WHERE competition_name = $1', [competition_name]);

        let query = 'INSERT INTO competitors (competition_id, competitor_name) VALUES ';
        if (listOfCompetitors.length % 2 === 1) {
            query += `(${competition_id}, NULL),`;
        }
        query += listOfCompetitors.map((comp) => `(${competition_id}, '${comp}')`).join(',');
        await req.app.db.none(query);

        const competitor_ids = await req.app.db.any('SELECT competitor_id FROM competitors WHERE competition_id = $1', [competition_id]);
        const matches = generateMatches(competitor_ids.map(obj => obj.competitor_id));
        query = 'INSERT INTO matches (round_no, competition_id, competitor1_id, competitor2_id) VALUES ';
        query += matches.map((match) => `(${match.round}, ${competition_id}, ${match.player_1}, ${match.player_2})`).join(',');
        await req.app.db.none(query);

        res.redirect(`/competitions/${competition_id}`);
    } catch(error) {
        console.error('/competitions', error);
        res.status(500).render('error', { error: '500 Internal server error.' });
    }

}

module.exports = { get, post }