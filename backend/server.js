const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for recipes (replaces database for testing)
let recipes = [
  {
    id: 1,
    name: 'Spaghetti Carbonara',
    ingredients: 'Spaghetti\nEggs\nParmesan cheese\nPancetta\nBlack pepper',
    instructions: 'Cook spaghetti. Mix eggs and cheese. Combine with hot pasta and pancetta.',
    cookTime: '20 minutes',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Chicken Stir Fry',
    ingredients: 'Chicken breast\nMixed vegetables\nSoy sauce\nGarlic\nGinger',
    instructions: 'Cut chicken and vegetables. Stir fry in hot oil with seasonings.',
    cookTime: '15 minutes',
    created_at: new Date().toISOString()
  }
];

let nextId = 3;

// Validation function
const validateRecipe = (recipe) => {
  return recipe.name && 
         recipe.name.trim() !== '' &&
         recipe.ingredients && 
         recipe.ingredients.trim() !== '' &&
         recipe.instructions && 
         recipe.instructions.trim() !== '' &&
         recipe.cookTime && 
         recipe.cookTime.trim() !== '';
};

// Get all recipes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

// Get single recipe by ID
app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

// Create new recipe
app.post('/api/recipes', (req, res) => {
  const { name, ingredients, instructions, cookTime } = req.body;
  
  if (!validateRecipe(req.body)) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newRecipe = {
    id: nextId++,
    name,
    ingredients,
    instructions,
    cookTime,
    created_at: new Date().toISOString()
  };

  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Delete recipe
app.delete('/api/recipes/:id', (req, res) => {
  const recipeIndex = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (recipeIndex === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  recipes.splice(recipeIndex, 1);
  res.status(204).send();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Recipe API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;