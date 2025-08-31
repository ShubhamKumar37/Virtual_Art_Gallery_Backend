import { asyncHandler, ErrorHandler, ApiResponse, sendMail } from "../helper/index.js";
import { resetPasswordTemplate, newUserTemplate } from "../helper/emailTemplates.js";
import { User, Otp } from "../models/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const sendOtp = asyncHandler(async(req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.create({ email, otp });

    return new ApiResponse(200, "OTP sent successfully");
});

export const register = asyncHandler(async(req, res) => {
    const { name, email, password, otp } = req.body;

    const userExist = await User.findOne({ email });
    if(userExist) return next(new ErrorHandler(400, "User already exists"));

    const otpExist = await Otp.findOne({ email });
    if(!otpExist) return next(new ErrorHandler(400, "OTP not found"));
    if(otpExist.otp !== otp) return next(new ErrorHandler(400, "Invalid OTP"));

    const newUser = await User.create({ name, email, password });
    await sendMail(email, "Welcome to Virtual Gallery", newUserTemplate(name));
    return new ApiResponse(201, newUser, "User created successfully");
});

export const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("-password");
    if(!user) return next(new ErrorHandler(400, "User not found"));
    if(!await user.isPasswordCorrect(password)) return next(new ErrorHandler(400, "Invalid password"));
    if(user.isBanned) return next(new ErrorHandler(400, "User is banned till " + user.bannedTill));

    const token = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.token = token;
    
    res.cookie("auth_token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 * 10 });
    return new ApiResponse(200, user, "User logged in successfully");
});

export const getMe = asyncHandler(async(req, res, next) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password");
    if(user.isBanned) return next(new ErrorHandler(400, "User is banned till " + user.bannedTill));
    return new ApiResponse(200, user, "User fetched successfully");
});

export const resetPasswordLink = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return next(new ErrorHandler(400, "User not found"));
    
    const token = crypto.randomBytes(32).toString("hex");
    
    user.token = token;

    // send email with the reset email link
    await sendMail(email, "Reset Password", resetPasswordTemplate(token));
    return new ApiResponse(200, null, "Reset password link sent successfully");
});

export const resetPassword = asyncHandler(async(req, res, next) => 
{
    const {token, password} = req.body;
    
    const userExist = await User.findOne({token});
    if(!userExist) return next(new ErrorHandler(400, "Invalid token"));
    userExist.password = password;
    userExist.token = null;
    await userExist.save();
    return new ApiResponse(200, null, "Password reset successfully");
});



export const logout = asyncHandler(async(req, res) => {
    res.clearCookie("auth_token");
    return new ApiResponse(200, "User logged out successfully");
});
