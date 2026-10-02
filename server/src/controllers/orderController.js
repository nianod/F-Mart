import mongoose from "mongoose";
import Order, { ORDER_STATUSES } from "../models/Order.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const populatedOrder = (query) => query.populate("user", "name email phone").populate("deliveryGuy", "name email phone");

export const createOrder = asyncHandler(async (req, res) => {
  const { foodName, quantity, address, urgent = false, temperature = "warm", notes = "" } = req.body;
  if (!foodName?.trim() || !address?.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) return res.status(400).json({ success: false, message: "Food name, a valid quantity, and address are required" });
  if (!["warm", "cold"].includes(temperature)) return res.status(400).json({ success: false, message: "Temperature must be warm or cold" });
  const order = await Order.create({ user: req.user.id, foodName: foodName.trim(), quantity: Number(quantity), address: address.trim(), urgent: Boolean(urgent), temperature, notes: typeof notes === "string" ? notes.trim() : "" });
  res.status(201).json({ success: true, message: "Order created successfully", data: { order } });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("deliveryGuy", "name phone");
  res.json({ success: true, data: { orders } });
});

export const getAvailableOrders = asyncHandler(async (_req, res) => {
  const orders = await populatedOrder(Order.find({ deliveryGuy: null, status: { $in: ["pending", "ready"] } }).sort({ urgent: -1, createdAt: -1 }));
  res.json({ success: true, data: { orders } });
});

export const acceptOrder = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid order id" });
  const order = await Order.findOneAndUpdate({ _id: req.params.id, deliveryGuy: null, status: { $in: ["pending", "ready"] } }, { deliveryGuy: req.user.id, status: "accepted" }, { new: true });
  if (!order) return res.status(409).json({ success: false, message: "This order is no longer available" });
  res.json({ success: true, message: "Order accepted successfully", data: { order } });
});

export const getDeliveries = asyncHandler(async (req, res) => {
  const orders = await populatedOrder(Order.find({ deliveryGuy: req.user.id }).sort({ updatedAt: -1 }));
  const active = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const completed = orders.filter((order) => ["delivered", "cancelled"].includes(order.status));
  res.json({ success: true, data: { orders, active, completed } });
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status) || !["accepted", "out_for_delivery", "delivered", "cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid delivery status" });
  const order = await Order.findOneAndUpdate({ _id: req.params.id, deliveryGuy: req.user.id }, { status }, { new: true });
  if (!order) return res.status(404).json({ success: false, message: "Assigned delivery not found" });
  res.json({ success: true, message: "Delivery status updated successfully", data: { order } });
});
