import React, { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
console.log('Using API URL:', API_URL);

function App() {
  const [recipes, setRecipes] = useState([])
  const [newRecipe, setNewRecipe] = useState({
    title: '',           // Changed from 'name' to 'title'
    ingredients: '',
    instructions: '',
    cookingTime: ''      // Changed from 'cookTime' to 'cookingTime'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/recipes`)
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setNewRecipe({
      ...newRecipe,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Convert ingredients string to array for backend
      const recipeData = {
        ...newRecipe,
        ingredients: newRecipe.ingredients.split('\n').filter(ing => ing.trim()).map(ing => ing.trim()),
        cookingTime: parseInt(newRecipe.cookingTime) || 0  // Convert to number
      }

      const response = await fetch(`${API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      })

      if (response.ok) {
        setNewRecipe({ title: '', ingredients: '', instructions: '', cookingTime: '' })
        fetchRecipes()
      }
    } catch (error) {
      console.error('Error adding recipe:', error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍳 Recipe Sharing App</h1>
        <p>Share your favorite recipes with the world!</p>
      </header>

      <main className="main-content">
        <section className="add-recipe-section">
          <h2>Add New Recipe</h2>
          <form onSubmit={handleSubmit} className="recipe-form">
            <input
              type="text"
              name="title"                    // Changed from 'name' to 'title'
              placeholder="Recipe Title"
              value={newRecipe.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"                   // Changed to number input
              name="cookingTime"              // Changed from 'cookTime' to 'cookingTime'
              placeholder="Cooking Time (minutes)"
              value={newRecipe.cookingTime}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="ingredients"
              placeholder="Ingredients (one per line)"
              value={newRecipe.ingredients}
              onChange={handleInputChange}
              rows="4"
              required
            />
            <textarea
              name="instructions"
              placeholder="Cooking Instructions"
              value={newRecipe.instructions}
              onChange={handleInputChange}
              rows="6"
              required
            />
            <button type="submit">Add Recipe</button>
          </form>
        </section>

        <section className="recipes-section">
          <h2>All Recipes ({recipes.length})</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>                    {/* Changed from recipe.name */}
                  <p className="cook-time">⏱️ {recipe.cookingTime} minutes</p>  {/* Changed field name */}
                  <div className="ingredients">
                    <h4>Ingredients:</h4>
                    <ul>
                      {/* Handle ingredients as array from backend */}
                      {Array.isArray(recipe.ingredients) 
                        ? recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))
                        : recipe.ingredients.split('\n').filter(ing => ing.trim()).map((ingredient, index) => (
                            <li key={index}>{ingredient.trim()}</li>
                          ))
                      }
                    </ul>
                  </div>
                  <div className="instructions">
                    <h4>Instructions:</h4>
                    <p>{recipe.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {recipes.length === 0 && !loading && (
            <p className="no-recipes">No recipes yet. Add the first one above! 👆</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App