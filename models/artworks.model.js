import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema({
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    visibility: { type: String, enum: ["public", "private", "draft", "protected"], default: "draft" },
    versions : {type: [mongoose.Schema.Types.ObjectId], ref: "Artwork"},
    masterVersion: {type: mongoose.Schema.Types.ObjectId, ref: "Artwork", index: true},
    tags: {type: [String], default: []},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null},

    likeCount: {type: Number, default: 0},
    viewCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0},

    galleries: {type:[mongoose.Schema.Types.ObjectId], ref: "Gallery", required: true, default: []},
    reportCount: {type: Number, default: 0},
    isBanned: {type: Boolean, default: false},
    bannedReason: {type: String, default: null},
    bannedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},

},{ timestamps: true });

artworkSchema.pre("save", function(next) {
    if (!this.masterVersion) this.masterVersion = this._id;
    next();
});

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;
