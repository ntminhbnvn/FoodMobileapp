import { Request, Response } from "express";
import prisma from "../prisma/client";

// Get all products with category
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        });
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, categoryId, image, isAvailable } = req.body;
        
        // Validate required fields
        if (!name || !price || !categoryId) {
            return res.status(400).json({ 
                error: "Name, price, and categoryId are required" 
            });
        }

        const product = await prisma.product.create({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};  

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, image, isAvailable } = req.body;
        
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
        if (image !== undefined) updateData.image = image;
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};