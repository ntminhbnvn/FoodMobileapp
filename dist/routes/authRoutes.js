"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
// Protected routes
router.get("/profile", auth_1.authenticateToken, authController_1.getProfile);
router.put("/profile", auth_1.authenticateToken, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map