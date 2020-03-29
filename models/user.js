module.exports = (sequelize, Datatypes) => (
    // user -> users
    sequelize.define('user', {
        email: {
            type: Datatypes.STRING(40),
            allowNull: true,
            unique: true
        },
        nick: {
            type: Datatypes.STRING(10),
            allowNull: false
        },
        password: {
            type: Datatypes.STRING(100),
            allowNull: true
        },
        provider: {
            type: Datatypes.STRING(10),
            allowNull: false,
            defaultValue: 'local'
        },
        snsId: {
            type: Datatypes.STRING(30),
            allowNull: true
        }
    }, {
        timestamps: true,
        paranoid: true
    })
);