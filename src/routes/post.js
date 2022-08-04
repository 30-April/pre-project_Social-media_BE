const express = require("express");
const { postController } = require("../controller");
const router = express.Router();
const fileUploader = require('../library/uploader')


router.get("/", postController.getAllPost);
router.get("/data", postController.postPagination)

router.get("/:user_id", postController.getPostByUser)
router.get("/detail/:post_id", postController.getPostById)
router.post(
    "/", 
    fileUploader({
        destinationFolder: "post_images",
        fileType: "image",
        prefix: "POST",
    }).single("image"),
    postController.addPost
);  
router.patch("/:post_id", postController.editPost);
router.delete("/:post_id", postController.deletePost)

module.exports = router