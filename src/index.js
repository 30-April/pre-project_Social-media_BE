const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const { postRoutes, userRoutes, likeRoutes, avatarRoutes, commentRoutes, tokenRoutes } = require("./routes")

dotenv.config();
const PORT = process.env.PORT
const { sequelize } = require("./library/sequelize");
// sequelize.sync({alter: true})

const app  = express();

app.use(cors())
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/like", likeRoutes);
app.use("/avatar", avatarRoutes);
app.use("/comment", commentRoutes);
app.use("/token", tokenRoutes);


app.use("/post_images", express.static(`${__dirname}/public/post_images`));
app.use("/avatar_images", express.static(`${__dirname}/public/avatar_images`));

app.get("/", (req, res) => {
    res.send("API is Running")
})

app.listen(PORT, () =>{
    console.log("server is running in port : " + PORT)
})

