const express = require("express")
const router = express.Router()

const recipeRouter = require("./recipes");
const reviewsRouter = require("./reviews")

// If we want to add a new router this would be an example.
// const newRouter = require("./new_route");
// newRouter.use("/new_route", newRouter)

// Must be called first (before other requests are potentially triggered)
let requestCounter = 0;
function incrementRequests(req, res, next) {
    requestCounter++
    console.log(requestCounter)
    next()
}
router.use(incrementRequests)

router.use("/recipes", recipeRouter)

router.use("/recipes", reviewsRouter)
router.use("/reviews", reviewsRouter)

router.get("/stats", (req, res, next) => {
    console.log(requestCounter)
    res.json({
        TotalRequests: requestCounter
    })
})

module.exports = router