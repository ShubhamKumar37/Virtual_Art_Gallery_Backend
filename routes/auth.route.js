import { Router } from "express";
import { sendOtp, register, login, getMe, refreshToken, resetPasswordLink, resetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/send-otp", sendOtp);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh-token", refreshToken);
authRouter.get("/me", verifyToken, getMe);
authRouter.post("/reset-password-link", resetPasswordLink);
authRouter.post("/reset-password", resetPassword);

export default authRouter;