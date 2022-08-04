const express = require('express')
const commentController = require('../controller/comment')
const router = express.Router()

router.get('/:post_id', commentController.fetchComment)
router.post('/', commentController.addComment)

module.exports = router