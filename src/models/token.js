const { DataTypes } = require("sequelize");

const Token = (sequelize) => {
  return sequelize.define("Tokens", {
    token: {
      type: DataTypes.STRING,
    },
    valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiresIn: {
      type: DataTypes.DATE
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          isEmail : true
      }
      },
  });
};

module.exports = Token;