const { DataTypes } = require("sequelize");

const User = (sequelize) =>{
    return sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail : true
            },
            unique: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.STRING,
        },
        bio: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        website: {
            type: DataTypes.STRING,
        },
        phone_number: {
            type: DataTypes.INTEGER,
        },
        gender: {
            type: DataTypes.STRING,
        }
    })
}

module.exports = User;