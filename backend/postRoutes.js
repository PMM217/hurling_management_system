const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let postRoutes = express.Router()

//1 - Retrieve all - http://localhost:3000/posts
postRoutes.route("/posts").get(async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("posts").find({}).toArray()
    if (data.length >0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

//2 - Read One
postRoutes.route("/posts/:id").get(async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("posts").findOne({_id: new ObjectId(request.params.id)})
    if (Object.keys(data).length >0) {
        response.json(data)
    } else {
        throw new Error("Data was not found :(")
    }
})

//3 - Create One - 2 routes with same name is ok as long as dfferent method is called ie .post
postRoutes.route("/posts").post(async(request, response) => {
    let db = database.getDb()
    let mongoObject = {
        name: request.body.name,
        position: request.body.position
    }
    let data = await db.collection("posts").insertOne(mongoObject)
    response.json(data)
})

//4 - Update One
postRoutes.route("/posts/:id").put(async(request, response) => {
    let db = database.getDb()
    let mongoObject = {
        $set: {
            name: request.body.name,
            position: request.body.position
        }

    }
    let data = await db.collection("posts").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
    response.json(data)
})

//5 - Delete One
postRoutes.route("/posts/:id").delete(async(request, response) => {
    let db = database.getDb()
    let data = await db.collection("posts").deleteOne({_id: new ObjectId(request.params.id)})
    response.json(data)
})

module.exports = postRoutes