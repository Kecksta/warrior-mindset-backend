const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Register a New User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id), // ✅ Send token after registration
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// ✅ Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id), // ✅ Send token after login
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// ✅ Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic || null,
        role: user.role,
    });
});

// ✅ Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
     
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
        
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    await user.save();
            
    res.json({
        message: "User updated successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic || null,
            role: user.role,
        },
    });
});
    
// ✅ Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
        
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
        
    await user.deleteOne();
        
    res.json({ message: "User deleted successfully" });
});
   
// ✅ Upload Profile Picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
     
    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();
    
    res.json({ message: "Profile picture updated", profilePic: user.profilePic });
});
        
// ✅ Admin: Get All Users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);  
});         
    
// ✅ Admin: Delete User by ID
const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
            
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
       
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
});

// ✅ Admin: Update User Role
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
        
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
        
    user.role = req.body.role || "user";
    await user.save();
   
    res.json({ message: `User role updated to ${user.role}` });
});

// ✅ Fix: Export All Defined Functions
module.exports = {
    registerUser,
    loginUser, // ✅ Add this export
    getUserProfile,
    updateUserProfile,
    deleteUser,
    uploadProfilePicture,
    getUsers,
    deleteUserById,
    updateUserRole,
}; 

