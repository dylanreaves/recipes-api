let recipes = [
  { id: 1, title: "Spaghetti Carbonara", cuisine: "Italian", minutes: 25, servings: 4, vegetarian: false },
  { id: 2, title: "Chana Masala", cuisine: "Indian", minutes: 35, servings: 4, vegetarian: true },
  { id: 3, title: "Fish Tacos", cuisine: "Mexican", minutes: 20, servings: 3, vegetarian: false },
  { id: 4, title: "Margherita Pizza", cuisine: "Italian", minutes: 40, servings: 2, vegetarian: true },
  { id: 5, title: "Pad Thai", cuisine: "Thai", minutes: 30, servings: 2, vegetarian: false },
];

let nextId = 6;

function logRequests(req, res, next) {
    console.log("A request has been made:", req.method, req.originalUrl)
    next()
}

function validRecipe(req, res, next) {
    console.log(req, res, next)
    if (req.body.title && req.body.cuisine) {
        next()
    } else {
        return res.status(400).send("Invalid: Recipe must have a title and cuisine.")
    }
}

const express = require("express")
const app = express()

app.use(express.json())
app.use(logRequests)

app.get("/api/recipes", (req, res, next) => {
    try {
        return res.json(recipes)
    } catch(error) {
        next(error)
    }
})

app.get("/api/recipes:id", (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const matchedRecipe = recipes.find((recipe) => recipe.id === id)
        (matchedRecipe) ? res.json(matchedRecipe) : res.status(404).send("No matching ids")
    } catch(error) {
        next(error)
    }
})

app.post("/api/recipes", validRecipe, (req, res, next) => {
    try {
        const newRecipe = {}
        newRecipe.id = nextId
        Object.assign(newRecipe, req.body)
        nextId++
        res.status(201).send("New Object added:", newRecipe.title, newRecipe.cuisine)
    } catch(error) {
        next(error)
    }
})

app.patch("/api/recipes/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id) 
        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i].id === id) {
                Object.assign(recipes[i], req.body)
                console.log(req.body)
                return res.status(200).send(recipes[i])
            }
        }
        return res.status(404).send("No recipe with that Id exists.") //res.sendStatus(404)
    } catch(error) {
        next(error)
    }
})

app.delete("/api/recipes/:id", errorHandler, (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const foundRecipe = recipes.find((recipe) => { return recipe.id === id })

        if (!foundRecipe) {
            return res.status(404).send("No recipe with that Id exists.")
        } else {
            return res.status(204).send("Deleted recipe with ID:", id)
        }

    } catch(error) {
        next(error)
    }
})

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send("Something Went Wrong!")
}

app.use(errorHandler)

app.listen(8080, () => {console.log("Server running on port 8080")})