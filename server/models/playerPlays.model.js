
module.exports = (sequelize, Sequelize) => {
    const PlayerPlays = sequelize.define('PlayerPlays', {
        play_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'plays',
                key: 'play_id'
            }
        },
        game_id: {
            type: Sequelize.STRING,
            allowNull: false, references: {
                model: 'plays',
                key: 'game_id'
            }
        },
        gsis_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'players',
                key: 'gsis_id'
            }
        }
    });

    PlayerPlays.removeAttribute('id');

    return PlayerPlays
}