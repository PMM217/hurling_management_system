const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let sessionRoutes = express.Router();

// Create a new session
sessionRoutes.route("/sessions").post(async (req, res) => {
    try {
        const db = database.getDb();
        const session = {
            date: req.body.date,
            location: req.body.location,
            attendance: []
        };
        const result = await db.collection("sessions").insertOne(session);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating session", error: error.toString() });
    }
});

// Retrieve all sessions
sessionRoutes.route("/sessions").get(async (req, res) => {
    try {
        const db = database.getDb();
        const sessions = await db.collection("sessions").find({}).toArray();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving sessions", error: error.toString() });
    }
});

// Update session attendance
sessionRoutes.route("/sessions/:id/attendance").put(async (req, res) => {
    try {
        const db = database.getDb();
        const result = await db.collection("sessions").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { attendance: req.body.playerId } }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error: error.toString() });
    }
});

module.exports = sessionRoutes;
