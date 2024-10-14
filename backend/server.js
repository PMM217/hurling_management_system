const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const posts = require("./postRoutes")

const app = express()
const PORT = 3000

/* Funtion used to connect middleware - handles cors library resources across different domains (F+B hosted on different ports) */
app.use(cors())
app.use(express.json())

/* Allows routes to be accessed from other parts of code */
app.use(posts)

/* Creates server */
app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})
