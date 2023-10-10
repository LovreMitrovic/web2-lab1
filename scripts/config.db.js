require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

// SQL statements for creating tables
const createTablesSQL = `
    DROP TABLE IF EXISTS matches, rounds, competitors, competitions;

    CREATE TABLE competitions (
        competition_id SERIAL PRIMARY KEY,
        competition_name VARCHAR(255) NOT NULL UNIQUE,
        won_points FLOAT NOT NULL,
        neutral_points FLOAT NOT NULL,
        loss_points FLOAT NOT NULL,
        owner_email VARCHAR(255) NOT NULL
    );

    CREATE TABLE competitors (
        competitor_id SERIAL PRIMARY KEY,
        competition_id INT,
        competitor_name VARCHAR(255),
        FOREIGN KEY (competition_id) REFERENCES competitions(competition_id)
    );

    CREATE TABLE matches (
        match_id SERIAL PRIMARY KEY,
        round_no INT,
        competition_id INT,
        competitor1_id INT,
        competitor2_id INT,
        outcome INT,
        FOREIGN KEY (competitor1_id) REFERENCES competitors(competitor_id),
        FOREIGN KEY (competitor2_id) REFERENCES competitors(competitor_id),
        FOREIGN KEY (competition_id) REFERENCES competitions(competition_id)
    );
`;

async function createTables() {
    try {
        await db.none(createTablesSQL);
        console.log('Tables created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        pgp.end();
    }
}

// Call the function to create tables
createTables();
