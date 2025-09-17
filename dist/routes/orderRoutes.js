"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
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
router.use(auth_1.authenticateToken);
router.get("/list", orderController_1.getOrders);
router.get("/:id", orderController_1.getOrderById);
router.post("/", orderController_1.createOrder);
router.put("/:id/status", orderController_1.updateOrderStatus);
router.put("/:id/cancel", orderController_1.cancelOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map