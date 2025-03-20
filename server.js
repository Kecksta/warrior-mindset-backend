const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Load environment variables

const app = express();

// ✅ Apply CORS Middleware First (Before Any Routes)
app.use(cors({
    origin: "http://localhost:5173",  // ✅ Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // ✅ Allow cookies if needed
}));

// ✅ Middleware for JSON parsing
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.cyan.underline);
});

