const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let playerRoutes = express.Router()

// Helper function for error handling
const handleErrors = (error, response) => {
    console.error("Error:", error);
    response.status(500).json({ message: "Internal server error", error: error.toString() });
}

//1 - Retrieve all - http://localhost:3000/players
playerRoutes.route("/players").get(async(request, response) => {
    try {
        let db = database.getDb()
        console.log("Attempting to retrieve all players");
        let data = await db.collection("playerData").find({}).toArray()
        console.log("Retrieved data:", data);
        if (data.length > 0) {
            response.json(data)
        } else {
            console.log("No players found");
            response.status(404).json({ message: "No players found in the database" })
        }
    } catch (error) {
        handleErrors(error, response)
    }
})

//2 - Read One
playerRoutes.route("/players/:id").get(async(request, response) => {
    try {
        let db = database.getDb()
        console.log("Attempting to retrieve player with id:", request.params.id);
        let data = await db.collection("playerData").findOne({_id: new ObjectId(request.params.id)})
        console.log("Retrieved data:", data);
        if (data) {
            response.json(data)
        } else {
            console.log("Player not found");
            response.status(404).json({ message: "Player not found" })
        }
    } catch (error) {
        handleErrors(error, response)
    }
})

//3 - Create One
playerRoutes.route("/players").post(async(request, response) => {
    try {
        let db = database.getDb()
        let mongoObject = {
            name: request.body.name,
            position: request.body.position
        }
        console.log("Attempting to create new player:", mongoObject);
        let data = await db.collection("playerData").insertOne(mongoObject)
        console.log("Insert result:", data);
        response.status(201).json(data)
    } catch (error) {
        handleErrors(error, response)
    }
})

//4 - Update One
playerRoutes.route("/players/:id").put(async(request, response) => {
    try {
        let db = database.getDb()
        let mongoObject = {
            $set: {
                name: request.body.name,
                position: request.body.position
            }
        }
        console.log("Attempting to update player with id:", request.params.id);
        let data = await db.collection("playerData").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
        console.log("Update result:", data);
        if (data.matchedCount > 0) {
            response.json(data)
        } else {
            console.log("Player not found for update");
            response.status(404).json({ message: "Player not found" })
        }
    } catch (error) {
        handleErrors(error, response)
    }
})

//5 - Delete One
playerRoutes.route("/players/:id").delete(async(request, response) => {
    try {
        let db = database.getDb()
        console.log("Attempting to delete player with id:", request.params.id);
        let data = await db.collection("playerData").deleteOne({_id: new ObjectId(request.params.id)})
        console.log("Delete result:", data);
        if (data.deletedCount > 0) {
            response.json(data)
        } else {
            console.log("Player not found for deletion");
            response.status(404).json({ message: "Player not found" })
        }
    } catch (error) {
        handleErrors(error, response)
    }
})

module.exports = playerRoutes








// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId

// let postRoutes = express.Router()

// //1 - Retrieve all - http://localhost:3000/posts
// postRoutes.route("/posts").get(async(request, response) => {
//     let db = database.getDb()
//     let data = await db.collection("posts").find({}).toArray()
//     if (data.length >0) {
//         response.json(data)
//     } else {
//         throw new Error("Data was not found :(")
//     }
// })

// //2 - Read One
// postRoutes.route("/posts/:id").get(async(request, response) => {
//     let db = database.getDb()
//     let data = await db.collection("posts").findOne({_id: new ObjectId(request.params.id)})
//     if (Object.keys(data).length >0) {
//         response.json(data)
//     } else {
//         throw new Error("Data was not found :(")
//     }
// })

// //3 - Create One - 2 routes with same name is ok as long as dfferent method is called ie .post
// postRoutes.route("/posts").post(async(request, response) => {
//     let db = database.getDb()
//     let mongoObject = {
//         name: request.body.name,
//         position: request.body.position
//     }
//     let data = await db.collection("posts").insertOne(mongoObject)
//     response.json(data)
// })

// //4 - Update One
// postRoutes.route("/posts/:id").put(async(request, response) => {
//     let db = database.getDb()
//     let mongoObject = {
//         $set: {
//             name: request.body.name,
//             position: request.body.position
//         }

//     }
//     let data = await db.collection("posts").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
//     response.json(data)
// })

// //5 - Delete One
// postRoutes.route("/posts/:id").delete(async(request, response) => {
//     let db = database.getDb()
//     let data = await db.collection("posts").deleteOne({_id: new ObjectId(request.params.id)})
//     response.json(data)
// })

// module.exports = postRoutes