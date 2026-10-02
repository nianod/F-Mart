import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user.toJSON() } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "phone", "address", "avatar"];
  const updates = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key]]));
  if (updates.name === "") return res.status(400).json({ success: false, message: "Name cannot be empty" });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  res.json({ success: true, message: "Profile updated successfully", data: { user } });
});
