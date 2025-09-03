import {asyncHandler, ApiResponse, ErrorHandler, uploadCloudinary, deleteCloudinary} from "../helper/index.js";
import { Gallery, Artwork, Category, ArtworkAccess } from "../models/index.js";

export const createArtwork = asyncHandler(async(req, res, next) =>
{
    const {title, description, slug, visibility, tags, categoryId, galleryId, masterVersionId, } = req.body;
    const image = req.files.image;
    
    if(!image) return next(new ErrorHandler(400, "Image is required"));
    
    const result = await uploadCloudinary(image.tempFilePath);
    if(!result) return next(new ErrorHandler(400, "Failed to upload image"));
    
    const galleryExist = await Gallery.findById(galleryId);
    const masterVersionExist = await Artwork.findById(masterVersionId);
    const categoryExist = await Category.findById(categoryId);

    const newArtwork =await Artwork.create({
        artist: req.user._id,
        title, description, slug, visibility, tags,
        category: categoryExist == null ? null : categoryExist._id,
        galleries: galleryExist == null ? [] : [galleryExist._id],
        masterVersion:  masterVersionExist ? masterVersionExist._id : undefined,
        image: result.secure_url
    });

    if(masterVersionExist) {
        masterVersionExist.versions.push(newArtwork._id);
        await masterVersionExist.save();
    }
    
    if(galleryExist) {
        galleryExist.artworks.push(newArtwork._id);
        await galleryExist.save();
    }

    return res.status(200).json(new ApiResponse(200, newArtwork, "Artwork created successfully"));
});

export const getArtworkByIdSlug = asyncHandler(async(req, res, next) => {
    const {id, slug} = req.body;
    if(!id && !slug) return next(new ErrorHandler(400, "Artwork ID or slug is required"));

    const artworkExist = await Artwork.findOne({$or: [{_id: id}, {slug: slug}]});
    if(!artworkExist) return next(new ErrorHandler(404, "Artwork not found"));

    if(artworkExist.visibility == "private" && artworkExist.artist != req.user._id) return next(new ErrorHandler(403, "You are not authorized to view this artwork"));

    if(artworkExist.visibility == "protected" && artworkExist.artist != req.user._id){
        const artworkAccessExist = await ArtworkAccess.findOne({artwork: artworkExist._id, user: req.user._id});
        if(!artworkAccessExist) return next(new ErrorHandler(403, "You are not authorized to view this artwork"));
    }
    artworkExist.viewCount++;
    await artworkExist.save();

    return res.status(200).json(new ApiResponse(200, artworkExist, "Artwork fetched successfully"));
});

export const getArtworks = asyncHandler(async(req, res, next) => 
{
    const {page = 1, limit = 15, sort = -1, categoryId = null, galleryId = null, artistId = null, tags = [], visibility = "public"} = req.body;
    const skip = (page - 1) * limit;
    const query = {};

    if(categoryId) query.category = categoryId;
    if(galleryId) query.galleries = galleryId;
    if(artistId) query.artist = artistId;
    if(visibility) query.visibility = {$in: ["public", "protected"]};
    if(tags) query.tags = {$in: tags};
    
    let artworks = await Artwork.find(query).skip(skip).limit(limit).sort({createdAt: sort});

    if(visibility == "protected"){
        const artworkAccesses = await ArtworkAccess.find({artwork: {$in: artworks.map(artwork => artwork._id)}, user: req.user._id});
        artworks = artworks.filter(artwork => artworkAccesses.some(access => access.artwork == artwork._id || artwork.artist == req.user._id));
    }

    return res.status(200).json(new ApiResponse(200, artworks, "Artworks fetched successfully"));
});