const express = require("express")
const apiRouter = require("./api");
const cors = require("cors");
const morgan = require("morgan");
const app = express()

// function logRequests(req, res, next) {
//     console.log("A request has been made:", req.method, req.originalUrl)
//     next()
// }

app.use(express.json())
app.use(morgan("dev")) //app.use(logRequests)

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     next()
// })
app.use(cors())

app.use("/api", apiRouter);

app.listen(8080, () => {console.log("Server running on port 8080")})