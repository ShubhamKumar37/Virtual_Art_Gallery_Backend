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

export const refreshToken = asyncHandler(async(req, res, next) => {
    const {refreshToken} = req.cookies;
    if(!refreshToken) return next(new ErrorHandler(404, "Refresh token not found"));
    
    const user = await User.findById(req.user.id);
    if(!user) return next(new ErrorHandler(404, "User not found"));
    if(refreshToken !== user.refreshToken)
    {
        res.clearCookie("refresh_token");
        return next(new ErrorHandler(403, "Invalid refresh token"));
    }

    const newAccessToken = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return new ApiResponse(200, newAccessToken, "Token refreshed successfully");
});

export const register = asyncHandler(async(req, res, next) => {
    const { name, email, password, otp } = req.body;

    const userExist = await User.findOne({ email });
    if(userExist) return next(new ErrorHandler(404, "User already exists"));

    const otpExist = await Otp.findOne({ email });
    if(!otpExist) return next(new ErrorHandler(404, "OTP not found"));
    if(otpExist.otp !== otp) return next(new ErrorHandler(403, "Invalid OTP"));

    const newUser = await User.create({ name, email, password });
    await sendMail(email, "Welcome to Virtual Gallery", newUserTemplate(name));
    return new ApiResponse(201, newUser, "User created successfully");
});

export const login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password +refreshToken");

    const genericErrorMessage = "Invalid email or password";
    if (!user) return next(new ErrorHandler(401, genericErrorMessage));
    if (!(await user.isPasswordCorrect(password))) return next(new ErrorHandler(401, genericErrorMessage));
    if (user.isBanned) return next(new ErrorHandler(403, "Your account is banned until " + user.bannedTill));    

    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: sevenDaysInMilliseconds
    });
    
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        accessToken: accessToken 
    };

    return new ApiResponse(200, userResponse, "User logged in successfully");
});

export const getMe = asyncHandler(async(req, res, next) => {
    const {id} = req.user;
    const user = await User.findById(id);
    if(user.isBanned) return next(new ErrorHandler(403, "User is banned till " + user.bannedTill));
    return new ApiResponse(200, user, "User fetched successfully");
});

export const resetPasswordLink = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return next(new ErrorHandler(404, "User not found"));
    
    const token = crypto.randomBytes(32).toString("hex");    
    user.token = token;
    await user.save();

    await sendMail(email, "Reset Password", resetPasswordTemplate(token));
    return new ApiResponse(200, null, "Reset password link sent successfully");
});

export const resetPassword = asyncHandler(async(req, res, next) => 
{
    const {token, password} = req.body;
    const userExist = await User.findOne({token});
    
    if(!userExist) return next(new ErrorHandler(404, "Invalid token"));
    userExist.password = password;
    userExist.token = null;
    
    await userExist.save();
    return new ApiResponse(200, null, "Password reset successfully");
});

export const logout = asyncHandler(async(req, res) => {
    const {id} = req.user;
    await User.findByIdAndUpdate(id, {refreshToken: null});
    
    res.clearCookie("refresh_token");
    return new ApiResponse(200, "User logged out successfully");
});
