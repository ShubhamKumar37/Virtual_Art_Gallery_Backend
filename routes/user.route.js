import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { updateProfilePicture } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.put("/update-picture", verifyToken, updateProfilePicture);

export default userRouter;