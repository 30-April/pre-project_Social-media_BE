const { User } = require("../library/sequelize");


const avatarController = {
    updateAvatar : async (req, res) =>{
        try {
            const { id } = req.params
            const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
            const filePath = process.env.PATH_AVATAR
            const { filename } = req.file

            await User.update(
                {
                    avatar_url : `${uploadFileDomain}/${filePath}/${filename}`,
                },
                {
                    where: {
                        id,
                    }
                }

            )
            
            const user = await User.findByPk(id) //auto rendering data setelah diubah

            return res.status(200).json({
                message: "new post edded",
                user: user
            });
                
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    }
}

module.exports = avatarController