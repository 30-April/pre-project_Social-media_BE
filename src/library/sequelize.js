const { Sequelize } = require("sequelize")
const database_config = require("../configs/database")

const sequelize = new Sequelize({
    username: database_config.MYSQL_USERNAME,
    password: database_config.MYSQL_PASSWORD,
    database: database_config.MYSQL_DB_NAME,
    port: database_config.MYSQL_PORT,
    dialect: "mysql"
})

// pembuatan models(tabel) pada MYSQL
const User = require("../models/user")(sequelize)
const Post = require("../models/post")(sequelize)
const Session = require("../models/session")(sequelize)
const Like = require("../models/likes")(sequelize)
const Comment = require("../models/comment")(sequelize)
const Token = require("../models/token")(sequelize)


// 1 : M database
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

Session.belongsTo(User, { foreignKey: "user_id"})
Session.hasMany(Session, { foreignKey: "user_id"})

//likes M : M
User.hasMany(Like, { foreignKey: "user_id" })
Like.belongsTo(User, { foreignKey: "user_id" })
Post.hasMany(Like, { foreignKey: "post_id" })
Like.belongsTo(Post, { foreignKey:"post_id" })

//comments M : M
User.hasMany(Comment, { foreignKey: "user_id" })
Comment.belongsTo(User, { foreignKey: "user_id" })
Post.hasMany(Comment, { foreignKey: "post_id" })
Comment.belongsTo(Post, { foreignKey: "post_id" })

module.exports = {
    sequelize,
    User,
    Post,
    Session,
    Like,
    Comment,
    Token
}