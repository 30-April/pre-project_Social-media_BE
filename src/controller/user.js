const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { User, Token } = require("../library/sequelize");
const moment = require("moment");
const mailer = require("../library/mailer");
const sharp = require("sharp");
const mustache = require('mustache');
const fs = require("fs");
const { generateToken, verifyToken } = require("../library/jwt");

async function SendVerification(id, email, username, full_name) {
    const vertoken = await generateToken({id , isEmailVerification : true}, "180s");
    
    const verificationLink = `http://localhost:3000/auth/verify/${vertoken}`
    const template = fs.readFileSync(__dirname + "/../template/verify.html").toString()

    const renderTemplate = mustache.render(template, {
        username,
        verify_url: verificationLink,
        full_name,
    })

    await Token.create({
        token: vertoken,
        email,
        expiresIn: moment().add(180, 'seconds')
    })

    await mailer({
        to: email,
        subject: "Verify your social media account",
        html: renderTemplate
    })
    return vertoken
}

async function SendResetPassword(email) {
    const vertoken = await generateToken({email , isEmailVerification : true}, "180s");
    
    const verificationLink = `http://localhost:3000/auth/resetPassword/${vertoken}`
    const template = fs.readFileSync(__dirname + "/../template/forgot.html").toString()

    const renderTemplate = mustache.render(template, {
        email,
        forgot_password_url: verificationLink,
    })

    
    await Token.create({
        token:vertoken,
        email,
        expiresIn: moment().add(180, 'seconds')
    })


    await mailer({
        to: email,
        subject: "Reset your password",
        html: renderTemplate
    })
    return vertoken
}

const userController = {
    login: async (req, res) =>{
        try{
            const { username, password, email } = req.body;

            const user = await User.findOne({
                where: {
                    [Op.or]: [{username}, {email}],
                },
            })

            if(!user){
                throw new Error("username/email/password not found");
            }

            const checkPass = await bcrypt.compareSync(password, user.password);
            if(!checkPass){
                throw new Error("username/email/password not found")
            }
            const token = generateToken({ id: user.id });

            delete user.dataValues.password;
            delete user.dataValues.createAt;
            delete user.dataValues.updateAt;

            console.log(user)

            res.status(200).json({
                message : "Login succed",
                result : { user, token },
            })

        } catch (err){
            console.log(err)
            res.status(400).json({
                message: err.toString(),
            });
        }
    },

    register: async (req, res) =>{
        try {
            const { username, password, full_name, email } = req.body;
            
            
            const findUser = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }],
                },
            });

            const arrcek = await Token.findAll({ where : {
                email
            }})
            console.log(arrcek)

            if(arrcek.length){

                await Token.update({valid : false}, {where : {email}})
                
            }
    
            console.log(findUser);
    
            const hashedPassword = bcrypt.hashSync(password, 5);
    
            const user = await User.create({
                username,
                password: hashedPassword,
                full_name,
                email,
            });
    
            const token = await generateToken({ id: user.id, isEmailVerification : true });
            const verToken = await SendVerification(user.id, email, username, full_name)
            
            return res.status(200).json({
                message: "user has been created successfully",
                result: { user, token, verToken },
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: err.toString(),
            });
        }
    },

    editProfile: async (req, res) => {
        try {
            const { id } = req.params;
            
            await User.update(
                {
                    ...req.body
                },
                {
                    where: {
                        id : id,
                    },
                }
            );
            const user = await User.findByPk(id)
        
            return res.status(200).json({
                message: "profile edited",
                user: user
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error edit",
            });
        }
    },

    //--------------- Forget Password --------------- // 
    emailResetPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const arrcek = await Token.findAll({ where : {
                email
            }})

            if(arrcek.length){

                await Token.update({valid : false}, {where : {email}})
                
            }

            const resetToken = await SendResetPassword(email)

            return res.status(200).json({
                message: "Reset password link has been send",
                result :  resetToken
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Error",
            });
        }
    },

    verifyResetToken : async (res,req) => {
        try{
            const { resetToken } = req.params
            console.log(resetToken);
      
            const isTokenVerified = verifyToken(resetToken, process.env.JWT_SECRET_KEY)
      
            if(!isTokenVerified || !isTokenVerified.isEmailVerification){
                throw new Error("token is invalid")
            }
            
            return res.status(200).json({
                message: "Token Reset Pass",
                success: true,
            })

        }catch(err) {
            console.log(err);
            res.status(400).json({
              message: err.toString(),
              success: false
            })
        }
    },

    resetPassword: async (req, res) => {
        try{
            const { resetToken } = req.params;
            const { password } = req.body;

            console.log(resetToken);
            const isTokenVerified = verifyToken(resetToken, process.env.JWT_SECRET_KEY)
      
            if(!isTokenVerified || !isTokenVerified.isEmailVerification){
                throw new Error("token is invalid")
            }
            
            const hashedPassword = bcrypt.hashSync(password, 5);

            await User.update({password: hashedPassword,},
                {where: {email: isTokenVerified.email}} 
            );
      
            return res.status(200).json({
                message: "Success change password",
            })
        }catch(err) {
            console.log(err);
            res.status(400).json({
                message: err.toString(),
                success: false
            })
        }
    },

    keepLogin: async (req,res) =>{
        try {
            const { token } = req;
            const renewedToken = generateToken({ id: token.id, password: token.password });
      
            const findUser = await User.findByPk(token.id);
      
            delete findUser.dataValues.password;
      
            return res.status(200).json({
                message: "Renewed user token",
                result: {
                    user: findUser,
                    token: renewedToken,
                },
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
              message: err.toString(),
            });
        }
    },
    //-----xxxxx----- Forget Password -----xxxxx-----//
    
    verifyUser: async (req,res) => {
        try{
            const { vertoken } = req.params

            const isTokenVerified= verifyToken(vertoken, process.env.JWT_SECRET_KEY)

            console.log(isTokenVerified.id)
            console.log(vertoken)
       
            if(!isTokenVerified || !isTokenVerified.isEmailVerification){
              throw new Error("token is invalid")
            }
            await User.update(
                { is_verified: true}, 
                {
                    where: {
                        id: isTokenVerified.id
                    }
                })
      
            return res.status(200).json({
              message: "User is Verified",
              success:  true
            })
      
        } catch(err) {
            console.log(err);
            res.status(400).json({
              message: err.toString(),
              success : false
            })
        }      
    },

    reVerifyLink : async (req,res) => {
        try {
            const { username, id, email, full_name } = req.body;

            const arrcek = await Token.findAll({ where : {
                email
            }})
            console.log(arrcek)

            if(arrcek.length){

                await Token.update({valid : false}, {where : {email}})
                
            } 
            
            const token = await generateToken({ id, isEmailVerification : true });
    
            const verToken = await SendVerification(id, email, username, full_name)

            return res.status(200).json({
                message: "new link has benn send to your email",
                result : {
                    token,
                    verToken
                }
            })
        } catch (err) {
            console.log(err);
            res.status(400).json({
              message: err.toString(),
            })  
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;

            const findUser = await User.findOne({
                where: {
                    id,
                }
            })
            
            return res.status(200).json({
                message: "fetched data user id :" + id,
                result : findUser
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.toString(),
            });
        }
    },
    
    getAllUsers: async (req, res) =>{
        try {

            const findUser = await User.findAll({
                attributes: ['username', 'email'],
                raw:true
            })

            const usernames = findUser.map(user => user.username);
            const emails = findUser.map(user => user.email);
            
            return res.status(200).json({
                message: "fetched all data users",
                result : {usernames, emails }
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.toString(),
            });
        }
    }

}

module.exports = userController