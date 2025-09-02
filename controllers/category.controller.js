import { asyncHandler, ApiResponse, ErrorHandler, uploadCloudinary, deleteCloudinary } from "../helper/index.js";
import { Category } from "../models/index.js";

export const createCategory = asyncHandler(async(req, res, next) => {
    const { name, description } = req.body;
    const image = req.files.image;
    if(!image) return next(new ErrorHandler(400, "Image is required"));
    
    const result = await uploadCloudinary(image.tempFilePath);
    if(!result) return next(new ErrorHandler(400, "Failed to upload image"));
    
    const category = await Category.create({ name, description, image: result.secure_url });
    return res.status(200).json(new ApiResponse(200, category, "Category created successfully"));
});

export const getAllCategories = asyncHandler(async(req, res, next) => {
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export const getCategoryById = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if(!category) return next(new ErrorHandler(404, "Category not found"));
    return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

export const updateCategory = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const updateOption = {};
    if(name) updateOption.name = name;
    if(description) updateOption.description = description;
    
    const category = await Category.findByIdAndUpdate(id, updateOption, { new: true });
    if(!category) return next(new ErrorHandler(404, "Category not found"));
    
    if(req.files && req.files.image) {
        const image = req.files.image;
        if(category.image) await deleteCloudinary(category.image);
        
        const result = await uploadCloudinary(image.tempFilePath);
        if(!result) return next(new ErrorHandler(400, "Failed to upload image"));
        category.image = result.secure_url;
    }

    await category.save();
    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if(!category) return next(new ErrorHandler(404, "Category not found"));
    
    if(category.image) await deleteCloudinary(category.image);
    return res.status(200).json(new ApiResponse(200, category, "Category deleted successfully"));
});
