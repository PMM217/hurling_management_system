const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./config.env"})

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
  connectToServer: async () => {                      
    try {
      await client.connect();
      console.log("Connected successfully to MongoDB");
      database = client.db("teamData");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  },
  getDb: () => {
    if (!database) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return database;
  }
}





// const { MongoClient, ServerApiVersion } = require('mongodb');
// require("dotenv").config({path: "./config.env"})

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.ATLAS_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let database
// /* connect to Server creates connection between code and teamData database */
// module.exports = {
//   connectToServer: () => {                      
//     database = client.db("teamData")
//   },
//   getDb: () => {
//     return database
//   }
// }









/*async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/