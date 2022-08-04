const express = require('express')
const router = express.Router()

const likeController = require("../controller/like")

router.post("/", likeController.addLike)
router.get("/:user_id", likeController.getUserLike)

module.exports = router