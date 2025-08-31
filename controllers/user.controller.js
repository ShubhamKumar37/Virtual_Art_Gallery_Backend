import { asyncHandler, ErrorHandler, ApiResponse, uploadCloudinary, deleteCloudinary } from "../helper/index.js";
import { User } from "../models/index.js";

export const updateProfilePicture = asyncHandler(async(req, res, next) => {
    const {id} = req.user;
    const {profilePicture} = req.file;
    
    const user = await User.findById(id);
    if(user.profilePicture) await deleteCloudinary(user.profilePicture);

    const result = await uploadCloudinary(profilePicture.tempFilePath);
    if(!result) return next(new ErrorHandler(400, "Failed to upload profile picture"));
    user.profilePicture = result.secure_url;
    await user.save();
    
    return new ApiResponse(200, result.secure_url, "Profile picture updated successfully");
});
