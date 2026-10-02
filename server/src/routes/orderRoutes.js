import { Router } from "express";
import { acceptOrder, createOrder, getAvailableOrders, getDeliveries, getMyOrders, updateDeliveryStatus } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/", protect, authorizeRoles("user"), createOrder);
router.get("/my-orders", protect, authorizeRoles("user"), getMyOrders);
router.get("/available", protect, authorizeRoles("delivery"), getAvailableOrders);
router.patch("/:id/accept", protect, authorizeRoles("delivery"), acceptOrder);
router.get("/deliveries", protect, authorizeRoles("delivery"), getDeliveries);
router.patch("/:id/status", protect, authorizeRoles("delivery"), updateDeliveryStatus);
export default router;
