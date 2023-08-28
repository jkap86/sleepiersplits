module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define('players', {
        gsis_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        display_name: {
            type: Sequelize.TEXT
        },
        headshot: {
            type: Sequelize.TEXT
        },
        position: {
            type: Sequelize.STRING
        }
    })

    return Player;
}