import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { hasAdminRole, verifyToken } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/create", verifyToken, hasAdminRole, createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", verifyToken, hasAdminRole, updateCategory);
categoryRouter.delete("/:id", verifyToken, hasAdminRole, deleteCategory);

export default categoryRouter;