const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for recipes
let recipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Pancetta', 'Black pepper'],
    instructions: 'Cook spaghetti. Mix eggs and cheese. Combine with hot pasta and pancetta.',
    cookingTime: 20
  },
  {
    id: 2,
    title: 'Chicken Stir Fry',
    ingredients: ['Chicken breast', 'Mixed vegetables', 'Soy sauce', 'Garlic', 'Ginger'],
    instructions: 'Cut chicken and vegetables. Stir fry in hot oil with seasonings.',
    cookingTime: 15
  }
];

let nextId = 3;

// Validation function
const validateRecipe = (recipe) => {
  return recipe.title && 
         recipe.title.trim() !== '' &&
         Array.isArray(recipe.ingredients) && 
         recipe.ingredients.length > 0 &&
         recipe.instructions && 
         recipe.instructions.trim() !== '' &&
         recipe.cookingTime && 
         recipe.cookingTime > 0;
};

// Routes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
  if (!validateRecipe(req.body)) {
    return res.status(400).json({ error: 'Invalid recipe data' });
  }

  const newRecipe = {
    id: nextId++,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    cookingTime: req.body.cookingTime
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  if (!validateRecipe(req.body)) {
    return res.status(400).json({ error: 'Invalid recipe data' });
  }

  recipe.title = req.body.title;
  recipe.ingredients = req.body.ingredients;
  recipe.instructions = req.body.instructions;
  recipe.cookingTime = req.body.cookingTime;

  res.json(recipe);
});

app.delete('/api/recipes/:id', (req, res) => {
  const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  recipes.splice(recipeIndex, 1);
  res.status(204).send();
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;