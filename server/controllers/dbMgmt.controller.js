'use strict'

const db = require('../models');
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Plays = db.plays;
const fs = require('fs');
const zlib = require('zlib');
const csv = require('csv-parser');

exports.addColumns = async (req, res) => {
    const csvGzPath = `./play_by_play_${req.query.season}.csv.gz`;
    const gunzip = zlib.createGunzip();

    const readStream = fs.createReadStream(csvGzPath);

    const rows = [];

    readStream
        .pipe(gunzip)
        .pipe(csv())
        .on('data', (row) => {

            rows.push(row);

        })
        .on('end', async () => {
            const batchSize = 100;

            for (let i = 0; i < rows.length; i += batchSize) {
                console.log(`INSERTING ${i}-${i + batchSize} of ${rows.length} Plays...`)
                try {
                    await Plays.bulkCreate(rows.slice(i, i + batchSize), {
                        updateOnDuplicate: [
                            "rusher_player_id",
                            "rushing_yards",
                            "yrdln",
                            "ydstogo",
                            "defenders_in_box",
                            "defense_personnel",
                            "defense_players",
                            "home_team",
                            "away_team",
                            "posteam",
                            "defteam",
                            "posteam_score",
                            "defteam_score",
                            "down",
                            "weather"
                        ]
                    });
                } catch (error) {
                    console.log(error.message)
                }
            }

            console.log(`SUCCESS...`)

            res.json(
                rows.slice(0, 25)
            );

        })
        .on('error', (err) => {
            console.error('Error reading or parsing CSV:', err);
            res.status(500).send('Internal Server Error');
        });

}