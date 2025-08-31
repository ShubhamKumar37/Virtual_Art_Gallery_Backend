import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    profilePicture: { type: String, default: null },
    role: { type: String, enum: ["admin", "user", "artist"], default: "user" },
    bio: { type: String, default: null },
    interests: { type: [String], default: null },
    favoriteGallery: {type: [mongoose.Schema.Types.ObjectId], ref: "Gallery", default: []},
    favoriteArtwork: {type: [mongoose.Schema.Types.ObjectId], ref: "Artwork", default: []},
    favoriteArtist: {type: [mongoose.Schema.Types.ObjectId], ref: "User", default: []},
    topArtworks: {type: [mongoose.Schema.Types.ObjectId], ref: "Artwork", default: []},

    isBanned: { type: Boolean, default: false },
    bannedTill: { type: Date, default: null },
    banReason: { type: String, default: null },
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    token: { type: String, default: null }, 

},{ timestamps: true });

userSchema.pre("save", async function(next){
    if(this.isNew) this.profilePicture = `https://ui-avatars.com/api/?name=${this.name}`;

    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;