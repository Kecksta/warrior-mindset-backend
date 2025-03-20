const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ✅ Fix: Prevent Mongoose from recompiling the model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // Optional profile image URL
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  } // Role-based access
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Fix: Check if model exists before defining it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;

