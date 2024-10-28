const express = require("express");
const database = require("../connect");
const router = express.Router();

// Keep your existing register endpoint
router.post("/register", async (req, res) => {
    // ... existing registration code ...
});

// Add login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = database.getDb();

        // Debug log
        console.log("Login attempt for:", email);

        // Find user by email
        const user = await db.collection("users").findOne({ email });

        // Check if user exists and password matches
        if (user && password === user.password) {
            // Generate a simple token (in a real app, you'd use JWT)
            const token = Math.random().toString(36).slice(2);

            res.json({
                message: "Login successful",
                token,
                role: user.role,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

            console.log("Login successful for:", email);
        } else {
            console.log("Login failed for:", email);
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login" });
    }
});

module.exports = router;