require('dotenv').config()
const express = require("express")
const apiRouter = require("./api");
const cors = require("cors");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const app = express()

const PORT = process.env.PORT

const limiter = rateLimiter({
	windowMs: 15 * 60 * 1000,   // 15 minutes
	limit: 100,     // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8',     // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false,   // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56,     // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... ,     // Redis, Memcached, etc. See below.
})

app.use(helmet())

app.use(express.json())
app.use(limiter)
app.use(morgan("dev")) //app.use(logRequests)
app.use(cors())

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     next()
// })

app.use("/api", apiRouter);

app.listen(PORT, () => {console.log("Server running on port:", PORT)})