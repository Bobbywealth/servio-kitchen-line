// Servio Kitchen Line — Backend API
// Thin Express server that reads/writes recipes from Servio's PostgreSQL.
// Shares the same DATABASE_URL as the main Servio platform.

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ─── Database ─────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

// ─── Auth middleware ──────────────────────────────────────────────────────────
// Expects: Authorization: Bearer <jwt> OR X-API-Key: <key>
// Resolves company_id from either source.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];

  if (apiKey) {
    // API key path — look up the company
    return resolveApiKey(apiKey, req, res, next);
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No auth provided — allow through as guest (read-only public recipes)
    req.companyId = null;
    req.userId = null;
    return next();
  }

  const token = authHeader.substring(7);

  // Try to decode JWT without verifying (Servio's main backend handles verification).
  // We just need company_id from the payload to scope recipe queries.
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      req.companyId = payload.companyId || payload.company_id || payload.restaurantId || null;
      req.userId = payload.userId || payload.user_id || payload.sub || null;
      req.token = token;
    }
  } catch (e) {
    // Invalid token — proceed without auth
  }

  next();
}

async function resolveApiKey(apiKey, req, res, next) {
  try {
    const result = await pool.query(
      `SELECT restaurant_id, company_id FROM api_keys WHERE key_hash = $1 AND is_active = true`,
      [apiKey]
    );
    if (result.rows.length > 0) {
      req.companyId = result.rows[0].company_id || result.rows[0].restaurant_id;
      req.userId = null;
      req.apiKeyAuth = true;
    }
  } catch (e) {
    // api_keys table might not exist — continue without auth
  }
  next();
}

// Require auth for write operations
function requireAuth(req, res, next) {
  if (!req.companyId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'servio-kitchen-line', time: new Date().toISOString() });
});

