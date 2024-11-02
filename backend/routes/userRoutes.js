const express = require("express");
const database = require("../connect");
const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const db = database.getDb();
        
        console.log('Received registration request:', { name, email, role }); // Debug log

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email); // Debug log
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const result = await db.collection("users").insertOne({
            name,
            email,
            password,
            role,
            createdAt: new Date()
        });

        console.log('User created successfully:', result.insertedId); // Debug log

        res.status(201).json({
            message: "Registration successful",
            userId: result.insertedId
        });
    } catch (error) {
        console.error('Registration error:', error); // Debug log
        res.status(500).json({ 
            message: "Error registering user",
            error: error.message 
        });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = database.getDb();

        console.log('Login attempt for:', email); // Debug log

        // Find user by email
        const user = await db.collection("users").findOne({ email });

        // Check if user exists and password matches
        if (user && password === user.password) { // Note: In a real app, you'd use password hashing
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

            console.log('Login successful for:', email); // Debug log
        } else {
            console.log('Login failed for:', email); // Debug log
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error); // Debug log
        res.status(500).json({ message: "Error during login" });
    }
});

module.exports = router;