const express = require('express')
const router = express.Router()

const TokenController = require('../controller/token')

router.post("/:token", TokenController.addToken )
router.patch("/:token", TokenController.editToken )

module.exports = router