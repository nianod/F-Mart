import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import User from "../models/User.js";
import { connectDatabase } from "../config/db.js";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const email = process.env.DELIVERY_EMAIL?.trim().toLowerCase();
const password = process.env.DELIVERY_PASSWORD;
const name = process.env.DELIVERY_NAME?.trim() || "FoodMart Delivery Partner";

if (!email || !password) {
	console.error("DELIVERY_EMAIL and DELIVERY_PASSWORD must be set in server/.env");
	process.exit(1);
}

if (password.length < 6) {
	console.error("DELIVERY_PASSWORD must be at least 6 characters");
	process.exit(1);
}

try {
	await connectDatabase();

	let deliveryUser = await User.findOne({ email }).select("+password");
	if (!deliveryUser) deliveryUser = new User({ email });

	deliveryUser.name = name;
	deliveryUser.password = password;
	deliveryUser.role = "delivery";
	await deliveryUser.save();

	console.log(`Delivery login account is ready for ${email}`);
} catch (error) {
	console.error("Unable to seed delivery login:", error.message);
	process.exitCode = 1;
} finally {
	await mongoose.disconnect();
}
