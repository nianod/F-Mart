import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const tokenFor = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || "7d" });
const authPayload = (user) => ({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "An account with that email already exists" });
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password, role: "user" });
  res.status(201).json({ success: true, message: "Account created successfully", data: authPayload(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
  res.json({ success: true, message: "Login successful", data: authPayload(user) });
});
