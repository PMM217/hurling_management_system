const express = require("express");
const { ObjectId } = require('mongodb');
const database = require("../connect");
const router = express.Router();

// Create training session
router.post("/sessions", async (req, res) => {
    try {
        const { date, location, description } = req.body;
        const db = database.getDb();
        
        const result = await db.collection("sessions").insertOne({
            date: new Date(date),
            location,
            description,
            attendance: [],
            createdAt: new Date()
        });

        res.status(201).json({
            message: "Session created successfully",
            sessionId: result.insertedId
        });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Error creating session" });
    }
});

// Get all sessions
router.get("/sessions", async (req, res) => {
    try {
        const db = database.getDb();
        const sessions = await db.collection("sessions")
            .find({})
            .sort({ date: 1 })
            .toArray();
            
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions" });
    }
});

// Update a session
router.put("/sessions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { date, location, description } = req.body;
        const db = database.getDb();

        const result = await db.collection("sessions").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    date: new Date(date),
                    location,
                    description,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "Session updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating session" });
    }
});

// Delete a session
router.delete("/sessions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = database.getDb();

        const result = await db.collection("sessions").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting session" });
    }
});

// Handle attendance
router.post("/sessions/attendance", async (req, res) => {
    try {
        const { sessionId, userId, attending } = req.body;
        const db = database.getDb();

        const sessionObjectId = new ObjectId(sessionId);
        const userObjectId = new ObjectId(userId);

        // Remove any existing attendance record
        await db.collection("sessions").updateOne(
            { _id: sessionObjectId },
            { 
                $pull: { 
                    attendance: { 
                        userId: userId 
                    } 
                } 
            }
        );

        // Add new attendance record
        await db.collection("sessions").updateOne(
            { _id: sessionObjectId },
            { 
                $push: { 
                    attendance: {
                        userId: userId,
                        attending,
                        respondedAt: new Date()
                    } 
                } 
            }
        );

        res.json({ message: "Attendance updated successfully" });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: "Error updating attendance" });
    }
});

// Get detailed attendance for a session
router.get("/sessions/:id/attendance", async (req, res) => {
    try {
        const { id } = req.params;
        const db = database.getDb();
        
        const session = await db.collection("sessions").findOne({
            _id: new ObjectId(id)
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Get user details for each attendance record
        const attendance = await Promise.all(
            (session.attendance || []).map(async (record) => {
                try {
                    const userObjectId = new ObjectId(record.userId);
                    const user = await db.collection("users").findOne(
                        { _id: userObjectId }
                    );

                    return {
                        ...record,
                        userName: user ? user.name : 'Unknown User',
                        userEmail: user ? user.email : 'No email'
                    };
                } catch (error) {
                    console.error('Error processing user:', error);
                    return {
                        ...record,
                        userName: 'Unknown User',
                        userEmail: 'No email'
                    };
                }
            })
        );

        console.log('Processed attendance:', attendance); // Debug log

        res.json({
            session,
            attendance
        });
    } catch (error) {
        console.error("Error fetching attendance details:", error);
        res.status(500).json({ message: "Error fetching attendance details" });
    }
});

module.exports = router;