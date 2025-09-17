"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
// Register a new user
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }
        // Check if user already exists
        const existingUser = await client_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User with this email already exists"
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }
        // Find user
        const user = await client_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }
        // Verify password
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
};
exports.login = login;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Failed to get user profile" });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        const user = await client_1.default.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                updatedAt: true
            }
        });
        res.json({
            message: "Profile updated successfully",
            user
        });
    }
    catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=authController.js.map