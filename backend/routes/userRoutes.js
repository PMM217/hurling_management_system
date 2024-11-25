const express = require("express");
const { ObjectId } = require('mongodb');
const database = require("../connect");
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config({ path: './config.env' });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Register endpoint
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const db = database.getDb();
        
        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const result = await db.collection("users").insertOne({
            name,
            email,
            password,
            role,
            profileInfo: {}, // Initialize empty profile info
            createdAt: new Date()
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: result.insertedId,
                name,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
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

        // Find user by email
        const user = await db.collection("users").findOne({ email });

        // Check if user exists and password matches
        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login" });
    }
});

// Verify token endpoint
router.get("/verify", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const userId = new ObjectId(req.user.userId);
        
        const user = await db.collection("users").findOne(
            { _id: userId },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ valid: true, user });
    } catch (error) {
        res.status(500).json({ message: "Error verifying token" });
    }
});

// Get all players endpoint
router.get("/players", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        
        // Only allow managers to access this endpoint
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        // Get all users with role 'player'
        const players = await db.collection("users")
            .find({ role: 'player' })
            .project({ password: 0 }) // Exclude passwords from response
            .toArray();

        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ message: "Error fetching players" });
    }
});

// Delete player endpoint
router.delete("/players/:id", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        
        // Only allow managers to delete players
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        const result = await db.collection("users").deleteOne({
            _id: new ObjectId(req.params.id),
            role: 'player' // Extra check to ensure only players can be deleted
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Player not found" });
        }

        res.json({ message: "Player deleted successfully" });
    } catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({ message: "Error deleting player" });
    }
});

// Get user profile endpoint
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const userId = new ObjectId(req.user.userId);
        
        const user = await db.collection("users").findOne(
            { _id: userId },
            { projection: { password: 0 } } // Exclude password from response
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// Update profile endpoint
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const userId = new ObjectId(req.user.userId);
        
        const { name, age, height, weight, position, county, imageUrl } = req.body;
        
        const result = await db.collection("users").updateOne(
            { _id: userId },
            { 
                $set: {
                    name,
                    profileInfo: {
                        age,
                        height,
                        weight,
                        position,
                        county
                    },
                    imageUrl,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

module.exports = router;