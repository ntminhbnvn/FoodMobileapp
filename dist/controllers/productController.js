"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Get all products with category
const getProducts = async (req, res) => {
    try {
        const products = await client_1.default.product.findMany({
            include: {
                category: true
            }
        });
        res.json({ products });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, image, isAvailable } = req.body;
        // Validate required fields
        if (!name || !price || !categoryId) {
            return res.status(400).json({
                error: "Name, price, and categoryId are required"
            });
        }
        const product = await client_1.default.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId: parseInt(categoryId),
                image,
                isAvailable: isAvailable !== undefined ? isAvailable : true
            },
            include: {
                category: true
            }
        });
        res.json({ product });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};
exports.createProduct = createProduct;
// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await client_1.default.product.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};
exports.deleteProduct = deleteProduct;
// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, image, isAvailable } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = parseFloat(price);
        if (categoryId !== undefined)
            updateData.categoryId = parseInt(categoryId);
        if (image !== undefined)
            updateData.image = image;
        if (isAvailable !== undefined)
            updateData.isAvailable = isAvailable;
        const product = await client_1.default.product.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json({ product });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=productController.js.map