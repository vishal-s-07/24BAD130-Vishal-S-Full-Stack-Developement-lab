const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Import contact routes
const contactRoutes = require("./routes/contactRoutes");

// Load .env from project root
dotenv.config({
    path: path.join(__dirname, "../.env")
});

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

// Parse JSON request body
app.use(express.json());

// Serve frontend files from src folder
app.use(express.static(__dirname));


// ==========================================
// MONGODB CONNECTION
// ==========================================

console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        console.log("Database: Contact_Management_System");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


// ==========================================
// HOME API
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ==========================================
// CONTACT CRUD APIs
// ==========================================

app.use("/contacts", contactRoutes);


// ==========================================
// INVALID ROUTE HANDLER
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
});