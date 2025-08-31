import mongoose from "mongoose";

const galleryAccessSchema = new mongoose.Schema({
    gallery: {type: mongoose.Schema.Types.ObjectId, ref: "Gallery", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    accessType: {type: String, enum: ["viewer", "editor", "admin"], default: "viewer"},
    accessReason: {type: String, default: null},
    accessBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    expiresAt: {type: Date, default: Date.now() + 30 * 24 * 60 * 60 * 1000},
},{ timestamps: true });

const GalleryAccess = mongoose.model("GalleryAccess", galleryAccessSchema);

export default GalleryAccess;