"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await client_1.default.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json({ categories });
    }
    catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};
exports.getCategories = getCategories;
// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await client_1.default.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                products: {
                    where: {
                        isAvailable: true
                    },
                    orderBy: {
                        name: 'asc'
                    }
                },
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ category });
    }
    catch (error) {
        console.error("Get category error:", error);
        res.status(500).json({ error: "Failed to fetch category" });
    }
};
exports.getCategoryById = getCategoryById;
// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                error: "Category name is required"
            });
        }
        // Check if category already exists
        const existingCategory = await client_1.default.category.findUnique({
            where: { name }
        });
        if (existingCategory) {
            return res.status(400).json({
                error: "Category with this name already exists"
            });
        }
        const category = await client_1.default.category.create({
            data: { name }
        });
        res.status(201).json({
            message: "Category created successfully",
            category
        });
    }
    catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
};
exports.createCategory = createCategory;
// Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                error: "Category name is required"
            });
        }
        // Check if category exists
        const existingCategory = await client_1.default.category.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        // Check if new name already exists (excluding current category)
        const nameExists = await client_1.default.category.findFirst({
            where: {
                name,
                id: { not: parseInt(id) }
            }
        });
        if (nameExists) {
            return res.status(400).json({
                error: "Category with this name already exists"
            });
        }
        const category = await client_1.default.category.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json({
            message: "Category updated successfully",
            category
        });
    }
    catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
};
exports.updateCategory = updateCategory;
// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category exists
        const existingCategory = await client_1.default.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
        if (!existingCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        // Check if category has products
        if (existingCategory._count.products > 0) {
            return res.status(400).json({
                error: "Cannot delete category with existing products. Please move or delete products first."
            });
        }
        await client_1.default.category.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map