const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/auth.middleware")


/**
 * @route POST /api/posts [protected]
 * @description Create a post with the content and image (optional) provided in the request body. The post should be associated with the user that the request come from
 */
postRouter.post("/", upload.single("chacha"), identifyUser, postController.createPostController)


/**
 * @route GET /api/posts/ [protected]
 * @description Get all the posts created by the user that the request come from. also return the total number of posts created by the user
 */
postRouter.get("/", identifyUser, postController.getPostController)


/**
 * @route GET /api/posts/details/:postid
 * @description return an detail about specific post with the id. also check whether the post belongs to the user that the request come from
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params. 
 */
postRouter.post("/like/:postId", identifyUser, postController.likePostController)


/**
 * @route DELETE /api/posts/unlike/:postid
 * @description unlike a post with the id provided in the request params. 
 */
postRouter.delete("/unlike/:postId", identifyUser, postController.unlikePostController)


/**
 * @route POST /api/posts/comment/:postid
 * @description create a comment on a post
 */
postRouter.post("/comment/:postId", identifyUser, postController.createCommentController)


/**
 * @route GET /api/posts/comments/:postid
 * @description get all comments for a post
 */
postRouter.get("/comments/:postId", identifyUser, postController.getCommentsController)


/**
 * @route DELETE /api/posts/comment/:commentid
 * @description delete a comment
 */
postRouter.delete("/comment/:commentId", identifyUser, postController.deleteCommentController)


/**
 * @route POST /api/posts/save/:postid
 * @description save a post
 */
postRouter.post("/save/:postId", identifyUser, postController.savePostController)


/**
 * @route DELETE /api/posts/unsave/:postid
 * @description unsave a post
 */
postRouter.delete("/unsave/:postId", identifyUser, postController.unsavePostController)


/**
 * @route GET /api/posts/saved
 * @description get all saved posts
 */
postRouter.get("/saved/posts", identifyUser, postController.getSavedPostsController)


/**
 * @route PUT /api/posts/privacy
 * @description toggle private/public account
 */
postRouter.put("/privacy/toggle", identifyUser, postController.togglePrivateAccountController)


/**
 * @route GET /api/posts/feed
 * @description get all the post created in the DB
 * @access private
 */
postRouter.get("/feed", identifyUser, postController.getFeedController)


/**
 * @route GET /api/posts/own-feed
 * @description get own feed (user's own posts)
 * @access private
 */
postRouter.get("/own-feed", identifyUser, postController.getOwnFeedController)




/**
 * @route DELETE /api/posts/:postId
 * @description delete a post and associated likes/comments/saves
 * @access private
 */
postRouter.delete("/:postId", identifyUser, postController.deletePostController)

module.exports = postRouter