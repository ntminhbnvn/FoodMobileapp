"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Food Backend API is running!",
        version: "1.0.0",
        endpoints: {
            auth: "/auth",
            products: "/products",
            categories: "/categories",
            orders: "/orders"
        },
        usage: {
            "GET /": "API information",
            "GET /auth": "Auth endpoints info",
            "GET /categories": "List all categories",
            "GET /products": "List all products",
            "GET /orders": "Order endpoints info"
        }
    });
});
// Convenience routes
app.get("/login", (req, res) => {
    res.json({
        message: "Please use POST /auth/login to login",
        endpoint: "POST /auth/login",
        example: {
            email: "admin@foodapp.com",
            password: "admin123"
        }
    });
});
// API Routes
app.use("/auth", authRoutes_1.default);
app.use("/products", productRoutes_1.default);
app.use("/categories", categoryRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map