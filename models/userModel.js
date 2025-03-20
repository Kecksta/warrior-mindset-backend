const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // ✅ Added name field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/uploads/default.png" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;

