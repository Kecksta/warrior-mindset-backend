const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,  // ✅ Add login function
    getUserProfile,
    updateUserProfile,
    deleteUser,
    uploadProfilePicture,
    getUsers,
    deleteUserById,
    updateUserRole
} = require("../controllers/userController");

// ✅ Add Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);  // ✅ Add this line

// User routes (Protected)
router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUser);
router.post("/upload-profile", protect, upload.single("profilePic"), uploadProfilePicture);

// Admin routes (Only accessible by Admins)
router.get("/admin/users", protect, admin, getUsers);
router.delete("/admin/user/:id", protect, admin, deleteUserById);
router.put("/admin/user/:id/role", protect, admin, updateUserRole);

module.exports = router;

