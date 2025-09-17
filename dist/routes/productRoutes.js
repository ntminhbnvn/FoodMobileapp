"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.get("/", productController_1.getProducts);
router.post("/", productController_1.createProduct);
router.delete("/:id", productController_1.deleteProduct);
router.put("/:id", productController_1.updateProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map