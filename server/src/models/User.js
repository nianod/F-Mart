import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "delivery"], default: "user" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (_document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.__v;
    delete returned.password;
    return returned;
  },
});

export default mongoose.model("User", userSchema);
