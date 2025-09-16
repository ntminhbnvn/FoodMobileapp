import express from "express";
import cors from "cors";

import type { Request, Response } from "express";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({ message: "Food Backend API is running!" });
});

app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});