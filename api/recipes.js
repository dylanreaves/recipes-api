const express = require("express")
const router = express.Router()

let recipes = [
  { id: 1, title: "Spaghetti Carbonara", cuisine: "Italian", minutes: 25, servings: 4, vegetarian: false },
  { id: 2, title: "Chana Masala", cuisine: "Indian", minutes: 35, servings: 4, vegetarian: true },
  { id: 3, title: "Fish Tacos", cuisine: "Mexican", minutes: 20, servings: 3, vegetarian: false },
  { id: 4, title: "Margherita Pizza", cuisine: "Italian", minutes: 40, servings: 2, vegetarian: true },
  { id: 5, title: "Pad Thai", cuisine: "Thai", minutes: 30, servings: 2, vegetarian: false },
];

let nextId = recipes.length+1;

function validRecipe(req, res, next) {
    const title = req.body.title
    const cuisine = req.body.cuisine
    if (title && cuisine) {
        next()
    } else {
        return res.status(400)
        .json({
            Status: "Invalid Recipe",
            Current_Input: req.body,
            Expected_Input: {
                title: "[string]",
                cuisine: "[string]"
            }
        })
    }
}

router.get("/", (req, res, next) => {
    try {
        // This query works but there must be a better way to do this if the user adds more to their query
        // i.e '/api/recipes/?cuisine=Italian&vegetarian=true'
        // Only foreseen issues are validating datatypes 
        const query = req.query
        const queryKeys = Object.keys(query)
        const recipeTemplate = recipes[0]  // Default to the first recipe as an example might need a better way later.
        const expectedDataTypes = {}
        const recipeKeys = Object.keys(recipeTemplate)

        // For each of the keys in the query we expect its datatype to be the same as the one in the array.
        recipeKeys.forEach((key) => {
            expectedDataTypes[key] = typeof(recipeTemplate[key])
        })

        const convertedQuery = {}
        queryKeys.forEach((key) => {
            const expectedType = expectedDataTypes[key]
            let convertedValue = query[key]
            console.log("Typeof", key, "was found to be " + expectedType + ". Converting query value to match.")

            if (expectedType === "boolean") {
                // convertedValue = Boolean(convertedValue) 
                // This was causing an issue because the string "false" returns true.
                convertedValue = convertedValue === "true"
            } else if (expectedType === "number") {
                convertedValue = Number(convertedValue)
            } else if (expectedType === "string") {
                convertedValue = String(convertedValue)
            }

            convertedQuery[key] = convertedValue
        })

        console.log(convertedQuery)
        console.log("This is the query with corrected data types.")

        // Filter by comparing if each converted value from the querery matches its value in the array.
        const filteredRecipes = recipes.filter((recipe) => {
            return queryKeys.every((key) => {
                return recipe[key] === convertedQuery[key]
            })
        })

        console.log(filteredRecipes)

        if (filteredRecipes.length > 0) { 
            return res.json({
                Status: "Found",
                Found: filteredRecipes
            })
        } else {
            return res.status(404)
            .json({
                Status: "Not Found",
                Found: null
            })
        }
    } catch(error) {
        next(error)
    }
})

router.get("/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const matchedRecipe = recipes.find((recipe) => recipe.id === id)

        if (matchedRecipe.length > 0) {
            console.log("Match found!")
            return res.json({
                Status: "Found",
                Recipe: matchedRecipe
            })
        } else {
            console.log("Match not found!")
            return res.status(404)
            .json({
                Status: "Not Found",
                Recipe: null
            })
        }
    } catch(error) {
        next(error)
    }
})

router.post("/", validRecipe, (req, res, next) => {
    try {
        const newRecipe = {}
        newRecipe.id = nextId
        Object.assign(newRecipe, req.body)
        recipes.push(newRecipe)
        nextId++

        console.log(newRecipe)
        return res.status(201)
        .json({
            Status: "Recipe was added",
            Recipe: newRecipe
        })
    } catch(error) {
        next(error)
    }
})

router.patch("/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id) 
        
        for (let i = 0; i < recipes.length; i++) {
            const recipeInArray = recipes[i]
            if (recipeInArray.id === id) {
                const oldRecipe = Object.assign({}, recipeInArray)
                Object.assign(recipeInArray, req.body)

                console.log(req.body)
                return res.status(200)
                .json({
                    Status: "Recipe was patched",
                    OldRecipe: oldRecipe,
                    NewRecipe: recipeInArray,
                })
            }
        }
        return res.status(404)
        .json({
            Status: "No Recipe with that Id exists.",
        })
    } catch(error) {
        next(error)
    }
})

router.delete("/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const recipe_index = recipes.findIndex((recipe) => { 
            return recipe.id === id 
        })

        if (foundRecipe_idx !== -1) {
            const foundRecipe = recipes[recipe_index]
            recipes.splice(recipe_index, 1)
            return res.status(200) // Was supposed to respond 204 but using it does not display an output.
            .json({
                Status: "Recipe was removed",
                Recipe: foundRecipe,
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