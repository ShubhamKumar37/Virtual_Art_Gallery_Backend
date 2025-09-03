import mongoose from "mongoose";

const artworkAccessSchema = new mongoose.Schema({
    artwork: {type: mongoose.Schema.Types.ObjectId, ref: "Artwork", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    accessType: {type: String, enum: ["viewer", "editor", "admin"], default: "viewer"},
    accessReason: {type: String, default: null},
    accessBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
},{ timestamps: true });

const ArtworkAccess = mongoose.model("ArtworkAccess", artworkAccessSchema);
export default ArtworkAccess;