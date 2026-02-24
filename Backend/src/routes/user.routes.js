const express = require('express');
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

const userRouter = express.Router();

/**
 * @route GET /api/users/test
 * @description Test endpoint
 */
userRouter.get("/test", (req, res) => {
    res.status(200).json({ message: "User routes working!" })
})


/**
 * @route POST /api/users/follow/:userid
 * @description Follow a user
 * @access Private
 */
userRouter.post("/follow/:username", identifyUser, userController.followUserController)


/** 
 * @route POST /api/users/unfollow/:userid
 * @description Unfollow a user
 * @access Private
 */
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)


/**
 * @route PUT /api/users/profile
 * @description Update user profile (bio and profile image)
 * @access Private
 */
userRouter.put("/profile", upload.single("profileImage"), identifyUser, userController.updateProfileController)


/**
 * @route GET /api/users/me
 * @description Get current user info
 * @access Private
 */
userRouter.get("/me", identifyUser, userController.getMeController)




module.exports = userRouter;