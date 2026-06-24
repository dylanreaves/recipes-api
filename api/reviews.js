const express = require("express")
const router = express.Router()

let reviews = [
  { id: 1, recipeId: 1, reviewer: "Sam", rating: 5, comment: "Restaurant quality." },
  { id: 2, recipeId: 1, reviewer: "Priya", rating: 4, comment: "Good but a little salty." },
  { id: 3, recipeId: 2, reviewer: "Alex", rating: 5, comment: "My new go-to." },
];

let nextReviewId = reviews.length+1;

function validReview(req, res, next) {
    const reviewer = req.body.reviewer
    const rating = Number(req.body.rating)
    const comment = req.body.comment
    if (reviewer && rating && comment && (rating > 0 && rating <= 5)) {
        next()
    } else {
        res.status(400)
        .json({
            Status: "Invalid Review",
            Current_Input: req.body,
            Expected_Input: {
                reviewer: "[string]",
                rating: "[number] (Must be 1-5)",
                comment: "[string]"
            }
        })
    }
}

router.get("/:recipeId/reviews", (req, res, next) => {
    try {
        const id = Number(req.params.recipeId)
        const matchedReviews = reviews.filter((review) => { return review.recipeId === id })
        
        if (matchedReviews.length > 0) {
            console.log("Match found!")
            res.json({
                Status: "Found",
                Reviews: matchedReviews
            })
        } else {
            console.log("Match not found!")
            return res.status(404)
            .json({
                Status: "Not Found",
                Reviews: null
            })
        }
    } catch(error) {
        next(error)
    }
})

router.post("/:recipeId/reviews", validReview, (req, res, next) => {
    try {
        const newReview = {}
        newReview.id = nextReviewId
        Object.assign(newReview, req.body)
        reviews.push(newReview)
        nextReviewId++

        console.log(newReview)
        return res.status(201)
        .json({
            Status: "Review was added",
            Review: newReview,
            AllReviews: reviews
        })
    } catch(error) {
        next(error)
    }
})

router.delete("/:recipeId/reviews/:id", (req, res, next) => {
    try {
        const id = Number(req.params.recipeId)
        const review_index = reviews.findIndex((review) => { 
            return review.id === id 
        })

        if (review_index !== -1) {
            const foundReview = reviews[review_index]
            reviews.splice(review_index, 1)
            return res.status(200) // Was supposed to respond 204 but using it does not display an output.
            .json({
                Status: "Review was removed",
                Review: foundReview,
            })
        } else {
            return res.status(404)
            .json({
                Status: "No Recipe with that Id exists.",
            })
        }
    } catch(error) {
        next(error)
    }
})



function errorHandler(err, req, res, next) {
  console.error(err);
  return res.status(500)
  .json({
    Status: "Encountered an error",
    Error: err,
  })
}

module.exports = router