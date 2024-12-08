const express = require("express"); //express for routing functionality
const { ObjectId } = require('mongodb'); //ObjectId for MongoDB document ID handling
const database = require("../connect"); //Custom database connection module
const jwt = require('jsonwebtoken'); //JWT for authentication tokens
const router = express.Router();
require('dotenv').config({ path: './config.env' }); //Load environment variables from config.env

//Custom middleware to verify JWT tokens in request headers
const verifyToken = (req, res, next) => {
    try {
        //Extract authorization header
        const authHeader = req.headers.authorization;
        //Check if header exists and follows Bearer token format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        //Split 'Bearer token' and take token part
        const token = authHeader.split(' ')[1];
        //Verify token using JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Attach decoded user info to request object for use in middleware
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

//User registration endpoint
router.post("/register", async (req, res) => {
    try {
        //Extract user data from request body using destructuring
        const { name, email, password, role } = req.body;
        const db = database.getDb();
        
        //Check for existing user to prevent duplicates
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Insert new user into database with initial empty profile
        const result = await db.collection("users").insertOne({
            name,
            email,
            password,
            role,
            profileInfo: {}, // Initialize empty profile info object
            createdAt: new Date()
        });

        //Generate JWT token for immediate authentication
        const token = jwt.sign(
            { userId: result.insertedId, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //Send success response with token and user data
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

//User login endpoint
router.post("/login", async (req, res) => {
    try {
        //Extract login credentials from request body
        const { email, password } = req.body;
        const db = database.getDb();

        //Find user by email
        const user = await db.collection("users").findOne({ email });

        //Verify user exists and password matches
        if (!user || password !== user.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        //Generate new JWT token for authenticated session
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //Return success response with token and user data
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

//Token verification endpoint - Used to validate existing tokens
router.get("/verify", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        //Convert string ID to MongoDB ObjectId
        const userId = new ObjectId(req.user.userId);
        
        //Find user but exclude password field from response
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

//Get all players endpoint - Manager only access
router.get("/players", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        
        //Role-based access control check
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        //Retrieve all players with password field excluded
        const players = await db.collection("users")
            .find({ role: 'player' })
            .project({ password: 0 })
            .toArray();

        res.json(players);
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ message: "Error fetching players" });
    }
});

//Delete player endpoint - Manager only access
router.delete("/players/:id", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        
        //Role-based access control check
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        //Delete player - check to ensure only players can be deleted
        const result = await db.collection("users").deleteOne({
            _id: new ObjectId(req.params.id),
            role: 'player'
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

//Get user profile endpoint
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const userId = new ObjectId(req.user.userId);
        
        //Fetch user profile excluding password
        const user = await db.collection("users").findOne(
            { _id: userId },
            { projection: { password: 0 } }
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

//Update profile endpoint
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const userId = new ObjectId(req.user.userId);
        
        //Extract profile data from request body
        const { name, age, height, weight, position, county, imageUrl } = req.body;
        
        //Update user profile with new information
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

//Export router for use in main application
module.exports = router;