const { Comment, User } = require("../library/sequelize");

const commentController = {
    fetchComment: async (req,res) =>{
        
        const { post_id } = req.params

        try {

            const getComment = await Comment.findAll({
                where : {
                    post_id,
                },
                
                include: [User]
            })


            return res.status(200).json({
                message: `fatched all the comment from post_id = ${post_id}`,
                result: getComment,
            })

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },
    addComment: async (req, res) => {
        const { comment, post_id, user_id } = req.body
        try {
           const data=  await Comment.create({
                comment,
                post_id,
                user_id
            })

            const newcom = await Comment.findByPk(data.id, {include: User})
    
            return res.status(200).json({
                message: "new comment has been added",
                newcom
            })

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
        
    }
}

module.exports = commentController