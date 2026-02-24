const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, "Post ID is required for saving"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required for saving"]
    }
}, {
    timestamps: true
});

saveSchema.index({ post: 1, user: 1 }, { unique: true });

const saveModel = mongoose.model("saves", saveSchema);

module.exports = saveModel;
