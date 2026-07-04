const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log("====================================");
    console.log(" HardCoin Explorer Started ");
    console.log("====================================");
    console.log(`Server running at http://localhost:${PORT}`);
});