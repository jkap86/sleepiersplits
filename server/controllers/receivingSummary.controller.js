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
                            WHEN air_yards = '' OR receiver_player_id != '${req.query.player_id}' THEN 0
                            ELSE CAST(air_yards AS INTEGER)
                        END`)), 'air_yards'],
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
                        END`)), 'touchdowns'],
        [Sequelize.fn('COUNT', Sequelize.col('game_id')), 'routes'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('game_id'))), 'games'],
        [Sequelize.fn('SUM', Sequelize.literal(`CASE
            WHEN receiver_player_id = '${req.query.player_id}' THEN 1
            ELSE 0
        END`)), 'targets']
    ]


    let player_raw;

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
                        pass_attempt: "1"
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

        /*
                if (['season', 'passer_player_id'].includes(req.query.breakoutby)) {
                    total_seasons_raw = await Plays.findAll({
                        attributes: [
                            req.query.breakoutby,
                            [Sequelize.fn('ARRAY_AGG', Sequelize.col('offense_players')), 'offense_players'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN air_yards = '' THEN 0
                                    ELSE CAST(air_yards AS INTEGER)
                                END`)), 'air_yards'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN receiving_yards = '' THEN 0
                                    ELSE CAST(receiving_yards AS INTEGER)
                                END`)), 'receiving_yards'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN complete_pass = '' THEN 0
                                    ELSE CAST(complete_pass AS INTEGER)
                                END`)), 'complete_pass'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN touchdown = '' THEN 0
                                    ELSE CAST(touchdown AS INTEGER)
                                END`)), 'touchdown'],
                            [Sequelize.fn('ARRAY_AGG', Sequelize.col('game_id')), 'game_id']
                        ],
                        where: {
                            [Op.and]: [
                                {
                                    offense_players: {
                                        [Op.and]: [
                                            { [Op.contains]: [req.query.player_id] },
                                            ...filters
                                        ]
                                    }
                                },
                                {
                                    pass_attempt: "1"
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
        
                    total_player_raw = await Plays.findAll({
                        attributes: [
                            req.query.breakoutby,
                            [Sequelize.fn('ARRAY_AGG', Sequelize.col('offense_players')), 'offense_players'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN air_yards = '' THEN 0
                                    ELSE CAST(air_yards AS INTEGER)
                                END`)), 'air_yards'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN receiving_yards = '' THEN 0
                                    ELSE CAST(receiving_yards AS INTEGER)
                                END`)), 'receiving_yards'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN complete_pass = '' THEN 0
                                    ELSE CAST(complete_pass AS INTEGER)
                                END`)), 'complete_pass'],
                            [Sequelize.fn('SUM', Sequelize.literal(`CASE
                                    WHEN touchdown = '' THEN 0
                                    ELSE CAST(touchdown AS INTEGER)
                                END`)), 'touchdown'],
                            [Sequelize.fn('ARRAY_AGG', Sequelize.col('game_id')), 'game_id']
                        ],
                        where: {
                            [Op.and]: [
                                {
                                    offense_players: {
                                        [Op.and]: [
                                            { [Op.contains]: [req.query.player_id] },
                                            ...filters
                                        ]
                                    }
                                },
                                {
                                    receiver_player_id: `${req.query.player_id}`
                                },
                                {
                                    pass_attempt: "1"
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
        
                    total_seasons = total_seasons_raw.filter(x => !x.offense_players?.includes(req.query.exclude))
                    total_player = total_player_raw.filter(x => !x.offense_players?.includes(req.query.exclude))
                }
        */
    } catch (err) {
        console.log(err.message)
    }

    let player_breakoutby;

    if (['aDot', 'season', 'passer_player_id', 'formation'].includes(req.query.breakoutby)) {
        try {
            player_breakoutby = await Plays.findAll({
                attributes: [
                    ...attributes,
                    req.query.breakoutby === 'aDot'
                        ? [Sequelize.literal(`CASE
                                WHEN air_yards = '' THEN 'Unknown'
                                WHEN CAST(air_yards AS INTEGER) < 5 THEN 'Under 5 Yd'
                                WHEN CAST(air_yards AS INTEGER) BETWEEN 5 AND 9 THEN '5-9 Yd'
                                WHEN CAST(air_yards AS INTEGER) BETWEEN 10 AND 14 THEN '10-14 Yd'
                                ELSE 'Over 15 Yd'
                            END`), 'air_yards_range']
                        : req.query.breakoutby === 'formation'
                            ? [Sequelize.literal(`CASE
                                WHEN offense_personnel = '' THEN 'Unknown'
                                WHEN offense_personnel LIKE '%1 WR%' THEN '1 WR'
                                WHEN offense_personnel LIKE '%2 WR%' THEN '2 WR'
                                WHEN offense_personnel LIKE '%3 WR%' THEN '3 WR'
                                WHEN offense_personnel LIKE '%4 WR%' THEN '4 WR'
                                ELSE 'Unknown'
                            END`), 'formation']
                            : req.query.breakoutby,
                ],
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
                            pass_attempt: "1"
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
                group: [
                    req.query.breakoutby === 'aDot'
                        ? [Sequelize.literal(`CASE
                                WHEN air_yards = '' THEN 'Unknown'
                                WHEN CAST(air_yards AS INTEGER) < 5 THEN 'Under 5 Yd' 
                                WHEN CAST(air_yards AS INTEGER) BETWEEN 5 AND 9 THEN '5-9 Yd'
                                WHEN CAST(air_yards AS INTEGER) BETWEEN 10 AND 14 THEN '10-14 Yd'
                                ELSE 'Over 15 Yd'
                            END`), 'air_yards_range']
                        : req.query.breakoutby === 'formation'
                            ? [Sequelize.literal(`CASE
                                WHEN offense_personnel = '' THEN 'Unknown'
                                WHEN offense_personnel LIKE '%1 WR%' THEN '1 WR'
                                WHEN offense_personnel LIKE '%2 WR%' THEN '2 WR'
                                WHEN offense_personnel LIKE '%3 WR%' THEN '3 WR'
                                WHEN offense_personnel LIKE '%4 WR%' THEN '4 WR'
                                ELSE 'Unknown'
                            END`), 'formation']
                            : req.query.breakoutby
                ],
                raw: true
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    let key;

    switch (req.query.breakoutby) {
        case 'aDot':
            key = 'air_yards_range'
            break;
        default:
            key = req.query.breakoutby
            break;
    }

    res.send({
        ...player_raw[0],
        ...req.query,
        player_id: req.query.player_id,
        player_breakoutby: player_breakoutby?.filter(x => x?.[key] !== 'Unknown')
    })
}
