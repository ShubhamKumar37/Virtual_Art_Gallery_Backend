import { asyncHandler, ErrorHandler } from "../helper/index.js";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return next(new ErrorHandler(401, "Unauthorized"));
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return next(new ErrorHandler(401, "Token is invalid"));
    }
});

export const hasArtistRole = asyncHandler(async(req, res, next) => {
    const {role} = req.user;
    if(role !== "artist" || role !== "admin") return next(new ErrorHandler(403, "You are not authorized to access this resource you are not even artist"));
    next();
});

export const hasAdminRole = asyncHandler(async(req, res, next) => {
    const {role} = req.user;
    if(role !== "admin") return next(new ErrorHandler(403, "You are not authorized to access this resource you are not even admin"));
    next();
});