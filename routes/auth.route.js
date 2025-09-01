import { Router } from "express";
import { sendOtp, register, login, getMe, refreshToken, resetPasswordLink, resetPassword, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {registerSchema, loginSchema, resetPasswordSchema} from "../validations/auth.schema.js";

const authRouter = Router();

authRouter.post("/send-otp", sendOtp);
authRouter.post("/register", validateRequest(registerSchema), register);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.get("/refresh-token", refreshToken);
authRouter.get("/me", verifyToken, getMe);
authRouter.post("/reset-password-link", resetPasswordLink);
authRouter.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
authRouter.post("/logout", logout);

export default authRouter;