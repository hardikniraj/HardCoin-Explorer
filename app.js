/*
===========================================
        HardCoin Explorer
        Main Server
===========================================
*/
console.log("🔥 THIS IS THE APP.JS BEING EXECUTED");
const express = require("express");
const path = require("path");

// Import API Routes
const apiRoutes = require("./routes/api");
const app = express();

// ===========================================
// Middleware
// ===========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// ===========================================
// API Routes
// ===========================================

app.use("/api", apiRoutes);

// ===========================================
// Routes
// ===========================================

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health Check Route
app.get("/health", (req, res) => {
    res.json({
        status: "Server Running",
        project: "HardCoin Explorer",
        time: new Date()
    });
});

// ===========================================
// Start Server
// ===========================================

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log("====================================");
    console.log(" HardCoin Explorer Started ");
    console.log("====================================");
    console.log(`Server running at http://localhost:${PORT}`);
});

// ===========================================
// Debug (Temporary)
// ===========================================

setInterval(() => {
    console.log("✅ Server is alive:", new Date().toLocaleTimeString());
}, 5000);

// ===========================================
// Error Handling
// ===========================================

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

// ===========================================
// Graceful Shutdown
// ===========================================

process.on("SIGINT", () => {
    console.log("\nStopping HardCoin Explorer...");
    server.close(() => {
        console.log("Server stopped successfully.");
        process.exit(0);
    });
});