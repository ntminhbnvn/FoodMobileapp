import { Router } from "express";
import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrderStatus, 
    cancelOrder 
} from "../controllers/orderController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Order info endpoint (public)
router.get("/", (req, res) => {
    res.json({
        message: "Order endpoints",
        note: "All order endpoints require authentication",
        endpoints: {
            "GET /orders": "Get orders (user's orders or all orders for admin)",
            "GET /orders/:id": "Get order by ID",
            "POST /orders": "Create new order",
            "PUT /orders/:id/status": "Update order status (admin only)",
            "PUT /orders/:id/cancel": "Cancel order"
        }
    });
});

// All other order routes require authentication
router.use(authenticateToken);

router.get("/list", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

export default router;
