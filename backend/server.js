const express = require("express")
const cors = require("cors")
const connect = require("./connect")
const players = require("./playerRoutes")
const sessions = require("./routes/sessionRoutes");
const userRoutes = require("./routes/userRoutes")  // Changed from users to userRoutes

const app = express()
const PORT = 3000

/* App.use funtion that mounts Middleware - cors library helps sharing resources across differennt domains */
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(express.json())

// Increase payload limit - Allow for larger images to be accepted
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

/* Routes */
app.use('/api/users', userRoutes)  // Changed from users to userRoutes
app.use(players)
app.use("/api", sessions);

/* app.listen Creates server */
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
