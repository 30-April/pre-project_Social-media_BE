const { Comment, User, Token } = require("../library/sequelize");

const TokenController = {
    addToken: async (req,res) =>{
        const { token } = req.params

        try {
            const newToken = await Token.create({
                where : {
                    token,
                },
            })

            return res.status(200).json({
                message: `new token has been edited`,
                result: newToken,
            })

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
    },
    editToken: async (req, res) => {
        const { token } = req.params
        console.log("halo111")

        console.log(token)
        try {
            console.log("halo111")

            await Token.update(
                {
                    valid: false,
                },
                {
                where: {
                    token : token
                }
                }
            )
            // console.log("halo")


            return res.status(200).json({
                message: "updated validation token's",
            })

        } catch (err){
            console.log(err)
            return res.status(500).json({
                message: err.toString()
            })
        }
        
    }
}

module.exports = TokenController