const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically (for access from frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth Routes (wallet login, profile update)
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Location Routes (fetch locations, claim spot)
const locationRoutes = require("./routes/locations");
app.use("/api", locationRoutes);

// User Routes (dashboard, history, etc.)
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

// Upload Route (after-cleaning image)
const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
