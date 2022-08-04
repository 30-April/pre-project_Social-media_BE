const { Op } = require("sequelize")
const { Like, Post, User } = require("../library/sequelize")


const likeController = {
    addLike: async (req,res) => {
        try {
            const { user_id, post_id } = req.body
            console.log("test masuk add")
            const resLike = await Like.findOne({
                where: {
                    [Op.and]:{
                        user_id, 
                        post_id,
                    }
                }
            })

            const resPost = await Post.findOne({
                where: {
                    id : post_id
                }
            })

            console.log(resLike);

            if (resLike) {
                await Like.destroy({
                    where: {
                        id: resLike.dataValues.id,
                    }
                })

                await Post.update(
                    {
                        number_of_likes: resPost.dataValues.number_of_likes - 1,
                    },
                    {
                        where: { id: post_id }
                    }
                )
    
                return res.status(200).json({
                    message: "post unliked",
                })
            }

            await Like.create({
                user_id,
                post_id,
            })

            await Post.update(
                {
                    number_of_likes: resPost.dataValues.number_of_likes + 1,
                },
                {
                    where: { id: post_id }
                }
            )

            return res.status(200).json({
                message: "post liked"
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: err.toString()
            })
        }
    },
    getUserLike : async (req,res) => {
        try{
            let { user_id } = req.params
            const findLike = await Like.findAll(
                {
                    where : {
                        user_id
                    },
                    include: [Post],
                    order : [["createdAt", "DESC"]]
                }
            )
            return res.status(200).json({
                message: "fatched all the post that liked by user_id :" + user_id,
                result: findLike,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    }
}

module.exports = likeController