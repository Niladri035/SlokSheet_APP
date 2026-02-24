const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Comment text is required"]
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, "Post ID is required for commenting"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required for commenting"]
    }
}, {
    timestamps: true
});

const commentModel = mongoose.model("comments", commentSchema);

module.exports = commentModel;
