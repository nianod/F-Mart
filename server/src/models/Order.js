import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "accepted", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String, required: true, trim: true, maxlength: 200 },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    urgent: { type: Boolean, default: false },
    temperature: { type: String, enum: ["warm", "cold"], default: "warm" },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
    deliveryGuy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
