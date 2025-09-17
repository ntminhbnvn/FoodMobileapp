"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// Get all orders (for admin) or user's orders
const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;
        const { status, page = 1, limit = 10 } = req.query;
        const whereClause = {};
        // If user is not admin, only show their orders
        if (userRole !== 'ADMIN') {
            whereClause.userId = userId;
        }
        // Filter by status if provided
        if (status) {
            whereClause.status = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [orders, total] = await Promise.all([
            client_1.default.order.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: Number(limit)
            }),
            client_1.default.order.count({ where: whereClause })
        ]);
        res.json({
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
exports.getOrders = getOrders;
// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const whereClause = { id: parseInt(id) };
        // If user is not admin, only allow access to their own orders
        if (userRole !== 'ADMIN') {
            whereClause.userId = userId;
        }
        const order = await client_1.default.order.findFirst({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ order });
    }
    catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};
exports.getOrderById = getOrderById;
// Create a new order
const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body;
        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Order items are required"
            });
        }
        // Validate each item
        for (const item of items) {
            if (!item.productId || !item.quantity || !item.price) {
                return res.status(400).json({
                    error: "Each item must have productId, quantity, and price"
                });
            }
        }
        // Check if all products exist and are available
        const productIds = items.map((item) => item.productId);
        const products = await client_1.default.product.findMany({
            where: {
                id: { in: productIds },
                isAvailable: true
            }
        });
        if (products.length !== productIds.length) {
            return res.status(400).json({
                error: "Some products are not available or do not exist"
            });
        }
        // Calculate total
        const total = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        // Create order with items in a transaction
        const order = await client_1.default.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'PENDING'
                }
            });
            // Create order items
            const orderItems = await Promise.all(items.map((item) => tx.orderItem.create({
                data: {
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }
            })));
            return {
                ...newOrder,
                items: orderItems
            };
        });
        // Fetch the complete order with relations
        const completeOrder = await client_1.default.order.findUnique({
            where: { id: order.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        res.status(201).json({
            message: "Order created successfully",
            order: completeOrder
        });
    }
    catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
exports.createOrder = createOrder;
// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userRole = req.user.role;
        // Only admin can update order status
        if (userRole !== 'ADMIN') {
            return res.status(403).json({
                error: "Only admin can update order status"
            });
        }
        // Validate status
        const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Valid status is required"
            });
        }
        // Check if order exists
        const existingOrder = await client_1.default.order.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        const order = await client_1.default.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        res.json({
            message: "Order status updated successfully",
            order
        });
    }
    catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ error: "Failed to update order status" });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// Cancel order (user can cancel their own pending orders)
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        // Check if order exists and belongs to user
        const existingOrder = await client_1.default.order.findFirst({
            where: {
                id: parseInt(id),
                userId: userId
            }
        });
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        // Only allow cancellation of pending orders
        if (existingOrder.status !== 'PENDING') {
            return res.status(400).json({
                error: "Only pending orders can be cancelled"
            });
        }
        const order = await client_1.default.order.update({
            where: { id: parseInt(id) },
            data: { status: 'CANCELLED' },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
        res.json({
            message: "Order cancelled successfully",
            order
        });
    }
    catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ error: "Failed to cancel order" });
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderController.js.map