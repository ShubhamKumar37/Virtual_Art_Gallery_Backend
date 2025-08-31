import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    artwork: {type: mongoose.Schema.Types.ObjectId, ref: "Artwork"},
    comment: {type: mongoose.Schema.Types.ObjectId, ref: "Comment"},
},{ timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
