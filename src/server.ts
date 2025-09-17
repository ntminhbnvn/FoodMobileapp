import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

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
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});