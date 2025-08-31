import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    artwork: {type: mongoose.Schema.Types.ObjectId, ref: "Artwork"},
    comment: {type: String, required: true},
    likeCount: {type: Number, default: 0},
    reportCount: {type: Number, default: 0},
    isBanned: {type: Boolean, default: false},
    bannedReason: {type: String, default: null},
    bannedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
},{ timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;