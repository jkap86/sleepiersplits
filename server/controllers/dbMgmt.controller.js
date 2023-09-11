'use strict'

const db = require('../models');
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
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

            rows.push({
                ...row,
                id: `${row.game_id}--${row.play_id}`
            });

        })
        .on('end', async () => {
            const batchSize = 100;

            for (let i = 0; i < rows.length; i += batchSize) {
                console.log(`INSERTING ${i}-${i + batchSize} of ${rows.length} Plays...`)
                try {
                    await Plays.bulkCreate(rows.slice(i, i + batchSize), {
                        updateOnDuplicate: [
                            "game_id"
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

exports.createIdColumn = async (req, res) => {
    const play_game_ids = await Plays.findAll({
        attributes: ['id'],
        raw: true
    })

    console.log(play_game_ids.length + ' Plays to update...')
    const plays_w_id = play_game_ids.map(play => {
        return {
            ...play,
            game_id: play.id.split('--')[0]
        }
    })
    console.log('Begin update')

    const batchSize = 100;

    for (let i = 0; i < plays_w_id.length; i += batchSize) {
        console.log(`INSERTING ${i}-${i + batchSize} of ${plays_w_id.length} Plays...`)

        await Plays.bulkCreate(plays_w_id.slice(i, i + batchSize), {
            updateOnDuplicate: ['game_id']
        })
    }

    res.send('COMPLETE')
    console.log('Update complete')
}

exports.populateplayerplays = async (req, res) => {
    const player_ids = require('../player_ids.json');

    const count = await Plays.count();

    const batchSize = 1000;

    for (let i = 0; i < count; i += batchSize) {
        console.log(`Processing ${i}=${i + batchSize} of ${count} Plays...`)
        const play_players = await Plays.findAll({
            order: [['id']],
            attributes: ['id', 'offense_players'],
            offset: i,
            limit: batchSize,
            raw: true
        })

        const players = [];
        const playerPlays = [];

        play_players.forEach(play => {
            (play.offense_players || [])
                .forEach(player_id => {
                    const player_match = player_ids.find(p => p.gsis_id === player_id);

                    if (player_match) {
                        if (!players.find(p => p.gsis_id === player_match.gsis_id)) {
                            players.push({
                                gsis_id: player_match.gsis_id,
                                display_name: player_match.display_name,
                                headshot: player_match.headshot,
                                position: player_match.position
                            });
                        }

                        playerPlays.push({
                            playId: play.id,
                            playerGsisId: player_match.gsis_id
                        })
                    }
                })
        })

        await sequelize.model('players').bulkCreate(players, { ignoreDuplicates: true });

        await sequelize.model('playerPlays').bulkCreate(playerPlays, { ignoreDuplicates: true })
    }
}