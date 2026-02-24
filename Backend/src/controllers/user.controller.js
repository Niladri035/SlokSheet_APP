const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})



async function followUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    if (followeeUsername == followerUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message: `You are already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername
    })

    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })

}

async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

async function updateProfileController(req, res) {
    const userId = req.user.id
    const { bio } = req.body

    console.log("Update Profile Request:", { userId, bio, hasFile: !!req.file })

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Update bio if provided
        if (bio !== undefined) {
            user.bio = bio
        }

        // Upload profile image if provided
        if (req.file) {
            console.log("Uploading file to ImageKit:", { fileName: `profile-${userId}`, fileSize: req.file.size })
            
            try {
                const file = await imagekit.files.upload({
                    file: await toFile(Buffer.from(req.file.buffer), 'file'),
                    fileName: `profile-${userId}`,
                    folder: "cohort-2-insta-clone-profiles"
                })

                console.log("ImageKit upload successful:", file.url)
                user.profileImage = file.url
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError.message)
                return res.status(500).json({
                    message: "Failed to upload image",
                    error: uploadError.message
                })
            }
        }

        await user.save()

        console.log("Profile updated successfully for user:", userId)

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage,
                isPrivate: user.isPrivate
            }
        })
    } catch (error) {
        console.error("Update profile error:", error.message)
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        })
    }
}

async function getMeController(req, res) {
    const userId = req.user.id

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage,
                isPrivate: user.isPrivate
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        })
    }
}


module.exports = {
    followUserController,
    unfollowUserController,
    updateProfileController,
    getMeController
}