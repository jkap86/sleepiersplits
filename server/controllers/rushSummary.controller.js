'use strict'

const db = require('../models');
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Plays = db.plays;

exports.player = async (req, res) => {
    const filters = [];

    req.query.include.map(include => {
        if (include?.gsis_id?.includes('-')) {
            console.log('include ' + include.display_name)
            filters.push({ [Op.contains]: [include.gsis_id] })
        }
    })

    req.query.exclude.map(exclude => {
        if (exclude?.gsis_id?.includes('-')) {
            console.log('exclude ' + exclude.display_name)

            filters.push(Sequelize.literal(`NOT ('${exclude.gsis_id}' = ANY (offense_players))`),
            )
        }
    })

    let attributes = [
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN rushing_yards = '' OR rusher_player_id != '${req.query.player_id}' THEN 0
                            WHEN rusher_player_id = '${req.query.player_id}' AND rush_attempt = '1'THEN CAST(rushing_yards AS INTEGER)
                            ELSE 0
                        END`)), 'rushing_yards'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN game_id = '' OR rusher_player_id != '${req.query.player_id}' THEN 0
                            WHEN rusher_player_id = '${req.query.player_id}' AND rush_attempt = '1' THEN 1
                            ELSE 0
                        END`)), 'carries'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN touchdown = '' THEN 0
                            WHEN rusher_player_id = '${req.query.player_id}' AND rush_attempt = '1' THEN CAST(touchdown AS INTEGER)
                            ELSE 0
                        END`)), 'rushing_touchdowns'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN receiving_yards = '' OR receiver_player_id != '${req.query.player_id}' THEN 0
                            ELSE CAST(receiving_yards AS INTEGER)
                        END`)), 'receiving_yards'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN complete_pass = '' OR receiver_player_id != '${req.query.player_id}' THEN 0
                            ELSE CAST(complete_pass AS INTEGER)
                        END`)), 'receptions'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
                            WHEN touchdown = '' OR receiver_player_id != '${req.query.player_id}' THEN 0
                            ELSE CAST(touchdown AS INTEGER)
                        END`)), 'receiving_touchdowns'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
            WHEN receiver_player_id = '${req.query.player_id}' THEN 1
            ELSE 0
        END`)), 'targets'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('game_id'))), 'games'],

    ]


    let player_raw;
    let breakout_raw;

    try {

        player_raw = await Plays.findAll({
            attributes: attributes,
            where: {
                [Op.and]: [
                    {
                        offense_players: {
                            [Op.and]: [
                                { [Op.not]: null },
                                { [Op.contains]: [req.query.player_id] },
                                ...filters
                            ]
                        }
                    },
                    {
                        passer_player_id: { [Op.not]: req.query.player_id }
                    },
                    {
                        [Op.and]: [
                            Sequelize.literal(`CAST(season AS INTEGER) >= ${req.query.startSeason}`),
                            Sequelize.literal(`CAST(week AS INTEGER) >= ${req.query.startWeek}`)
                        ]
                    },
                    {
                        [Op.and]: [
                            Sequelize.literal(`CAST(season AS INTEGER) <= ${req.query.endSeason}`),
                            Sequelize.literal(`CAST(week AS INTEGER) <= ${req.query.endWeek}`)
                        ]
                    }
                ]
            },
            raw: true
        })


        if (['season', 'passer_player_id', 'down'].includes(req.query.breakoutby)) {
            breakout_raw = await Plays.findAll({
                attributes: [...attributes, req.query.breakoutby],
                where: {
                    [Op.and]: [
                        {
                            offense_players: {
                                [Op.and]: [
                                    { [Op.not]: null },
                                    { [Op.contains]: [req.query.player_id] },
                                    ...filters
                                ]
                            }
                        },
                        {
                            passer_player_id: { [Op.not]: req.query.player_id }
                        },
                        {
                            [Op.and]: [
                                Sequelize.literal(`CAST(season AS INTEGER) >= ${req.query.startSeason}`),
                                Sequelize.literal(`CAST(week AS INTEGER) >= ${req.query.startWeek}`)
                            ]
                        },
                        {
                            [Op.and]: [
                                Sequelize.literal(`CAST(season AS INTEGER) <= ${req.query.endSeason}`),
                                Sequelize.literal(`CAST(week AS INTEGER) <= ${req.query.endWeek}`)
                            ]
                        }
                    ]
                },
                group: [req.query.breakoutby],
                raw: true
            })


        }

    } catch (err) {
        console.log(err)
    }

    const totals = {};

    player_raw.forEach(p => {
        Object.keys(p)
            .forEach(key => {
                if (!totals[key]) {
                    totals[key] = 0;
                }

                totals[key] += parseInt(p[key])
            })
    })
    res.send({
        ...totals,
        ...req.query,
        breakout: breakout_raw,
        player_id: req.query.player_id
    })
}