const { DataTypes } = require("sequelize");

const Comment = (sequelize) => {
  return sequelize.define("Comment", {
    comment: {
      type: DataTypes.STRING(300),
    },
  });
};

module.exports = Comment;