const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")
const commentModel = require("../models/comment.model")
const saveModel = require("../models/save.model")
const userModel = require("../models/user.model")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req, res) {

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}

async function getPostController(req, res) {



    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })

}

async function getPostDetailsController(req, res) {


    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched  successfully.",
        post
    })

}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post liked successfully.",
        like
    })

}

async function getFeedController(req, res) {

    const user = req.user

    const posts = await Promise.all((await postModel.find().populate("user").lean())
        .map(async (post) => {

            /**
             * typeof post => object
             */

            const isLiked = await likeModel.findOne({
                user: user.username,
                post: post._id
            })

            post.isLiked = Boolean(isLiked)

            return post
        }))



    res.status(200).json({
        message: "posts fetched successfully.",
        posts
    })
}

async function unlikePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const like = await likeModel.findOneAndDelete({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post unliked successfully.",
        like
    })
}

async function createCommentController(req, res) {
    const userId = req.user.id
    const postId = req.params.postId
    const { text } = req.body

    if (!text) {
        return res.status(400).json({
            message: "Comment text is required"
        })
    }

    const post = await postModel.findById(postId)
    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const comment = await commentModel.create({
        text,
        post: postId,
        user: userId
    })

    await comment.populate("user", "username profileImage")

    res.status(201).json({
        message: "Comment created successfully.",
        comment
    })
}

async function getCommentsController(req, res) {
    const postId = req.params.postId

    const comments = await commentModel.find({ post: postId })
        .populate("user", "username profileImage")
        .sort({ createdAt: -1 })

    res.status(200).json({
        message: "Comments fetched successfully.",
        comments
    })
}

async function deleteCommentController(req, res) {
    const userId = req.user.id
    const commentId = req.params.commentId

    const comment = await commentModel.findById(commentId)
    if (!comment) {
        return res.status(404).json({
            message: "Comment not found."
        })
    }

    if (comment.user.toString() !== userId) {
        return res.status(403).json({
            message: "You can only delete your own comments."
        })
    }

    await commentModel.findByIdAndDelete(commentId)

    res.status(200).json({
        message: "Comment deleted successfully."
    })
}

async function savePostController(req, res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    try {
        const save = await saveModel.create({
            post: postId,
            user: userId
        })

        res.status(201).json({
            message: "Post saved successfully.",
            save
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Post already saved."
            })
        }
        throw error
    }
}

async function unsavePostController(req, res) {
    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    await saveModel.findOneAndDelete({
        post: postId,
        user: userId
    })

    res.status(200).json({
        message: "Post unsaved successfully."
    })
}

async function getSavedPostsController(req, res) {
    const userId = req.user.id

    const saves = await saveModel.find({ user: userId })
        .populate({
            path: "post",
            populate: { path: "user" }
        })
        .sort({ createdAt: -1 })

    const posts = saves.map(save => save.post)

    res.status(200).json({
        message: "Saved posts fetched successfully.",
        posts
    })
}

async function togglePrivateAccountController(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId)
    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }

    user.isPrivate = !user.isPrivate
    await user.save()

    res.status(200).json({
        message: `Account is now ${user.isPrivate ? "private" : "public"}.`,
        isPrivate: user.isPrivate
    })
}

async function getOwnFeedController(req, res) {
    const userId = req.user.id

    const posts = await postModel.find({ user: userId })
        .populate("user")
        .sort({ createdAt: -1 })

    const postsWithLikes = await Promise.all(posts.map(async (post) => {
        const isLiked = await likeModel.findOne({
            user: req.user.username,
            post: post._id
        })

        const isSaved = await saveModel.findOne({
            user: userId,
            post: post._id
        })

        const commentCount = await commentModel.countDocuments({ post: post._id })

        return {
            ...post.toObject(),
            isLiked: Boolean(isLiked),
            isSaved: Boolean(isSaved),
            commentCount
        }
    }))

    res.status(200).json({
        message: "Own feed fetched successfully.",
        posts: postsWithLikes
    })
}


module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unlikePostController,
    createCommentController,
    getCommentsController,
    deleteCommentController,
    savePostController,
    unsavePostController,
    getSavedPostsController,
    togglePrivateAccountController,
    getOwnFeedController
}