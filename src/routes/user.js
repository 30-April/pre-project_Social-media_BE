const express = require("express");
const { userController } = require("../controller");
const { authorizedLoggedInUser } = require("../middleware/authMiddleware")
const router = express.Router();


router.post(`/login`, userController.login);
router.post("/register", userController.register);
router.patch("/verify/:vertoken",  userController.verifyUser);
router.get("/refresh-token", authorizedLoggedInUser, userController.keepLogin);
router.patch("/:id", userController.editProfile);
router.post("/new-link", userController.reVerifyLink )
router.get("/:id", userController.getUserById)
router.get("/", userController.getAllUsers)
router.post("/sendResetPassword", userController.emailResetPassword)
router.patch("/changePassword/:resetToken", userController.resetPassword)

module.exports = router