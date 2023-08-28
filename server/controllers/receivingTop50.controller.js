'use strict'

const db = require('../models');
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;
const Plays = db.plays;

exports.top50 = async (req, res) => {
    const topwr = await Plays.findAll({
        attributes: [
            'receiver_player_id',
            req.query.statistic === 'targets'
                ? [Sequelize.fn('COUNT', Sequelize.col('game_id')), 'targets']
                : [Sequelize.fn('SUM', Sequelize.literal(`CASE
                        WHEN ${req.query.statistic} = '' THEN 0
                        ELSE CAST(${req.query.statistic} AS INTEGER)
                    END`)), req.query.statistic]
        ],
        order: [[req.query.statistic, 'DESC']],
        limit: 50,
        where: {
            [Op.and]: [
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
                },
                {
                    receiver_player_id: { [Op.like]: '%-%' }
                }
            ]
        },
        group: ['receiver_player_id'],
        raw: true
    })

    const total = await Plays.findAll({
        attributes: [
            'receiver_player_id',
            [Sequelize.fn('SUM', Sequelize.literal(
                `CASE
                    WHEN air_yards = '' THEN 0
                    ELSE CAST(air_yards AS INTEGER)
                END`
            )), 'air_yards'],
            [Sequelize.fn('SUM', Sequelize.literal(
                `CASE
                    WHEN receiving_yards = '' THEN 0
                    ELSE CAST(receiving_yards AS INTEGER)
                END`
            )), 'receiving_yards'],
            [Sequelize.fn('SUM', Sequelize.literal(
                `CASE
                    WHEN complete_pass = '' THEN 0
                    ELSE CAST (complete_pass AS INTEGER)
                END`
            )), 'complete_pass'],
            [Sequelize.fn('SUM', Sequelize.literal(
                `CASE
                    WHEN touchdown = '' THEN 0
                    ELSE CAST (touchdown AS INTEGER)
                END`
            )), 'touchdowns'],
            [Sequelize.fn('COUNT', Sequelize.col('game_id')), 'targets'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('game_id'))), 'game_id']
        ],
        where: {
            [Op.and]: [
                {
                    offense_players: {
                        [Op.or]: topwr.map(wr => {
                            return { [Op.contains]: [wr.receiver_player_id] }
                        })
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
        group: ['receiver_player_id'],
        raw: true
    })

    const top_ids = topwr.map(wr => wr.receiver_player_id)

    const topwr_details = [];

    for (const wr of total.filter(t => top_ids.includes(t.receiver_player_id))) {
        /*
        const routes = await s2022.count({
            where: {
                [Op.and]: [
                    {
                        offense_players: {
                            [Op.like]: `%${wr.receiver_player_id}%`
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
            raw: true
        })
*/
        topwr_details.push({
            ...wr,
            //  routes: routes
        })
    }

    res.send({
        ...req.query,
        top50: topwr_details
            .sort((a, b) => b[req.query.statistic] - a[req.query.statistic]),

    })
}