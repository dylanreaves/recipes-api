const express = require("express")
const router = express.Router()

const recipeRouter = require("./recipes");
const reviewsRouter = require("./reviews")

// If we want to add a new router this would be an example.
// const newRouter = require("./new_route");
// newRouter.use("/new_route", newRouter)

router.use("/recipes", recipeRouter)

router.use("/recipes", reviewsRouter)
router.use("/reviews", reviewsRouter)

module.exports = router