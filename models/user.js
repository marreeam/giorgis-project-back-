const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,// username is required
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,// email is required
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // password is required
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true

});

module.exports = User;