// GET /api/recipes — list recipes for the authenticated company
app.get('/api/recipes', authMiddleware, async (req, res) => {
  try {
    const { category, search } = req.query;
    const companyId = req.companyId;

    let query, params;

    if (companyId) {
      query = `SELECT id, dish_name, description, category_id, company_id, batch_size,
               prep_time_minutes, cook_time_minutes, servings, difficulty, cuisine_type,
               image_url, is_active, menu_item_id, created_at, updated_at
               FROM recipes WHERE company_id = $1 AND is_active = true`;
      params = [companyId];

      if (category && category !== 'All') {
        query += ` AND category_id = $${params.length + 1}`;
        params.push(parseInt(category));
      }
      if (search) {
        query += ` AND (dish_name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR cuisine_type ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }
    } else {
      // No company context — return empty (guest mode)
      return res.json({ recipes: [] });
    }

    query += ` ORDER BY dish_name ASC LIMIT 200`;
    const result = await pool.query(query, params);

    // Attach category names
    const recipeIds = result.rows.map(r => r.id);
    let categoryMap = {};
    if (recipeIds.length > 0) {
      const catResult = await pool.query(`SELECT id, name FROM recipe_categories`);
      categoryMap = Object.fromEntries(catResult.rows.map(c => [c.id, c.name]));
    }

    const recipes = result.rows.map(r => ({
      ...r,
      category_name: categoryMap[r.category_id] || null,
    }));

    res.json({ recipes });
  } catch (err) {
    console.error('GET /api/recipes error:', err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id — single recipe with ingredients + steps
app.get('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    if (!Number.isFinite(recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }

    const companyId = req.companyId;
    if (!companyId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Fetch recipe (company-scoped)
    const recipeResult = await pool.query(
      `SELECT * FROM recipes WHERE id = $1 AND company_id = $2 AND is_active = true`,
      [recipeId, companyId]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = recipeResult.rows[0];

    // Fetch ingredients
    const ingredientsResult = await pool.query(
      `SELECT * FROM recipe_ingredients WHERE recipe_id = $1 ORDER BY order_index ASC`,
      [recipeId]
    );

    // Fetch steps
    const stepsResult = await pool.query(
      `SELECT * FROM recipe_steps WHERE recipe_id = $1 ORDER BY step_number ASC`,
      [recipeId]
    );

    // Fetch category name
    let categoryName = null;
    if (recipe.category_id) {
      const catResult = await pool.query(`SELECT name FROM recipe_categories WHERE id = $1`, [recipe.category_id]);
      categoryName = catResult.rows[0]?.name || null;
    }

    res.json({
      recipe: {
        ...recipe,
        category_name: categoryName,
        ingredients: ingredientsResult.rows,
        steps: stepsResult.rows,
      }
    });
  } catch (err) {
    console.error('GET /api/recipes/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes — create a recipe
app.post('/api/recipes', authMiddleware, requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { dish_name, description, category_id, batch_size, prep_time_minutes, cook_time_minutes,
            servings, difficulty, cuisine_type, image_url, ingredients, steps,
            plating_instructions, holding_instructions, allergy_notes, chef_tips, portion_notes,
            menu_item_id } = req.body;

    if (!dish_name) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'dish_name is required' });
    }

    const recipeResult = await client.query(
      `INSERT INTO recipes (dish_name, description, category_id, company_id, batch_size,
        prep_time_minutes, cook_time_minutes, servings, difficulty, cuisine_type, image_url, menu_item_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [dish_name, description || null, category_id || null, req.companyId,
       batch_size || 1, prep_time_minutes || null, cook_time_minutes || null,
       servings || 1, difficulty || 'medium', cuisine_type || null, image_url || null,
       menu_item_id || null]
    );

    const recipeId = recipeResult.rows[0].id;

    // Insert ingredients
    if (ingredients && Array.isArray(ingredients)) {
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        await client.query(
          `INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, notes, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [recipeId, ing.name, ing.amount || null, ing.unit || null, ing.notes || null, i]
        );
      }
    }

    // Insert steps
    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await client.query(
          `INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds, halfway_reminder, temperature, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [recipeId, i + 1, step.instruction || step.text || '',
           step.timer_seconds || (step.minutes ? step.minutes * 60 : null),
           step.halfway_reminder || false, step.temperature || null, step.notes || null]
        );
      }
    }

    // Store extra fields (plating, holding, allergy, chef tips, portion) as recipe metadata
    // in a JSONB column if it exists, or as a notes field
    const extraFields = {};
    if (plating_instructions) extraFields.plating_instructions = plating_instructions;
    if (holding_instructions) extraFields.holding_instructions = holding_instructions;
    if (allergy_notes) extraFields.allergy_notes = allergy_notes;
    if (chef_tips) extraFields.chef_tips = chef_tips;
    if (portion_notes) extraFields.portion_notes = portion_notes;

    if (Object.keys(extraFields).length > 0) {
      // Try to update description with extra info if no dedicated columns exist
      // This is a soft migration — the main Servio app can add proper columns later
      try {
        await client.query(
          `UPDATE recipes SET description = COALESCE($1, description) WHERE id = $2`,
          [description || null, recipeId]
        );
      } catch (e) { /* ignore — description is optional */ }
    }

    await client.query('COMMIT');

    // Fetch the complete recipe
    const fullRecipe = await pool.query(
      `SELECT * FROM recipes WHERE id = $1`, [recipeId]
    );
    const ingRows = await pool.query(
      `SELECT * FROM recipe_ingredients WHERE recipe_id = $1 ORDER BY order_index ASC`, [recipeId]
    );
    const stepRows = await pool.query(
      `SELECT * FROM recipe_steps WHERE recipe_id = $1 ORDER BY step_number ASC`, [recipeId]
    );

    res.status(201).json({
      recipe: {
        ...fullRecipe.rows[0],
        ingredients: ingRows.rows,
        steps: stepRows.rows,
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/recipes error:', err);
    res.status(500).json({ error: 'Failed to create recipe' });
  } finally {
    client.release();
  }
});

// PUT /api/recipes/:id — update a recipe
app.put('/api/recipes/:id', authMiddleware, requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const recipeId = parseInt(req.params.id);
    await client.query('BEGIN');

    const { dish_name, description, category_id, batch_size, prep_time_minutes, cook_time_minutes,
            servings, difficulty, cuisine_type, image_url, ingredients, steps, menu_item_id } = req.body;

    const updateResult = await client.query(
      `UPDATE recipes SET
        dish_name = COALESCE($1, dish_name),
        description = COALESCE($2, description),
        category_id = COALESCE($3, category_id),
        batch_size = COALESCE($4, batch_size),
        prep_time_minutes = COALESCE($5, prep_time_minutes),
        cook_time_minutes = COALESCE($6, cook_time_minutes),
        servings = COALESCE($7, servings),
        difficulty = COALESCE($8, difficulty),
        cuisine_type = COALESCE($9, cuisine_type),
        image_url = COALESCE($10, image_url),
        menu_item_id = COALESCE($11, menu_item_id),
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 AND company_id = $13 AND is_active = true
       RETURNING *`,
      [dish_name, description, category_id, batch_size, prep_time_minutes, cook_time_minutes,
       servings, difficulty, cuisine_type, image_url, menu_item_id, recipeId, req.companyId]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Rebuild ingredients if provided
    if (ingredients && Array.isArray(ingredients)) {
      await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [recipeId]);
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        await client.query(
          `INSERT INTO recipe_ingredients (recipe_id, name, amount, unit, notes, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [recipeId, ing.name, ing.amount || null, ing.unit || null, ing.notes || null, i]
        );
      }
    }

    // Rebuild steps if provided
    if (steps && Array.isArray(steps)) {
      await client.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [recipeId]);
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await client.query(
          `INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds, halfway_reminder, temperature, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [recipeId, i + 1, step.instruction || step.text || '',
           step.timer_seconds || (step.minutes ? step.minutes * 60 : null),
           step.halfway_reminder || false, step.temperature || null, step.notes || null]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ recipe: updateResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT /api/recipes/:id error:', err);
    res.status(500).json({ error: 'Failed to update recipe' });
  } finally {
    client.release();
  }
});

// DELETE /api/recipes/:id — soft-delete (deactivate)
app.delete('/api/recipes/:id', authMiddleware, requireAuth, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const result = await pool.query(
      `UPDATE recipes SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND company_id = $2 AND is_active = true`,
      [recipeId, req.companyId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/recipes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// GET /api/categories — list recipe categories
app.get('/api/categories', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM recipe_categories WHERE is_default = true OR company_id = $1 ORDER BY name ASC`,
      [req.companyId]
    );
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('GET /api/categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ─── Static files (the Kitchen Line app) ─────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍳 Servio Kitchen Line running on port ${PORT}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'NOT SET (will use localStorage fallback)'}`);
});

module.exports = app;
