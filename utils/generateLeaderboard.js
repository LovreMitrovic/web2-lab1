/*
    "competition": {
        "competition_id": number
        "competition_name": string
        "won_points": number
        "neutral_points": number
        "loss_points": number
    },
    "competitors": {
        "competitor_id": number can be null where null is "bye"
        "competition_id": number
        "competitor_name": string
     }[],
    "matches": {
        "match_id": 7,
        "round_no": 0,
        "competition_id": 5,
        "competitor1_id": 19,
        "competitor2_id": 22,
        "outcome": number where 0=draw, 1 and 2 are wins for competitors and null is not played
    }[],
    leaderboard: {
        competitor_id: number, competitor_name: string, wins: number, draws: number, losses: number, points: number
    }[]
 */

function generateLeaderboard(competition, competitors, matches){
    let leaderboard = competitors.map(obj => {
        return {...obj, wins:0, draws:0, losses:0};
    });
    for (let match of matches){
        if (match.outcome === 0){
            leaderboard.find((obj) => obj.competitor_id === match.competitor1_id).draws += 1;
            leaderboard.find((obj) => obj.competitor_id === match.competitor2_id).draws += 1;
        } else if (match.outcome === 1){
            leaderboard.find((obj) => obj.competitor_id === match.competitor1_id).wins += 1;
            leaderboard.find((obj) => obj.competitor_id === match.competitor2_id).losses += 1;
        } else if (match.outcome === 2){
            leaderboard.find((obj) => obj.competitor_id === match.competitor1_id).losses += 1;
            leaderboard.find((obj) => obj.competitor_id === match.competitor2_id).wins += 1;
        }
    };
    leaderboard = leaderboard.map((obj) => {
        let points = obj.draws * competition.neutral_points;
        points += obj.wins * competition.won_points;
        points += obj.losses * competition.loss_points;
        return {...obj, points}
    })

    leaderboard.sort((a,b) => b.points - a.points);

    return leaderboard;
}

module.exports = generateLeaderboard;