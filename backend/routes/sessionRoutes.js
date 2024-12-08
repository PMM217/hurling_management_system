//Import required dependencies
const express = require("express");

//MongoDB ObjectId for handling document IDs
const { ObjectId } = require('mongodb');

//Custom database connection module
const database = require("../connect");
const router = express.Router();

//POST endpoint to create a new training session
router.post("/sessions", async (req, res) => {
    try {
        //Extract session details from request body using destructuring
        const { date, location, description } = req.body;
        const db = database.getDb();
        
        //Insert new session document with empty attendance array
        const result = await db.collection("sessions").insertOne({
            date: new Date(date),    // Convert date string to Date object
            location,
            description,
            attendance: [],          // Initialize empty attendance array
            createdAt: new Date()    // Add creation timestamp
        });

        //Return success response with new session ID
        res.status(201).json({
            message: "Session created successfully",
            sessionId: result.insertedId
        });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ message: "Error creating session" });
    }
});

//GET endpoint to retrieve all training sessions
router.get("/sessions", async (req, res) => {
    try {
        const db = database.getDb();
        //Fetch all sessions and sort by date ascending
        const sessions = await db.collection("sessions")
            .find({})
            .sort({ date: 1 })
            .toArray();
            
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions" });
    }
});

//PUT endpoint to update an existing session
router.put("/sessions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //Extract updated session details from request body
        const { date, location, description } = req.body;
        const db = database.getDb();

        //Update session document with new information
        const result = await db.collection("sessions").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    date: new Date(date),
                    location,
                    description,
                    updatedAt: new Date()  //Add update timestamp
                }
            }
        );

        //Check if session was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "Session updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating session" });
    }
});

//DELETE endpoint to remove a session
router.delete("/sessions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = database.getDb();

        //Delete session document by ID
        const result = await db.collection("sessions").deleteOne({
            _id: new ObjectId(id)
        });

        //Check if session was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting session" });
    }
});

//POST endpoint to handle player attendance for a session
router.post("/sessions/attendance", async (req, res) => {
    try {
        const { sessionId, userId, attending } = req.body;
        const db = database.getDb();

        //Convert string IDs to MongoDB ObjectIds
        const sessionObjectId = new ObjectId(sessionId);
        const userObjectId = new ObjectId(userId);

        //First remove any existing attendance record for this user
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

        //Then add new attendance record
        await db.collection("sessions").updateOne(
            { _id: sessionObjectId },
            { 
                $push: { 
                    attendance: {
                        userId: userId,
                        attending,
                        respondedAt: new Date()  //Add response timestamp
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

//GET endpoint to retrieve detailed attendance for a specific session
router.get("/sessions/:id/attendance", async (req, res) => {
    try {
        const { id } = req.params;
        const db = database.getDb();
        
        //Find session by ID
        const session = await db.collection("sessions").findOne({
            _id: new ObjectId(id)
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        //Map through attendance records and add user details
        const attendance = await Promise.all(
            (session.attendance || []).map(async (record) => {
                try {
                    const userObjectId = new ObjectId(record.userId);
                    //Find user details for each attendance record
                    const user = await db.collection("users").findOne(
                        { _id: userObjectId }
                    );

                    //Return attendance record with user details
                    return {
                        ...record,
                        userName: user ? user.name : 'Unknown User',
                        userEmail: user ? user.email : 'No email'
                    };
                } catch (error) {
                    console.error('Error processing user:', error);
                    //Return placeholder data if user lookup fails
                    return {
                        ...record,
                        userName: 'Unknown User',
                        userEmail: 'No email'
                    };
                }
            })
        );

        //Return session with processed attendance records
        res.json({
            session,
            attendance
        });
    } catch (error) {
        console.error("Error fetching attendance details:", error);
        res.status(500).json({ message: "Error fetching attendance details" });
    }
});

//Export router for use in main application
module.exports = router;