const request = require('supertest');
const app = require('../server');

describe('Recipe API Tests', () => {
  let server;

  beforeAll(() => {
    // Start server on a different port for testing
    server = app.listen(5001);
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/recipes', () => {
    test('should return all recipes', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return recipes with correct structure', async () => {
      const response = await request(app)
        .get('/api/recipes')
        .expect(200);

      const recipe = response.body[0];
      expect(recipe).toHaveProperty('id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('ingredients');
      expect(recipe).toHaveProperty('instructions');
      expect(recipe).toHaveProperty('cookingTime');
    });
  });

  describe('POST /api/recipes', () => {
    test('should create a new recipe', async () => {
      const newRecipe = {
        title: 'Test Recipe',
        ingredients: ['Test ingredient 1', 'Test ingredient 2'],
        instructions: 'Test instructions',
        cookingTime: 30
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newRecipe.title);
      expect(response.body.ingredients).toEqual(newRecipe.ingredients);
      expect(response.body.instructions).toBe(newRecipe.instructions);
      expect(response.body.cookingTime).toBe(newRecipe.cookingTime);
    });

    test('should return 400 for invalid recipe data', async () => {
      const invalidRecipe = {
        title: '', // Empty title should fail
        ingredients: [],
        instructions: '',
        cookingTime: -1 // Negative cooking time should fail
      };

      await request(app)
        .post('/api/recipes')
        .send(invalidRecipe)
        .expect(400);
    });
  });

  describe('GET /api/recipes/:id', () => {
    test('should return a specific recipe', async () => {
      const response = await request(app)
        .get('/api/recipes/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title');
    });

    test('should return 404 for non-existent recipe', async () => {
      await request(app)
        .get('/api/recipes/999')
        .expect(404);
    });
  });

  describe('PUT /api/recipes/:id', () => {
    test('should update an existing recipe', async () => {
      const updatedRecipe = {
        title: 'Updated Test Recipe',
        ingredients: ['Updated ingredient 1', 'Updated ingredient 2'],
        instructions: 'Updated test instructions',
        cookingTime: 45
      };

      const response = await request(app)
        .put('/api/recipes/1')
        .send(updatedRecipe)
        .expect(200);

      expect(response.body.title).toBe(updatedRecipe.title);
      expect(response.body.cookingTime).toBe(updatedRecipe.cookingTime);
    });

    test('should return 404 for updating non-existent recipe', async () => {
      const updatedRecipe = {
        title: 'Updated Test Recipe',
        ingredients: ['Updated ingredient'],
        instructions: 'Updated instructions',
        cookingTime: 30
      };

      await request(app)
        .put('/api/recipes/999')
        .send(updatedRecipe)
        .expect(404);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    test('should delete an existing recipe', async () => {
      // First create a recipe to delete
      const newRecipe = {
        title: 'Recipe to Delete',
        ingredients: ['Ingredient 1'],
        instructions: 'Instructions',
        cookingTime: 20
      };

      const createResponse = await request(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201);

      const recipeId = createResponse.body.id;

      // Then delete it
      await request(app)
        .delete(`/api/recipes/${recipeId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/recipes/${recipeId}`)
        .expect(404);
    });

    test('should return 404 for deleting non-existent recipe', async () => {
      await request(app)
        .delete('/api/recipes/999')
        .expect(404);
    });
  });
});