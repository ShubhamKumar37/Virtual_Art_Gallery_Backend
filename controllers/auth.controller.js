import { asyncHandler, ErrorHandler, ApiResponse, sendMail } from "../helper/index.js";
import { resetPasswordTemplate, newUserTemplate } from "../helper/emailTemplates.js";
import { User, Otp, AuthLogs } from "../models/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const sendOtp = asyncHandler(async(req, res) => {
    const { email } = req.body;
    if(!email) return next(new ErrorHandler(400, "Email is required"));
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.create({ email, otp });
    
    return res.status(200).json(new ApiResponse(200, "OTP sent successfully"));
});

export const refreshToken = asyncHandler(async(req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken) return next(new ErrorHandler(404, "Refresh token not found"));
    const user = await User.findOne({refreshToken: refreshToken}).select("+refreshToken");
    if(!user) return next(new ErrorHandler(404, "User not found"));

    if(refreshToken !== user.refreshToken)
    {
        res.clearCookie("refresh_token");
        return next(new ErrorHandler(403, "Invalid refresh token"));
    }

    const newAccessToken = await jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    return res.status(200).json(new ApiResponse(200, newAccessToken, "Token refreshed successfully"));
});

export const register = asyncHandler(async(req, res, next) => {
    const { name, email, password, otp } = req.body;

    const userExist = await User.findOne({ email });
    if(userExist) return next(new ErrorHandler(404, "User already exists"));

    const otpExist = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if(!otpExist) return next(new ErrorHandler(404, "OTP not found"));
    if(otpExist.otp !== otp) return next(new ErrorHandler(403, "Invalid OTP"));

    const newUser = await User.create({ name, email, password });
    await sendMail(email, "Welcome to Virtual Gallery", newUserTemplate(name));
    return res.status(201).json(new ApiResponse(201, newUser, "User created successfully"));
});

export const login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    const logEntry = {
        ip: req.clientIp || req.ip,
        device: req.useragent.platform,
        browser: req.useragent.browser,
        email: email,
        reason: "LOGIN_ATTEMPT"
    };

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
        await AuthLogs.create({ ...logEntry, reason: "USER_NOT_FOUND" });
        return next(new ErrorHandler(401, "Invalid email or password"));
    }
    if (!(await user.isPasswordCorrect(password))) {
        await AuthLogs.create({ ...logEntry, user: user._id, reason: "WRONG_PASSWORD" });
        return next(new ErrorHandler(401, "Invalid email or password"));
    }
    if (user.isBanned) {
        await AuthLogs.create({ ...logEntry, user: user._id, reason: "BANNED_USER" });
        return next(new ErrorHandler(403, "Your account is banned until " + user.bannedTill));
    }   

    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
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

    return res.status(200).json(new ApiResponse(200, userResponse, "User logged in successfully"));
});

export const getMe = asyncHandler(async(req, res, next) => {
    const {id} = req.user;
    const user = await User.findById(id);
    if(user.isBanned) return next(new ErrorHandler(403, "User is banned till " + user.bannedTill));
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const resetPasswordLink = asyncHandler(async(req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) return next(new ErrorHandler(404, "User not found"));
    
    const token = crypto.randomBytes(32).toString("hex");    
    user.token = token;
    await user.save();

    await sendMail(email, "Reset Password", resetPasswordTemplate(token));
    return res.status(200).json(new ApiResponse(200, null, "Reset password link sent successfully"));
});

export const resetPassword = asyncHandler(async(req, res, next) => 
{
    const {token, password} = req.body;
    const userExist = await User.findOne({token});
    
    if(!userExist) return next(new ErrorHandler(404, "Invalid token"));
    userExist.password = password;
    userExist.token = null;
    
    await userExist.save();
    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

export const logout = asyncHandler(async(req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    const userExist = await User.findOne({refreshToken: refreshToken}).select("+refreshToken");
    if(!userExist) return next(new ErrorHandler(404, "User not found"));
    
    userExist.refreshToken = null;
    await userExist.save();
    
    res.clearCookie("refresh_token");
    return res.status(200).json(new ApiResponse(200, "User logged out successfully"));
});
