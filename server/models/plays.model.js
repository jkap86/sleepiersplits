'use strict'

module.exports = (sequelize, Sequelize) => {
    const headers = [
        "offense_personnel",
        "offense_players",
        "week",
        "season",
        "air_yards",
        "interception",
        "rush_attempt",
        "pass_attempt",
        "sack",
        "touchdown",
        "pass_touchdown",
        "rush_touchdown",
        "complete_pass",
        "passer_player_id",
        "passing_yards",
        "receiver_player_id",
        "receiving_yards",
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
        "down"
    ]

    const Plays = sequelize.define('plays', {
        play_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        game_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        ...Object.fromEntries(headers.map(header => {
            if (['offense_players', 'defense_players'].includes(header)) {
                return [header, { type: Sequelize.ARRAY(Sequelize.STRING) }]
            } else {
                return [header, { type: Sequelize.TEXT }]
            }
        }))
    }, {
        indexes: [
            {
                name: 'index_1',
                fields: [
                    'offense_players',
                    'pass_attempt',
                    'season',
                    'week'
                ]
            },
            {
                name: 'index_2',
                fields: [
                    'receiver_player_id',
                    'receiving_yards',
                    'season',
                    'week'
                ]
            },
            {
                name: 'index_3',
                fields: [
                    'season',
                    'week',
                    'offense_players',
                    'pass_attempt',
                    'receiver_player_id',
                    'air_yards',
                    'receiving_yards',
                    'complete_pass',
                    'touchdown',
                    'game_id',

                ]
            }
        ]
    });

    return Plays;
}