import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controller/order-controller";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);

router.post("/", createOrder);

router.put("/:id/status", updateOrderStatus);

router.put("/:id/cancel", cancelOrder);

export default router;
