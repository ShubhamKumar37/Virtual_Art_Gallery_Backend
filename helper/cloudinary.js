
const getPublicId = (filePath) =>
{
    if(filePath.includes("cloudinary")) return `{process.env.CLOUDINARY_FOLDER}/` + filePath.split("/").pop().split(".")[0];
    return null;
}

const uploadCloudinary = async (filePath) => 
{

}

const deleteCloudinary = async (filePath) => 
{

}

export { uploadCloudinary, deleteCloudinary };
