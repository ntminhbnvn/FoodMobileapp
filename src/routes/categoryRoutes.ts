import { Router } from "express";
import { 
    getCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected routes (admin only for create, update, delete)
router.post("/", authenticateToken, createCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;
