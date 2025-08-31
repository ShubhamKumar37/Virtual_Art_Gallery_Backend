import fs from "fs";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

const cleanUpTempFile = async (filePath) =>
{
    try{
        await fs.unlinkAsync(filePath);
        console.log("Temp file deleted successfully");
    }
    catch(error){
        console.log(error);
    }
}

const getPublicId = (filePath) =>
{
    if(filePath.includes("cloudinary")) return `{process.env.CLOUDINARY_FOLDER}/` + filePath.split("/").pop().split(".")[0];
    if(filePath.includes("https://")) return filePath.split("/").pop().split(".")[0];
    return null;
}

const uploadCloudinary = async (filePath, quality = 90, width = 1000, height = 1000) => 
{
    try{
        const result = await cloudinary.uploader.upload(filePath, {
            quality,
            width,
            height,
            folder: process.env.CLOUDINARY_FOLDER
        });
        console.log("This is the result of the uploadCloudinary", result);
        await cleanUpTempFile(filePath);
        return result;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const deleteCloudinary = async (fileUrl) => 
{
    try{
        const publicId = getPublicId(fileUrl);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("This is the result of the deleteCloudinary", result);
        return result;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

export { uploadCloudinary, deleteCloudinary };
