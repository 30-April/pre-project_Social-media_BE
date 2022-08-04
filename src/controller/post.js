const { Post, User, Comment, Like } = require("../library/sequelize")


const postController = {
    getAllPost: async (req,res) =>{
        try{
            const findPost = await Post.findAll({
                limit : 5,
                offset : 0,
                include: [User, Like,  {model : Comment, include: [User]}],
                order : [["createdAt", "DESC"]]
            })
            
            return res.status(200).json({
                message: "fatched all the post",
                result: findPost,
            })
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    getPostByUser: async (req,res) =>{
        try{
            const { user_id } = req.params

            const findUserPost = await Post.findAll(
                {
                    where: {
                        user_id
                    },

                    order : [["createdAt", "DESC"]]
                }
            )

            return res.status(200).json({
                message: `fatched all the post from user_id = ${user_id}`,
                result: findUserPost,
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    getPostById: async (req,res) =>{
        try{
            const { post_id } = req.params

            const findPost = await Post.findOne(
                {
                    where: {
                        id : post_id,
                    },

                    include: [User, Like,  {model : Comment, include: [User]}],
                }
            )

            return res.status(200).json({
                message: `fatched the post from post_id = ${post_id}`,
                result: findPost
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    postPagination: async (req,res) => {
        try{
            const { limit = 5, page = 1 } = req.query

            const findPost = await Post.findAll({
                offset: (page - 1) * limit,
                limit: limit? parseInt(limit) : undefined,
                include: [User, Like,  {model : Comment, include: [User]}],
                order : [["createdAt", "DESC"]]
            })

            return res.status(200).json({
                message: "fetching data for pagination",
                result: findPost,
            })

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    addPost: async (req,res) =>{
        try {
            const { user_id, caption, location} = req.body;
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
            const filePath = process.env.PATH_POST;
            const { filename } = req.file;

            await Post.create({
                image_url : `${uploadFileDomain}/${filePath}/${filename}`,
                caption,
                location, 
                user_id,
            })

            return res.status(200).json({
                message: "new post edded",
            });

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    deletePost: async (req,res) =>{
        try{
            const { post_id } = req.params;
            
            await Like.destroy({
                where: {
                    post_id: post_id,
                }
            })
            
            await Post.destroy({
                where: {
                    id: post_id,
                }
            })

            // kok dia ga mau ngikut delet di tabel like yak?

            return res.status(500).json({
                message: "post has been deleted"
            })
        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },

    editPost: async (req,res) =>{
        try{
            const { post_id } = req.params
            
            await Post.update(
                {
                    ...req.body,    
                }, {
                    where: {
                        id: post_id,
                    }
                }
            )

            return res.status(200).json({
                message: "post edited succesfully"
            })
        } catch (err){
            console.log(err)
            return res.status(500).json({
                message : err.toString()
            })
        }
    }
}

module.exports = postController;