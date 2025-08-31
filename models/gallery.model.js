import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    artworks: {type: [mongoose.Schema.Types.ObjectId], ref: "Artwork", default: []},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    thumbnail: {type: String, default: null},
    visibility: {type: String, enum: ["public", "private", "protected"], default: "public"},
},{ timestamps: true });

gallerySchema.pre("save", async function(next){
    if(this.isNew) this.thumbnail = `https://ui-avatars.com/api/?name=${this.name}`;
    next();
});
const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;