const express = require("express")
const apiRouter = require("./api");
const app = express()

function logRequests(req, res, next) {
    console.log("A request has been made:", req.method, req.originalUrl)
    next()
}

app.use(express.json())
app.use(logRequests)
app.use("/api", apiRouter);

app.listen(8080, () => {console.log("Server running on port 8080")})