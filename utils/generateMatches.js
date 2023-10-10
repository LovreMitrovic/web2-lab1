/*
    players: any[]
    matches: {round: number, player_1: any, player_2: any}[]

 */
function generateMatches(players) {
    let matches = [];
    for(let round = 1; round <= players.length - 1; round++) {

        for (let j = 0; j < players.length / 2; j++) {
            matches.push({round, player_1: players[j], player_2: players[players.length - 1 - j]})
        }
        players.splice(1, 0, players[players.length - 1]);
        players.pop();
    }
    return matches;
}

//const m = generateMatches([1,2,3,4]);
//console.log(m);

module.exports = generateMatches;