const express = require("express")
const cors = require("cors")
const connect = require("./connect")
const players = require("./playerRoutes")
const sessions = require("./routes/sessionRoutes");
const users = require("./routes/userRoutes")  // Import user routes

const app = express()
const PORT = 3000

/* Middleware */
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(express.json())

/* Routes */
app.use(players)
app.use(sessions)
app.use('/api/users', users)  // Mount user routes with prefix
app.use("/api", sessions);

/* Creates server */
async function startServer() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await connect.connectToServer()
        console.log("Successfully connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
    }
}

startServer()






// const connect = require("./connect")
// const express = require("express")
// const cors = require("cors")
// const posts = require("./playerRoutes")

// const app = express()
// const PORT = 3000

// /* Funtion used to connect middleware - handles cors library resources across different domains (F+B hosted on different ports) */
// app.use(cors())
// app.use(express.json())

// /* Allows routes to be accessed from other parts of code */
// app.use(posts)

// /* Creates server */
// app.listen(PORT, () => {
//     connect.connectToServer()
//     console.log(`Server is running on port ${PORT}`)
// })
