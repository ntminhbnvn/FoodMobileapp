import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Auth info endpoint
router.get("/", (req, res) => {
    res.json({
        message: "Authentication endpoints",
        endpoints: {
            "POST /auth/register": "Register a new user",
            "POST /auth/login": "Login user",
            "GET /auth/profile": "Get user profile (requires token)",
            "PUT /auth/profile": "Update user profile (requires token)"
        }
    });
});

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

export default router;
