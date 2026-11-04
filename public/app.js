// ═══════════════════════════════════════════════════════════════════════════════
//  Servio Kitchen Line — Application Logic
//  Vanilla JS — no framework, no build step
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
  "use strict";

  // ─── Config ────────────────────────────────────────────────────────────────────
  // Points to the main Servio backend — kitchen-line is now a connected tablet UI,
  // not a standalone service. Auth token is passed via ?token= on launch.
  const API = 'https://servio-backend-zexb.onrender.com';

  // ─── I18n ──────────────────────────────────────────────────────────────────────
  const T = {
    en: {
      tagline: "Kitchen Recipes",
      search: "Search recipes or ingredients…",
      library: "Library",
      timers: "Timers",
      inactive: "INACTIVE",
      edit: "Edit",
      del: "Del",
      delete: "Delete",
      newRecipe: "+ New Recipe",
      prepShort: "PREP",
      cookShort: "COOK",
      yieldShort: "YIELD",
      prepTime: "PREP TIME",
      cookTime: "COOK TIME",
      total: "TOTAL",
      yieldStat: "YIELD",
      yieldUnit: "portions",
      min: "min",
      ingredients: "INGREDIENTS",
      allergens: "ALLERGENS",
      holding: "HOLDING & STORAGE",
      portion: "PORTION CONTROL",
      prepTitle: "PREP",
      cooking: "COOKING INSTRUCTIONS",
      plating: "PLATING",
      chefTips: "CHEF TIPS",
      noRecipes: "No recipes found",
      editRecipe: "Edit recipe",
      timersTitle: "TIMERS",
      quickAdd: "QUICK ADD",
      labelOptional: "Label (optional)",
      noTimersA: "No timers running.",
      noTimersB: "Add one above or from a recipe step.",
      pause: "Pause",
      start: "Start",
      restart: "Restart",
      resetLabel: "Reset",
      nameLabel: "RECIPE NAME",
      categoryLabel: "CATEGORY",
      prepMin: "PREP (MIN)",
      cookMin: "COOK (MIN)",
      yieldLabel: "YIELD",
      quickNote: "QUICK NOTE",
      prepSteps: "PREP STEPS",
      cookingSteps: "COOKING STEPS",
      cookingHint: "— add minutes to attach a timer",
      add: "+ Add",
      deleteRecipe: "Delete recipe",
      cancel: "Cancel",
      saveRecipe: "Save recipe",
      namePh: "e.g. Braised Oxtail",
      notePh: "Short summary shown on the card",
      ingPh: "2 lb oxtail, cut",
      stepPh: "Describe this step",
      yieldPh: "4 portions",
      adminOff: "Admin",
      adminOn: "Admin ✓",
      listBtn: "☰ List",
      gridBtn: "▦ Grid",
      all: "All",
      activate: "Activate",
      deactivate: "Deactivate",
      activeYes: "● Active",
      activeNo: "○ Inactive",
      newRecipeTitle: "New recipe",
      editRecipeTitle: "Edit recipe",
      startTimer: (m) => "Start " + m + " min timer",
      stepWord: "step",
      hintNothing: (q) => 'Nothing matches "' + q + '"',
      hintTry: "Try another category or add a recipe in Admin.",
      batch: "BATCH SCALE",
      makes: "Makes",
      timerDone: "timer done",
      viewStep: "View step",
      open: "Open timers",
      stopWord: "Stop",
      startNext: (m) => "Start next (" + m + "m)",
      running: "running",
    },
    es: {
      tagline: "Recetas de Cocina",
      search: "Buscar recetas o ingredientes…",
      library: "Recetario",
      timers: "Temporizadores",
      inactive: "INACTIVA",
      edit: "Editar",
      del: "Borrar",
      delete: "Eliminar",
      newRecipe: "+ Nueva Receta",
      prepShort: "PREP",
      cookShort: "COCCIÓN",
      yieldShort: "RINDE",
      prepTime: "PREPARACIÓN",
      cookTime: "COCCIÓN",
      total: "TOTAL",
      yieldStat: "RINDE",
      yieldUnit: "porciones",
      min: "min",
      ingredients: "INGREDIENTES",
      allergens: "ALÉRGENOS",
      holding: "CONSERVACIÓN",
      portion: "PORCIONES",
      prepTitle: "PREPARACIÓN",
      cooking: "INSTRUCCIONES DE COCCIÓN",
      plating: "EMPLATADO",
      chefTips: "CONSEJOS DEL CHEF",
      noRecipes: "No se encontraron recetas",
      editRecipe: "Editar receta",
      timersTitle: "TEMPORIZADORES",
      quickAdd: "AGREGAR RÁPIDO",
      labelOptional: "Nombre (opcional)",
      noTimersA: "No hay temporizadores activos.",
      noTimersB: "Añade uno arriba o desde un paso de receta.",
      pause: "Pausar",
      start: "Iniciar",
      restart: "Reiniciar",
      resetLabel: "Restablecer",
      nameLabel: "NOMBRE DE LA RECETA",
      categoryLabel: "CATEGORÍA",
      prepMin: "PREP (MIN)",
      cookMin: "COCCIÓN (MIN)",
      yieldLabel: "RINDE",
      quickNote: "NOTA RÁPIDA",
      prepSteps: "PASOS DE PREPARACIÓN",
      cookingSteps: "PASOS DE COCCIÓN",
      cookingHint: "— añade minutos para un temporizador",
      add: "+ Añadir",
      deleteRecipe: "Eliminar receta",
      cancel: "Cancelar",
      saveRecipe: "Guardar receta",
      namePh: "ej. Rabo de Res Estofado",
      notePh: "Resumen corto que se muestra en la tarjeta",
      ingPh: "2 lb de rabo, en trozos",
      stepPh: "Describe este paso",
      yieldPh: "4 porciones",
      adminOff: "Admin",
      adminOn: "Admin ✓",
      listBtn: "☰ Lista",
      gridBtn: "▦ Cuadrícula",
      all: "Todas",
      activate: "Activar",
      deactivate: "Desactivar",
      activeYes: "● Activa",
      activeNo: "○ Inactiva",
      newRecipeTitle: "Nueva receta",
      editRecipeTitle: "Editar receta",
      startTimer: (m) => "Iniciar temporizador de " + m + " min",
      stepWord: "paso",
      hintNothing: (q) => 'Nada coincide con "' + q + '"',
      hintTry: "Prueba otra categoría o añade una receta en Admin.",
      batch: "ESCALAR LOTE",
      makes: "Rinde",
      timerDone: "temporizador listo",
      viewStep: "Ver paso",
      open: "Abrir",
      stopWord: "Parar",
      startNext: (m) => "Iniciar siguiente (" + m + "m)",
      running: "activo",
    },
  };

  // ─── Categories ─────────────────────────────────────────────────────────────────
  // Category colors by name (pills/chips). Unknown categories fall back to a default.
  const CAT_COLORS = {
    All: null,
    Breakfast: "#e6b84a",
    Lunch: "#e0553a",
    Seafood: "#4fa3d8",
    Sides: "#43b877",
    Sauces: "#d64f8f",
    Drinks: "#8f7fe0",
    Specials: "#e0a83a",
    Wings: "#c0563b",
    Patties: "#9b6b3e",
    Appetizers: "#d98c3a",
    "Main Courses": "#e0553a",
    Desserts: "#c06a9b",
    Beverages: "#8f7fe0",
  };

  // Recipes carry category_id (not category_name) — resolve the name from the loaded
  // categories list. This is the single source of truth for a recipe's category.
  function categoryNameById(id) {
    if (id == null) return null;
    const c = (S.categories || []).find((x) => String(x.id) === String(id));
    return c ? c.name : null;
  }
  function categoryIdByName(name) {
    if (!name) return null;
    const c = (S.categories || []).find(
      (x) => (x.name || "").toLowerCase() === String(name).toLowerCase(),
    );
    return c ? c.id : null;
  }
  function recipeCategoryName(r) {
    return (
      categoryNameById(r && r.category_id) ||
      (r && r.category_name) ||
      "Uncategorized"
    );
  }

  // ─── Demo recipes (fallback when no auth) ───────────────────────────────────────
  const DEMO_RECIPES = [
    {
      id: "demo1",
      dish_name: "Braised Oxtail (Big Batch)",
      description:
        "Big-batch oxtail braised in caramelized sugar and browning, finished with peppers and a fresh blended aromatic base.",
      category_name: "Lunch",
      prep_time_minutes: 30,
      cook_time_minutes: 120,
      servings: 25,
      is_active: true,
      ingredients: [
        { name: "25–30 lb oxtail, trimmed of excess fat", order_index: 0 },
        { name: "1 cup browning sauce", order_index: 1 },
        {
          name: "1 cup mixed seasoning (Knorr + Lawry's, combined)",
          order_index: 2,
        },
        { name: "16 oz sugar", order_index: 3 },
        { name: "16 oz water (to melt the sugar)", order_index: 4 },
        { name: "4 tbsp fresh ginger, chopped", order_index: 5 },
        { name: "3000 ml (3 L) water", order_index: 6 },
        {
          name: "1 bunch scallion + garlic + onion + ginger, blended into a paste",
          order_index: 7,
        },
      ],
      steps: [
        {
          step_number: 1,
          instruction: "Cut excess fat from the oxtail.",
          timer_seconds: null,
        },
        {
          step_number: 2,
          instruction: "Wash oxtail thoroughly with vinegar, then rinse well.",
          timer_seconds: null,
        },
        {
          step_number: 3,
          instruction:
            "Blend the scallion, garlic, onion and ginger together into a seasoning paste; set aside for later.",
          timer_seconds: null,
        },
        {
          step_number: 4,
          instruction:
            "Season the trimmed oxtail with the browning, mixed seasoning (Knorr + Lawry's) and chopped ginger.",
          timer_seconds: null,
        },
        {
          step_number: 5,
          instruction:
            "In a large pot over medium-high heat, melt the sugar with the 16 oz water until it caramelizes, then add the seasoned oxtail and sear until well coated.",
          timer_seconds: null,
        },
        {
          step_number: 6,
          instruction:
            "Add the 3000 ml water and bring to a boil over medium-high heat.",
          timer_seconds: 1500,
        },
        {
          step_number: 7,
          instruction:
            "Turn the fire down to low and let it cook slowly, covered.",
          timer_seconds: 2100,
        },
        {
          step_number: 8,
          instruction:
            "Stir in the blended scallion, garlic, onion and ginger seasoning (about 1 hour after the pot went on). Continue cooking covered on low.",
          timer_seconds: 2700,
        },
        {
          step_number: 9,
          instruction:
            "Add the sliced onions and sweet peppers and cook down to finish — 2 hours total cook time minimum.",
          timer_seconds: 900,
        },
      ],
      plating:
        "Spoon over rice & peas. Ladle extra gravy on top, with peppers and onions visible on the plate.",
      holding:
        "Hold in gravy at 150°F+ on the steam table. Do not let gravy break — stir every 20 min.",
      allergens:
        "Contains: none of the top-8 by default. Check Knorr / Lawry's seasoning labels for soy or wheat additives.",
      tips: "Let the sugar go dark amber, not black, before adding water — that's what builds the deep color without turning bitter.",
      portions:
        "This is a bulk batch (25–30 lb raw). Portion after cooking at roughly 3 pieces oxtail (~8 oz) per plate.",
    },
    {
      id: "demo2",
      dish_name: "Jerk Chicken",
      description:
        "Smoky, spicy marinated chicken quarters grilled over pimento wood char.",
      category_name: "Lunch",
      prep_time_minutes: 25,
      cook_time_minutes: 40,
      servings: 4,
      is_active: true,
      ingredients: [
        { name: "4 chicken leg quarters", order_index: 0 },
        { name: "3 tbsp jerk marinade", order_index: 1 },
        { name: "2 scallions", order_index: 2 },
        { name: "1 scotch bonnet", order_index: 3 },
        { name: "1 tbsp allspice, ground", order_index: 4 },
        { name: "2 tbsp brown sugar", order_index: 5 },
        { name: "1 lime", order_index: 6 },
      ],
      steps: [
        {
          step_number: 1,
          instruction:
            "Score chicken to the bone. Rub jerk marinade into every cut.",
          timer_seconds: null,
        },
        {
          step_number: 2,
          instruction: "Marinate covered, refrigerated, minimum 4 hours.",
          timer_seconds: 14400,
        },
        {
          step_number: 3,
          instruction:
            "Bring chicken to room temp. Sear skin-side down over high heat.",
          timer_seconds: 480,
        },
        {
          step_number: 4,
          instruction:
            "Move to indirect heat, cover, and cook turning occasionally.",
          timer_seconds: 1800,
        },
        {
          step_number: 5,
          instruction:
            "Finish over direct flame for char. Rest before serving.",
          timer_seconds: 300,
        },
      ],
      plating:
        "Chop into portions across the bone. Finish with fresh lime and scallion. Serve with festival or rice & peas.",
      holding:
        "Hold at 160°F. Brush with reserved marinade to keep moist. Discard after 3 hours on the line.",
      allergens:
        "Marinade may contain soy. Confirm with prep sheet. Scotch bonnet — high heat.",
      tips: "Rest the chicken 5 min before chopping or the juices run out on the board.",
      portions: "1 quarter per plate. Cut into 3 pieces for buffet service.",
    },
    {
      id: "demo3",
      dish_name: "Blackened Salmon",
      description:
        "Cajun-spice salmon fillet with a crisp blackened crust and a tender center.",
      category_name: "Seafood",
      prep_time_minutes: 10,
      cook_time_minutes: 12,
      servings: 2,
      is_active: true,
      ingredients: [
        { name: "2 salmon fillets (6 oz each)", order_index: 0 },
        { name: "2 tbsp blackening spice", order_index: 1 },
        { name: "2 tbsp clarified butter", order_index: 2 },
        { name: "1 lemon", order_index: 3 },
        { name: "Fresh dill", order_index: 4 },
      ],
      steps: [
        {
          step_number: 1,
          instruction:
            "Pat fillets bone-dry. Coat both sides heavily with blackening spice.",
          timer_seconds: null,
        },
        {
          step_number: 2,
          instruction: "Heat cast iron until smoking. Add clarified butter.",
          timer_seconds: 180,
        },
        {
          step_number: 3,
          instruction: "Lay fillets presentation-side down; do not move.",
          timer_seconds: 240,
        },
        {
          step_number: 4,
          instruction: "Flip once, finish to 125°F internal.",
          timer_seconds: 240,
        },
      ],
      plating:
        "Present crust-side up over grits or greens. Lemon wedge at 4 o'clock. Dust with fresh dill.",
      holding:
        "Cook to order — do not hold. If unavoidable, hold max 15 min at 140°F on a sizzle plate.",
      allergens:
        "Contains: FISH. Blackening spice may contain celery. Cross-contact risk with shellfish station.",
      tips: "Dry fish = better crust. Don't crowd the pan. Pull at 120°F — carryover brings it to 125°F.",
      portions:
        "6 oz raw fillet per plate. Trim tail portions to even thickness for consistent cook.",
    },
  ];

  // ─── State ──────────────────────────────────────────────────────────────────────
  const S = {
    view: "library", // library | detail | editor
    recipes: [],
    selectedId: null,
    selectedRecipe: null,
    search: "",
    category: "All",
    layout: "grid",
    theme: "system",
    largeText: false,
    translations: {},
    cookIndex: 0,
    detailError: false,
    wakeActive: false,
    lang: "en",
    admin: false,
    timers: [],
    timerOpen: false,
    checked: {},
    scale: 1,
    draft: null,
    editingId: null,
    categories: [],
    useDemo: false,
    customName: "",
    customMin: "",
  };

  // Load persisted settings
  try {
    const saved = JSON.parse(localStorage.getItem("kl_settings") || "{}");
    if (saved.theme) S.theme = saved.theme;
    if (saved.layout) S.layout = saved.layout;
    if (saved.lang && ["en", "es"].includes(saved.lang)) S.lang = saved.lang;
    S.largeText = !!saved.largeText;
  } catch (e) {}

  // Load checked items
  try {
    S.checked = JSON.parse(localStorage.getItem("kl_checked") || "{}");
  } catch (e) {}

  // ─── Auth ───────────────────────────────────────────────────────────────────────
  function getToken() {
    // Capture credentials from the URL on launch:
    //   ?token=<jwt>   — launched from the Servio dashboard (preferred)
    //   ?key=<sk_...>  — standalone API-key auth (e.g. a shared kitchen tablet)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlKey = urlParams.get("key");
    if (urlToken || urlKey) {
      if (urlToken) localStorage.setItem("servio_access_token", urlToken);
      if (urlKey) localStorage.setItem("servio_api_key", urlKey);
      // Clean the URL immediately so credentials don't linger in history/address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // JWT preferred; fall back to legacy key for backwards compat during transition
    return (
      localStorage.getItem("servio_access_token") ||
      localStorage.getItem("servio_token")
    );
  }

  function getApiKey() {
    // servio_api_key is captured alongside the token in getToken(); read-only here.
    return localStorage.getItem("servio_api_key");
  }

  function authHeaders(extra) {
    const headers = { ...(extra || {}) };
    const token = getToken();
    const apiKey = getApiKey();
    if (token) {
      // JWT Bearer from the Servio dashboard launch
      headers["Authorization"] = "Bearer " + token;
    } else if (apiKey) {
      // Standalone API-key auth: the backend's requireAuth accepts Bearer sk_...
      // (the /api/kitchen-assistant mount runs requireAuth BEFORE the scoped
      //  requireAuthOrApiKey middleware, so the key must ride on Authorization,
      //  not X-API-Key alone — otherwise the mount returns 401.)
      headers["Authorization"] = "Bearer " + apiKey;
    }
    // Also expose the key via X-API-Key when present (read by the scoped middleware)
    if (apiKey) headers["X-API-Key"] = apiKey;
    return headers;
  }

  function getCompanyId() {
    const token = getToken();
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return (
          payload.companyId ||
          payload.company_id ||
          payload.restaurantId ||
          null
        );
      }
    } catch (e) {}
    return null;
  }

  // ─── API ────────────────────────────────────────────────────────────────────────
  async function apiGet(path) {
    const res = await fetch(API + path, { headers: authHeaders() });
    if (!res.ok) throw new Error("API " + res.status);
    return res.json();
  }
  async function apiPost(path, body) {
    const res = await fetch(API + path, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API " + res.status);
    return res.json();
  }
  async function apiPut(path, body) {
    const res = await fetch(API + path, {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API " + res.status);
    return res.json();
  }
  async function apiDelete(path) {
    const res = await fetch(API + path, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("API " + res.status);
    return res.json();
  }

  // ─── Data loading ───────────────────────────────────────────────────────────────
  async function loadRecipes() {
    try {
      // Point to main Servio backend kitchen-assistant recipe routes
      const data = await apiGet("/api/kitchen-assistant/recipes");
      // Exclude global seed/demo recipes (no company_id) — not owned by this restaurant
      S.recipes = (data.recipes || []).filter((r) => r.company_id);
      S.useDemo = false;
      // Also try loading categories
      try {
        const catData = await apiGet("/api/kitchen-assistant/categories");
        S.categories = catData.categories || [];
      } catch (e) {
        /* categories are optional */
      }
      // If we have no recipes, fall back to demo so the UI still works
      if (S.recipes.length === 0) {
        S.recipes = DEMO_RECIPES.slice();
        S.useDemo = true;
      }
    } catch (e) {
      // Fallback to demo recipes when offline or main backend unreachable
      S.recipes = DEMO_RECIPES.slice();
      S.useDemo = true;
    }
    render();
  }

  async function loadRecipeDetail(id) {
    // Demo recipe — already fully loaded
    if (S.useDemo || String(id).startsWith("demo")) {
      const r = S.recipes.find((x) => String(x.id) === String(id));
      S.selectedRecipe = mapRecipeForUI(r);
      render();
      return;
    }
    try {
      const data = await apiGet("/api/kitchen-assistant/recipes/" + id);
      S.selectedRecipe = mapRecipeForUI(data.recipe);
      render();
    } catch (e) {
      console.error("Failed to load recipe", e);
      S.detailError = true;
      render();
    }
  }

  // Map API recipe shape → UI recipe shape
  // Preserve both stored locales. Show the selected language by default, with
  // on-demand translations. Missing translations fall back to the base record.
  function mapRecipeForUI(r) {
    if (!r) return null;

    // Build per-locale field maps. `r.i18n` (list) / `r.translations` (detail)
    // hold every locale the backend has stored. `r.dish_name` etc. are the
    // base English record (already overlaid by the locale overlay when
    // ?lang=es is passed), so they're safe fallbacks.
    const perLocale = r.translations || r.i18n || {};
    const pickField = (base, locale, field) => {
      const fromLocale = perLocale[locale] && perLocale[locale][field];
      if (fromLocale != null && fromLocale !== "") return fromLocale;
      return base || "";
    };

    const buildIngredientsForLocale = (locale) => {
      const localizedList = perLocale[locale] && perLocale[locale].ingredients;
      const base = r.ingredients || [];
      return base
        .map((ing, idx) => {
          const ti = Array.isArray(localizedList) ? localizedList[idx] : null;
          const name =
            ti && ti.name != null && ti.name !== "" ? ti.name : ing.name || "";
          const unit = ti && ti.unit != null ? ti.unit : ing.unit;
          let text = name;
          if (ing.amount != null)
            text = ing.amount + (unit ? " " + unit + " " : " ") + text;
          return {
            text,
            name,
            unit,
            amount: ing.amount,
            order_index: ing.order_index || 0,
          };
        })
        .sort((a, b) => a.order_index - b.order_index);
    };

    const buildStepsForLocale = (locale) => {
      const localizedList = perLocale[locale] && perLocale[locale].steps;
      const base = (r.steps || [])
        .slice()
        .sort((a, b) => a.step_number - b.step_number);
      return base.map((s, idx) => {
        const ts = Array.isArray(localizedList) ? localizedList[idx] : null;
        const instruction =
          ts && ts.instruction != null && ts.instruction !== ""
            ? ts.instruction
            : s.instruction || "";
        return {
          text: instruction,
          minutes: s.timer_seconds ? Math.round(s.timer_seconds / 60) : null,
        };
      });
    };

    const ingredients = buildIngredientsForLocale("en");
    const steps = buildStepsForLocale("en");

    return {
      id: r.id,
      image_url: r.image_url || null,
      // Bilingual names — cards and detail both render these stacked
      name_en: pickField(r.dish_name, "en", "dish_name"),
      name_es: pickField(r.dish_name, "es", "dish_name"),
      // Back-compat shim for older render code paths
      name: r.dish_name,
      category: recipeCategoryName(r),
      prepTime: r.prep_time_minutes || 0,
      cookTime: r.cook_time_minutes || 0,
      servings: Number(r.servings) || 0,
      yield: r.servings ? r.servings + " " + t().yieldUnit : "—",
      desc_en: pickField(r.description, "en", "description"),
      desc_es: pickField(r.description, "es", "description"),
      quickNote: r.description || "",
      ingredients_en: ingredients,
      ingredients_es: buildIngredientsForLocale("es"),
      cookSteps_en: steps,
      cookSteps_es: buildStepsForLocale("es"),
      cookSteps: steps,
      prepSteps: [],
      plating_en: r.plating || "—",
      plating_es: r.plating || "—", // plating not yet translated; mirror so layout is consistent
      platingInstructions: r.plating || "—",
      holding_en: r.holding || "—",
      holding_es: r.holding || "—", // holding not yet translated; mirror
      holdingInstructions: r.holding || "—",
      allergens_en: r.allergens || "—",
      allergens_es: r.allergens || "—", // allergens not yet translated; mirror
      allergyNotes: r.allergens || "—",
      tips_en: r.tips || "—",
      tips_es: r.tips || "—", // chef tips not yet translated; mirror
      chefTips: r.tips || "—",
      portions_en: r.portions || "—",
      portions_es: r.portions || "—", // portions note not yet translated; mirror
      portionNotes: r.portions || "—",
      active: r.is_active !== false,
    };
  }

  // ─── Persistence ────────────────────────────────────────────────────────────────
  function persistSettings() {
    try {
      localStorage.setItem(
        "kl_settings",
        JSON.stringify({
          theme: S.theme,
          layout: S.layout,
          lang: S.lang,
          largeText: S.largeText,
        }),
      );
    } catch (e) {}
  }
  function persistChecked() {
    try {
      localStorage.setItem("kl_checked", JSON.stringify(S.checked));
    } catch (e) {}
  }
  function persistTimers() {
    try {
      localStorage.setItem("kl_timers", JSON.stringify(S.timers));
    } catch (e) {}
  }
  function loadTimers() {
    try {
      const arr = JSON.parse(localStorage.getItem("kl_timers") || "[]");
      const now = Date.now();
      return arr.map((t) => {
        if (t.running && t.endsAt) {
          const rem = Math.max(0, Math.round((t.endsAt - now) / 1000));
          return {
            ...t,
            remaining: rem,
            running: rem > 0,
            done: rem <= 0,
            endsAt: rem > 0 ? t.endsAt : null,
          };
        }
        return t;
      });
    } catch (e) {
      return [];
    }
  }

  // ─── Audio ──────────────────────────────────────────────────────────────────────
  let _ac;
  function beep() {
    try {
      if (navigator.vibrate) navigator.vibrate([320, 130, 320, 130, 520]);
    } catch (e) {}
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      _ac = _ac || new C();
      if (_ac.state === "suspended") _ac.resume();
      const master = _ac.createGain();
      master.gain.value = 0.95;
      master.connect(_ac.destination);
      const chirp = (t, f) => {
        const o = _ac.createOscillator(),
          g = _ac.createGain();
        o.type = "square";
        o.frequency.value = f;
        o.connect(g);
        g.connect(master);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.7, t + 0.01);
        g.gain.setValueAtTime(0.7, t + 0.16);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.start(t);
        o.stop(t + 0.22);
      };
      const base = _ac.currentTime;
      [0, 1, 2, 3].forEach((i) => chirp(base + i * 0.24, i % 2 ? 988 : 1319));
    } catch (e) {}
  }

  // ─── Timers ─────────────────────────────────────────────────────────────────────
  S.timers = loadTimers();

  function addTimer(name, min) {
    const total = Math.max(1, Math.round(min * 60));
    const t = {
      id: "t" + Date.now() + Math.random().toString(36).slice(2, 5),
      name: name || min + " min",
      total,
      remaining: total,
      running: true,
      endsAt: Date.now() + total * 1000,
      done: false,
    };
    S.timers = [t, ...S.timers];
    S.timerOpen = true;
    persistTimers();
    render();
  }
  function toggleTimer(id) {
    S.timers = S.timers.map((t) => {
      if (t.id !== id) return t;
      if (t.done)
        return {
          ...t,
          remaining: t.total,
          running: true,
          done: false,
          ack: false,
          endsAt: Date.now() + t.total * 1000,
          completedAt: null,
        };
      if (t.running)
        return {
          ...t,
          running: false,
          remaining: Math.max(
            0,
            Math.round(((t.endsAt || Date.now()) - Date.now()) / 1000),
          ),
          endsAt: null,
        };
      return { ...t, running: true, endsAt: Date.now() + t.remaining * 1000 };
    });
    persistTimers();
    render();
  }
  function resetTimer(id) {
    S.timers = S.timers.map((t) =>
      t.id === id
        ? {
            ...t,
            remaining: t.total,
            running: false,
            done: false,
            endsAt: null,
            ack: false,
            completedAt: null,
          }
        : t,
    );
    persistTimers();
    render();
  }
  function deleteTimer(id) {
    S.timers = S.timers.filter((t) => t.id !== id);
    persistTimers();
    render();
  }
  function nudgeTimer(id, seconds) {
    S.timers = S.timers.map((t) => {
      if (t.id !== id) return t;
      if (t.done || !t.running) {
        const rem = (t.done ? 0 : t.remaining) + seconds;
        return {
          ...t,
          total: Math.max(t.total, rem),
          remaining: rem,
          running: true,
          done: false,
          endsAt: Date.now() + rem * 1000,
        };
      }
      const rem =
        Math.max(
          0,
          Math.round(((t.endsAt || Date.now()) - Date.now()) / 1000),
        ) + seconds;
      return {
        ...t,
        total: Math.max(t.total, rem),
        remaining: rem,
        endsAt: Date.now() + rem * 1000,
      };
    });
    persistTimers();
    render();
  }

  // Tick every second
  setInterval(() => {
    const now = Date.now();
    let newDoneCount = 0;
    S.timers = S.timers.map((t) => {
      if (t.running && t.endsAt) {
        const rem = Math.max(0, Math.round((t.endsAt - now) / 1000));
        if (rem <= 0 && !t.done) {
          newDoneCount++;
          return {
            ...t,
            remaining: 0,
            running: false,
            done: true,
            endsAt: null,
            completedAt: now,
          };
        }
        if (rem !== t.remaining) return { ...t, remaining: rem };
      }
      return t;
    });
    const timerCountBeforeCleanup = S.timers.length;
    // Auto-remove completed timers after 30 seconds
    S.timers = S.timers.filter((t) => {
      if (t.done && t.completedAt && now - t.completedAt > 30000) return false;
      return true;
    });
    if (newDoneCount > 0) {
      persistTimers();
      beep();
    }
    const countdown = document.getElementById("header-countdown");
    const nextTimer = S.timers
      .filter((x) => x.running && !x.done)
      .sort((a, b) => a.remaining - b.remaining)[0];
    if (countdown && nextTimer)
      countdown.textContent = fmtTime(nextTimer.remaining);
    if (newDoneCount > 0 || timerCountBeforeCleanup !== S.timers.length) render();
    else if (S.timerOpen) updateTimerDisplays();
  }, 1000);

  // ─── Batch scaling ──────────────────────────────────────────────────────────────
  function toFrac(n) {
    const whole = Math.floor(n + 1e-9);
    const frac = n - whole;
    const parts = [
      [0, ""],
      [0.125, "⅛"],
      [0.25, "¼"],
      [1 / 3, "⅓"],
      [0.375, "⅜"],
      [0.5, "½"],
      [0.625, "⅝"],
      [2 / 3, "⅔"],
      [0.75, "¾"],
      [0.875, "⅞"],
      [1, ""],
    ];
    let best = parts[0],
      bd = Infinity;
    for (const p of parts) {
      const dd = Math.abs(frac - p[0]);
      if (dd < bd) {
        bd = dd;
        best = p;
      }
    }
    let w = whole,
      fs = best[1];
    if (best[0] === 1) {
      w += 1;
      fs = "";
    }
    if (w === 0 && fs) return fs;
    if (fs) return w + " " + fs;
    return String(w);
  }
  function formatQty(n) {
    return KitchenDisplay.quantity(n);
  }
  function scaleIng(text, f) {
    if (!f || f === 1) return text;
    const re =
      /^\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(\s*[-–]\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?))?/;
    const m = text.match(re);
    if (!m) return text;
    const pn = (s) => {
      s = s.trim();
      if (/\s/.test(s)) {
        const a = s.split(/\s+/);
        const fr = a[1].split("/");
        return parseFloat(a[0]) + parseFloat(fr[0]) / parseFloat(fr[1]);
      }
      if (s.indexOf("/") >= 0) {
        const fr = s.split("/");
        return parseFloat(fr[0]) / parseFloat(fr[1]);
      }
      return parseFloat(s);
    };
    let out = formatQty(pn(m[1]) * f);
    if (m[3]) out += "–" + formatQty(pn(m[3]) * f);
    return out + text.slice(m[0].length);
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────────

  function t() {
    return T[S.lang];
  }

  function getApp() {
    let app = document.getElementById("app");
    if (!app) {
      app = document.createElement("div");
      app.id = "app";
      document.body.appendChild(app);
    }
    return app;
  }

  function fmtTime(s) {
    s = Math.max(0, s | 0);
    const m = Math.floor(s / 60),
      ss = s % 60;
    return String(m).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
  }

  function catColor(key) {
    if (!key || key === "All") return null;
    return CAT_COLORS[key] || "#e0a83a";
  }
  function catLabel(key) {
    if (S.lang === "es") {
      const ES = {
        All: "Todas",
        Breakfast: "Desayuno",
        Lunch: "Almuerzo",
        Seafood: "Mariscos",
        Sides: "Guarniciones",
        Sauces: "Salsas",
        Drinks: "Bebidas",
        Specials: "Especiales",
        Wings: "Alitas",
        Patties: "Empanadas",
        Appetizers: "Aperitivos",
        "Main Courses": "Platos Fuertes",
        Desserts: "Postres",
        Beverages: "Bebidas",
      };
      return ES[key] || key;
    }
    return key;
  }

  // ─── Hold-to-reorder within a category (long-press drag) ────────────────────────
  const REORDER_HOLD_MS = 450; // press duration before drag begins
  const REORDER_MOVE_TOL = 10; // px of movement that cancels the hold (scroll/tap)
  let _drag = null; // active drag state
  let _lastDragEnd = 0; // suppress the click that follows a drag

  function sortRecipes(a, b) {
    const sa = Number(a.sort_order) || 0,
      sb = Number(b.sort_order) || 0;
    if (sa !== sb) return sa - sb;
    // Prefer English name for sort so manual reorder stays stable regardless of
    // which language the toggle is currently showing.
    const an = a.name_en || a.dish_name || a.name || "";
    const bn = b.name_en || b.dish_name || b.name || "";
    return String(an).localeCompare(String(bn));
  }

  function attachHoldToReorder(card, r) {
    if (!card) return;
    let timer = null,
      sx = 0,
      sy = 0,
      armed = false;
    card.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, a, input, textarea, select")) return;
      if (S.category === "All" || S.layout !== "grid") return; // reorder within one category, grid only
      if (e.button != null && e.button !== 0) return;
      armed = true;
      sx = e.clientX;
      sy = e.clientY;
      timer = setTimeout(() => {
        if (armed) beginReorderDrag(card, r, e);
      }, REORDER_HOLD_MS);
    });
    const cancel = () => {
      armed = false;
      clearTimeout(timer);
    };
    card.addEventListener("pointermove", (e) => {
      if (!armed) return;
      if (
        Math.abs(e.clientX - sx) > REORDER_MOVE_TOL ||
        Math.abs(e.clientY - sy) > REORDER_MOVE_TOL
      )
        cancel();
    });
    card.addEventListener("pointerup", cancel);
    card.addEventListener("pointercancel", cancel);
    card.addEventListener("pointerleave", cancel);
  }

  function beginReorderDrag(card, r, e) {
    if (_drag) return;
    const grid = card.parentElement;
    if (!grid) return;
    const rect = card.getBoundingClientRect();
    const ghost = card.cloneNode(true);
    ghost.classList.add("drag-ghost");
    Object.assign(ghost.style, {
      position: "fixed",
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      margin: "0",
      pointerEvents: "none",
      zIndex: "1000",
      opacity: "0.96",
      transform: "scale(1.03)",
    });
    document.body.appendChild(ghost);
    card.classList.add("drag-source");
    _drag = {
      grid,
      card,
      ghost,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onReorderMove);
    window.addEventListener("pointerup", endReorderDrag);
    window.addEventListener("pointercancel", endReorderDrag);
  }

  function onReorderMove(e) {
    if (!_drag) return;
    _drag.ghost.style.left = e.clientX - _drag.offsetX + "px";
    _drag.ghost.style.top = e.clientY - _drag.offsetY + "px";
    _drag.ghost.style.display = "none";
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    _drag.ghost.style.display = "";
    if (!hit) return;
    const over = hit.closest(".recipe-card");
    if (!over || over === _drag.card || !_drag.grid.contains(over)) return;
    const cards = Array.from(_drag.grid.children).filter((c) =>
      c.classList.contains("recipe-card"),
    );
    const from = cards.indexOf(_drag.card),
      to = cards.indexOf(over);
    if (from === -1 || to === -1 || from === to) return;
    _drag.grid.insertBefore(_drag.card, from < to ? over.nextSibling : over);
  }

  function endReorderDrag() {
    window.removeEventListener("pointermove", onReorderMove);
    window.removeEventListener("pointerup", endReorderDrag);
    window.removeEventListener("pointercancel", endReorderDrag);
    if (!_drag) return;
    document.body.style.userSelect = "";
    const grid = _drag.grid;
    _drag.ghost.remove();
    _drag.card.classList.remove("drag-source");
    _drag = null;
    _lastDragEnd = Date.now();
    const orderedIds = Array.from(grid.children)
      .filter((c) => c.classList.contains("recipe-card"))
      .map((c) => Number(c.getAttribute("data-rid")))
      .filter((id) => Number.isInteger(id) && id > 0);
    persistReorder(orderedIds);
  }

  async function persistReorder(orderedIds) {
    if (!orderedIds.length) return;
    const pos = {};
    orderedIds.forEach((id, i) => (pos[id] = i + 1));
    S.recipes.forEach((r) => {
      if (pos[r.id] != null) r.sort_order = pos[r.id];
    });
    if (!S.useDemo) {
      try {
        await apiPut("/api/kitchen-assistant/recipes/reorder", { orderedIds });
      } catch (e) {
        console.error("reorder persist failed", e);
      }
    }
    render();
  }

  function el(tag, props, ...children) {
    const e = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (k === "className") e.className = v;
        else if (/^on[A-Z]/.test(k))
          e.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === "html") e.innerHTML = v;
        else if (k === "style" && typeof v === "object")
          Object.assign(e.style, v);
        else if (
          k.startsWith("data-") ||
          k.startsWith("aria-") ||
          k === "role" ||
          k === "for"
        )
          e.setAttribute(k, v);
        else e[k] = v;
      }
    }
    for (const child of children) {
      if (child == null || child === false) continue;
      if (typeof child === "string" || typeof child === "number")
        e.appendChild(document.createTextNode(String(child)));
      else if (Array.isArray(child))
        child.forEach((c) => {
          if (c)
            e.appendChild(
              typeof c === "string" ? document.createTextNode(c) : c,
            );
        });
      else e.appendChild(child);
    }
    return e;
  }

  function renderLibrary() {
    const wrap = el("div", { className: "library-view" });
    const hero = el(
      "section",
      { className: "library-hero" },
      el("div", { className: "page-eyebrow" }, u().eyebrow),
      el("h1", {}, u().heading),
      el("p", {}, u().intro),
    );
    const search = el(
      "div",
      { className: "search-wrap" },
      icon("search"),
      el("input", {
        id: "recipe-search",
        type: "search",
        "aria-label": t().search,
        placeholder: t().search,
        value: S.search,
        onInput: (e) => {
          S.search = e.target.value;
          render();
        },
      }),
    );
    if (S.search)
      search.appendChild(
        el(
          "button",
          {
            "aria-label": u().clear,
            onClick: () => {
              S.search = "";
              render();
              document.getElementById("recipe-search")?.focus();
            },
          },
          icon("close"),
        ),
      );
    hero.appendChild(search);
    wrap.appendChild(hero);
    // Category bar
    let list = S.recipes.slice();
    if (!S.admin) list = list.filter((r) => r.is_active !== false);
    if (S.category !== "All")
      list = list.filter((r) => recipeCategoryName(r) === S.category);
    const q = S.search.trim().toLowerCase();
    if (q)
      list = list.filter((r) => {
        const names = [
          r.dish_name,
          r.name,
          r.name_en,
          r.name_es,
          r.i18n?.es?.dish_name,
          r.i18n?.en?.dish_name,
        ]
          .filter(Boolean)
          .map((s) => s.toLowerCase());
        const descs = [r.description, r.quickNote, r.desc_en, r.desc_es]
          .filter(Boolean)
          .map((s) => s.toLowerCase());
        return (
          names.some((n) => n.includes(q)) ||
          descs.some((d) => d.includes(q)) ||
          (r.ingredients || []).some((i) =>
            (i.name || "").toLowerCase().includes(q),
          )
        );
      });
    list.sort(sortRecipes);

    const catBar = el("div", {
      className: "cat-bar",
      style: { padding: "20px 22px 0", maxWidth: "1440px", margin: "0 auto" },
    });
    // Build category pills dynamically from the categories actually present in recipes
    const orderList = [
      "Breakfast",
      "Lunch",
      "Sides",
      "Wings",
      "Patties",
      "Drinks",
      "Appetizers",
      "Main Courses",
      "Desserts",
      "Beverages",
      "Specials",
      "Sauces",
      "Seafood",
    ];
    const presentNames = [];
    (S.recipes || []).forEach((r) => {
      if (S.admin || r.is_active !== false) {
        const n = recipeCategoryName(r);
        if (n && !presentNames.includes(n)) presentNames.push(n);
      }
    });
    presentNames.sort((a, b) => {
      const ia = orderList.indexOf(a),
        ib = orderList.indexOf(b);
      return (
        (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b)
      );
    });
    const pills = [{ key: "All", color: null }].concat(
      presentNames.map((n) => ({ key: n, color: catColor(n) })),
    );
    pills.forEach((c) => {
      const count =
        c.key === "All"
          ? S.recipes.filter((r) => S.admin || r.is_active !== false).length
          : S.recipes.filter(
              (r) =>
                (S.admin || r.is_active !== false) &&
                recipeCategoryName(r) === c.key,
            ).length;
      const isActive = S.category === c.key;
      const col = c.color;
      const pill = el(
        "button",
        {
          className: "cat-pill" + (isActive ? " active" : ""),
          "aria-pressed": isActive,
          onClick: () => {
            S.category = c.key;
            render();
          },
        },
        catLabel(c.key),
        el("span", { className: "count" }, String(count)),
      );
      // All categories use the same high-contrast selected treatment.
      catBar.appendChild(pill);
    });
    // Layout toggle + new recipe
    if (S.admin) {
      const newBtn = el(
        "button",
        {
          className: "cat-pill",
          onClick: () => {
            S.view = "editor";
            S.editingId = null;
            S.draft = blankDraft();
            render();
          },
        },
        t().newRecipe,
      );
      newBtn.style.background = "var(--accent)";
      newBtn.style.color = "var(--accent-ink)";
      newBtn.style.borderColor = "transparent";
      catBar.appendChild(newBtn);
    }
    const layoutBtn = button(
      S.layout === "grid"
        ? S.lang === "es"
          ? "Lista"
          : "List"
        : S.lang === "es"
          ? "Cuadrícula"
          : "Grid",
      () => {
        S.layout = S.layout === "grid" ? "list" : "grid";
        persistSettings();
        render();
      },
      "cat-pill layout-toggle",
      S.layout === "grid" ? "list" : "grid",
    );
    catBar.appendChild(layoutBtn);
    wrap.appendChild(catBar);

    // Demo banner
    if (S.useDemo) {
      wrap.appendChild(
        el(
          "div",
          {
            style: {
              margin: "16px 22px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(224,168,58,.1)",
              border: "1px solid rgba(224,168,58,.3)",
              fontSize: "13.5px",
              color: "var(--accent)",
              maxWidth: "1440px",
            },
          },
          "⚠ Demo mode — not connected to Servio database. Open via Servio dashboard to see your recipes.",
        ),
      );
    }

    if (
      S.category !== "All" &&
      S.layout === "grid" &&
      !S.useDemo &&
      list.length > 1
    ) {
      wrap.appendChild(
        el(
          "div",
          { className: "reorder-hint" },
          S.lang === "es"
            ? "Mantén pulsada una tarjeta para reordenar"
            : "Tip: hold a card to rearrange",
        ),
      );
    }

    wrap.appendChild(
      el(
        "div",
        { className: "library-results" },
        el("h2", {}, S.category === "All" ? u().browse : catLabel(S.category)),
        el("span", {}, list.length + " " + u().results),
      ),
    );
    if (list.length === 0) {
      wrap.appendChild(
        el(
          "div",
          { className: "empty-state" },
          icon("chef"),
          el("div", { className: "title" }, t().noRecipes),
          el(
            "div",
            { style: { fontSize: "14px", marginTop: "6px" } },
            q ? t().hintNothing(S.search) : t().hintTry,
          ),
        ),
      );
      return wrap;
    }

    if (S.layout === "grid") {
      const grid = el("div", { className: "recipe-grid" });
      list.forEach((r) => grid.appendChild(renderCard(r)));
      wrap.appendChild(grid);
    } else {
      const list2 = el("div", { className: "recipe-list" });
      list.forEach((r) => list2.appendChild(renderListItem(r)));
      wrap.appendChild(list2);
    }
    return wrap;
  }

  function renderCard(r) {
    const cat = recipeCategoryName(r);
    const col = catColor(cat) || "#e0a83a";
    const inactive = r.is_active === false;
    // Bilingual: cards show both English (primary) and Spanish (secondary).
    // If only one locale is available (e.g. demo recipes), show just that one
    // — the helper hides the duplicate line.
    const nameEn = localized(r, "dish_name").trim();
    const nameEs = (r.name_es || "").trim();
    const showBilingualName = false;
    const quickNoteEn = localized(r, "description").trim();
    const quickNoteEs = (r.desc_es || "").trim();
    const showBilingualNote = false;
    const mapped = {
      prepTime: r.prep_time_minutes,
      cookTime: r.cook_time_minutes,
      yield: r.servings ? r.servings + " " + t().yieldUnit : "—",
    };

    const card = el("article", {
      className: "recipe-card",
      "data-rid": String(r.id),
      tabIndex: 0,
      role: "button",
      "aria-label": nameEn,
      onKeyDown: (e) => {
        if (e.target !== e.currentTarget) return;
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          openRecipe(r.id);
        }
      },
      onClick: () => {
        if (Date.now() - _lastDragEnd < 500) return;
        openRecipe(r.id);
      },
    });
    const imgArea = el("div", {
      className: "card-img",
      style: { background: col + "22" },
    });
    if (r.image_url) {
      const photo = el("img", {
        className: "card-img-photo",
        src: r.image_url,
        alt: r.dish_name || r.name || "",
        loading: "lazy",
      });
      photo.onerror = () => {
        photo.remove();
        imgArea.appendChild(icon("chef"));
      };
      imgArea.appendChild(photo);
    } else {
      imgArea.appendChild(icon("chef"));
    }
    imgArea.appendChild(
      el(
        "div",
        { className: "card-overlay" },
        el("span", { className: "card-chip" }, catLabel(cat)),
        inactive
          ? el("span", { className: "card-chip inactive" }, t().inactive)
          : null,
      ),
    );
    card.appendChild(imgArea);

    // Bilingual title block: English on top (primary), Spanish below (secondary)
    const titleBlock = el(
      "div",
      { className: "card-title" },
      el("div", { className: "card-title-en" }, nameEn || r.dish_name || ""),
      showBilingualName
        ? el("div", { className: "card-title-es" }, nameEs)
        : null,
    );
    card.appendChild(
      el(
        "div",
        { className: "card-body" },
        titleBlock,
        el(
          "div",
          { className: "card-stats" },
          el(
            "div",
            {},
            el("div", { className: "stat-label" }, t().prepShort),
            el("div", { className: "stat-val" }, (mapped.prepTime || 0) + "m"),
          ),
          el(
            "div",
            {},
            el("div", { className: "stat-label" }, t().cookShort),
            el("div", { className: "stat-val" }, (mapped.cookTime || 0) + "m"),
          ),
          el(
            "div",
            {},
            el("div", { className: "stat-label" }, t().yieldShort),
            el("div", { className: "stat-val" }, mapped.yield || "—"),
          ),
        ),
        el(
          "div",
          { className: "card-note" },
          el("div", { className: "card-note-en" }, quickNoteEn || ""),
          showBilingualNote
            ? el("div", { className: "card-note-es" }, quickNoteEs)
            : null,
        ),
      ),
    );
    if (S.admin) {
      const actions = el("div", { className: "card-actions" });
      actions.appendChild(
        el(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              toggleActive(r.id);
            },
          },
          inactive ? t().activate : t().deactivate,
        ),
      );
      actions.appendChild(
        el(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              S.view = "editor";
              S.editingId = r.id;
              loadRecipeForEdit(r);
            },
          },
          t().edit,
        ),
      );
      actions.appendChild(
        el(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              deleteRecipe(r.id);
            },
            style: { color: "var(--danger)" },
          },
          t().delete,
        ),
      );
      card.appendChild(actions);
    }
    attachHoldToReorder(card, r);
    return card;
  }

  function renderListItem(r) {
    const cat = recipeCategoryName(r);
    const col = catColor(cat) || "#e0a83a";
    const nameEn = localized(r, "dish_name").trim();
    const nameEs = (r.name_es || "").trim();
    const showBilingualName = false;
    const mapped = {
      prepTime: r.prep_time_minutes || r.prepTime,
      cookTime: r.cook_time_minutes || r.cookTime,
    };

    const item = el("button", {
      className: "list-item",
      onClick: () => openRecipe(r.id),
    });
    item.appendChild(
      el(
        "span",
        {
          className: "list-chip",
          style: { background: col + "26", color: col },
        },
        cat,
      ),
    );
    item.appendChild(
      el(
        "div",
        { className: "list-body" },
        el(
          "div",
          { className: "list-title" },
          el(
            "div",
            { className: "list-title-en" },
            nameEn || r.dish_name || "",
          ),
          showBilingualName
            ? el("div", { className: "list-title-es" }, nameEs)
            : null,
        ),
        r.description
          ? el("div", { className: "list-note" }, localized(r, "description"))
          : null,
      ),
    );
    item.appendChild(
      el(
        "div",
        { className: "list-meta" },
        t().prepShort +
          " " +
          (mapped.prepTime || 0) +
          " · " +
          t().cookShort +
          " " +
          (mapped.cookTime || 0),
      ),
    );
    return item;
  }

  function toggleActive(id) {
    if (S.useDemo) {
      S.recipes = S.recipes.map((r) =>
        r.id === id ? { ...r, is_active: !r.is_active } : r,
      );
      render();
      return;
    }
    // API doesn't have toggle — would need a PATCH. For now just reload.
    loadRecipes();
  }

  async function deleteRecipe(id) {
    if (!confirm("Delete this recipe?")) return;
    if (S.useDemo || String(id).startsWith("demo")) {
      S.recipes = S.recipes.filter((r) => r.id !== id);
      render();
      return;
    }
    try {
      await apiDelete("/api/kitchen-assistant/recipes/" + id);
    } catch (e) {}
    await loadRecipes();
  }

  // ─── Detail view ───────────────────────────────────────────────────────────────
  function statCard(label, val, unit) {
    return el(
      "div",
      { className: "stat-card" },
      el("div", { className: "stat-label" }, label),
      el(
        "div",
        { className: "stat-val" },
        String(val || 0),
        el("span", { className: "stat-unit" }, unit ? " " + unit : ""),
      ),
    );
  }

  function renderSection(label, content, extraClass) {
    return el(
      "section",
      { className: "detail-section" + (extraClass ? " " + extraClass : "") },
      el("div", { className: "section-label" }, label),
      content,
    );
  }

  // Native-friendly UI. Recipe data, writes and timer engine remain in the existing app.
  const uiText = {
    en: {
      recipes: "Recipes",
      search: "Search",
      settings: "Settings",
      eyebrow: "YOUR KITCHEN COMPANION",
      heading: "Good food starts here.",
      intro: "Find your recipe. Set your batch. Cook with confidence.",
      browse: "Browse recipes",
      results: "recipes",
      cook: "Start cooking",
      cookMode: "Cook mode",
      exitCook: "Back to recipe",
      next: "Next step",
      previous: "Previous",
      finish: "Finish cooking",
      finished: "All steps complete",
      finishNote:
        "Check the recipe’s serving and holding instructions before serving.",
      review: "Review recipe",
      step: "Step",
      of: "of",
      translation: "Show Spanish",
      hideTranslation: "Hide translation",
      appearance: "Appearance",
      system: "Device",
      light: "Light",
      dark: "Dark",
      language: "Language",
      accessibility: "Reading comfort",
      largeText: "Larger text",
      management: "Recipe management",
      adminHint:
        "Show the existing recipe editing tools. Your server permissions still apply.",
      install: "Add to your home screen",
      installHint:
        "iPhone / iPad: Share, then Add to Home Screen. Android / desktop: use your browser’s Install app menu.",
      installNow: "Install app",
      close: "Close",
      ready: "ready",
      ingredientsHint: "Tap each ingredient as you gather it.",
      reset: "Reset checklist",
      batch: "Batch size",
      makes: "Makes",
      standard: "Original recipe",
      wakeOn: "Screen stays awake",
      wakeOff: "Keep an eye on your screen lock",
      wakeNote:
        "Wake lock is unavailable. Adjust your device’s auto-lock if needed.",
      checkTimer: (m) => "Check in " + m + " min",
      timerNote: "Suggested check timer. Follow the recipe for doneness.",
      timerHint: "Timers keep running while you browse.",
      saved: "Your progress is saved on this device.",
      recipe: "Recipe",
      loading: "Loading recipe…",
      failed: "Could not load this recipe.",
      retry: "Try again",
      clear: "Clear search",
      back: "Back",
      fallback:
        "Some text is shown in its original language when no translation is saved.",
    },
    es: {
      recipes: "Recetas",
      search: "Buscar",
      settings: "Ajustes",
      eyebrow: "TU AYUDANTE DE COCINA",
      heading: "Todo empieza en tu cocina.",
      intro: "Busca tu receta. Ajusta las porciones. Cocina con confianza.",
      browse: "Explorar recetas",
      results: "recetas",
      cook: "Comenzar a cocinar",
      cookMode: "Modo cocina",
      exitCook: "Volver a la receta",
      next: "Siguiente paso",
      previous: "Anterior",
      finish: "Terminar",
      finished: "Todos los pasos completados",
      finishNote:
        "Revisa las instrucciones de servicio y conservación antes de servir.",
      review: "Revisar receta",
      step: "Paso",
      of: "de",
      translation: "Ver inglés",
      hideTranslation: "Ocultar traducción",
      appearance: "Apariencia",
      system: "Dispositivo",
      light: "Claro",
      dark: "Oscuro",
      language: "Idioma",
      accessibility: "Lectura cómoda",
      largeText: "Texto más grande",
      management: "Administrar recetas",
      adminHint:
        "Muestra las herramientas de edición existentes. Se mantienen los permisos del servidor.",
      install: "Añadir a la pantalla de inicio",
      installHint:
        "iPhone / iPad: Compartir y Añadir a pantalla de inicio. Android / ordenador: usa Instalar aplicación en el navegador.",
      installNow: "Instalar aplicación",
      close: "Cerrar",
      ready: "listos",
      ingredientsHint: "Marca cada ingrediente al prepararlo.",
      reset: "Restablecer lista",
      batch: "Tamaño del lote",
      makes: "Rinde",
      standard: "Receta original",
      wakeOn: "La pantalla permanece activa",
      wakeOff: "Revisa el bloqueo de pantalla",
      wakeNote:
        "No se puede mantener la pantalla activa. Ajusta el bloqueo automático si es necesario.",
      checkTimer: (m) => "Revisar en " + m + " min",
      timerNote:
        "Temporizador sugerido. Sigue la receta para comprobar la cocción.",
      timerHint: "Los temporizadores siguen activos mientras navegas.",
      saved: "Tu progreso se guarda en este dispositivo.",
      recipe: "Receta",
      loading: "Cargando receta…",
      failed: "No se pudo cargar la receta.",
      retry: "Reintentar",
      clear: "Borrar búsqueda",
      back: "Volver",
      fallback:
        "El texto sin traducción guardada se muestra en su idioma original.",
    },
  };
  function u() {
    return uiText[S.lang];
  }
  function icon(name) {
    const paths = {
      book: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z M20 4h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h3z",
      search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
      timer:
        "M9 2h6 M12 8v5l3 2 M18 5l2 2 M21 13a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
      settings: "M4 6h16 M4 12h16 M4 18h16 M8 3v6 M16 9v6 M9 15v6",
      back: "M14 6l-6 6 6 6",
      arrow: "M5 12h14 M13 6l6 6-6 6",
      check: "M5 12l4 4L19 6",
      chef: "M7 15V9a4 4 0 1 1 2-7 4 4 0 0 1 6 0 4 4 0 1 1 2 7v6z M7 19h10 M7 15h10v6H7z",
      globe:
        "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
      close: "M6 6l12 12 M18 6L6 18",
      sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1",
      moon: "M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11",
      plus: "M12 5v14 M5 12h14",
      grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
      list: "M8 6h13 M8 12h13 M8 18h13 M3 6h1 M3 12h1 M3 18h1",
      screen: "M3 4h18v13H3z M8 21h8 M12 17v4",
      download: "M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4",
    };
    const span = el("span", { className: "ui-icon", "aria-hidden": "true" });
    span.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' +
      (paths[name] || paths.book) +
      '"/></svg>';
    return span;
  }
  function button(label, fn, cls, ico) {
    return el(
      "button",
      { className: cls || "soft-button", onClick: fn },
      ico ? icon(ico) : null,
      el("span", {}, label),
    );
  }
  function localized(raw, field) {
    const tr = raw.translations || raw.i18n || {};
    return tr[S.lang]?.[field] || raw[field] || "";
  }
  function recipeTitle(d) {
    return d["name_" + S.lang] || d.name || "";
  }
  function goLibrary() {
    releaseWake();
    S.view = "library";
    S.selectedId = null;
    S.cookIndex = 0;
    render();
    window.scrollTo(0, 0);
  }
  function openRecipe(id) {
    S.selectedRecipe = null;
    S.detailError = false;
    S.view = "detail";
    S.selectedId = id;
    S.scale = 1;
    S.cookIndex = 0;
    render();
    window.scrollTo(0, 0);
    loadRecipeDetail(id);
  }
  function changeLanguage(lang) {
    S.lang = lang;
    S.translations = {};
    persistSettings();
    render();
  }
  function themeValue() {
    return S.theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : S.theme;
  }
  let wakeSentinel = null,
    installPrompt = null;
  async function requestWake() {
    if (S.view !== "cook" || document.visibilityState !== "visible") return;
    try {
      if (!wakeSentinel && !S.wakePending && navigator.wakeLock) {
        S.wakePending = true;
        wakeSentinel = await navigator.wakeLock.request("screen");
        wakeSentinel.addEventListener("release", () => {
          wakeSentinel = null;
          S.wakeActive = false;
          if (S.view === "cook") render();
        });
      }
      S.wakeActive = !!wakeSentinel;
    } catch (e) {
      S.wakeActive = false;
    } finally {
      S.wakePending = false;
    }
    if (S.view !== "cook") {
      releaseWake();
      return;
    }
    render();
  }
  function releaseWake() {
    const w = wakeSentinel;
    wakeSentinel = null;
    S.wakeActive = false;
    if (w) w.release().catch(() => {});
  }
  function startCooking() {
    S.view = "cook";
    S.cookIndex = 0;
    render();
    window.scrollTo(0, 0);
    requestWake();
  }
  function exitCooking() {
    releaseWake();
    S.view = "detail";
    render();
    window.scrollTo(0, 0);
  }
  function flipCheck(key) {
    if (S.checked[key]) delete S.checked[key];
    else S.checked[key] = true;
    persistChecked();
    render();
  }
  function activeIngredients(d) {
    return d["ingredients_" + S.lang] || d.ingredients_en || [];
  }
  function activeSteps(d) {
    return d["cookSteps_" + S.lang] || d.cookSteps || [];
  }
  function ingredientText(row) {
    return (
      KitchenDisplay.ingredient(row, S.scale, S.lang) ||
      scaleIng(row.text || "", S.scale)
    );
  }
  function showTranslation(key, primary, alternate) {
    if (!alternate || alternate.trim() === primary.trim()) return null;
    const wrap = el("div", { className: "translation-wrap" });
    wrap.appendChild(
      el(
        "button",
        {
          className: "translation-toggle",
          "aria-expanded": !!S.translations[key],
          onClick: (e) => {
            e.stopPropagation();
            S.translations[key] = !S.translations[key];
            render();
          },
        },
        icon("globe"),
        S.translations[key] ? u().hideTranslation : u().translation,
      ),
    );
    if (S.translations[key])
      wrap.appendChild(
        el(
          "p",
          {
            className: "translation-text",
            lang: S.lang === "en" ? "es" : "en",
          },
          alternate,
        ),
      );
    return wrap;
  }
  function render() {
    const previousFocus = document.activeElement;
    const focusId = previousFocus?.id;
    const selection =
      typeof previousFocus?.selectionStart === "number"
        ? [previousFocus.selectionStart, previousFocus.selectionEnd]
        : null;
    const drawerScroll = document.querySelector(".timer-list")?.scrollTop || 0;
    document.documentElement.dataset.theme = themeValue();
    document.documentElement.lang = S.lang;
    document.documentElement.dataset.largeText = String(!!S.largeText);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        themeValue() === "dark" ? "#151b19" : "#f5f6f2",
      );
    document.body.style.background = "var(--bg)";
    const app = getApp();
    app.innerHTML = "";
    app.appendChild(renderHeader());
    const main = el("main", { id: "main-content" });
    if (S.view === "library") main.appendChild(renderLibrary());
    else if (S.view === "detail") main.appendChild(renderDetail());
    else if (S.view === "cook") main.appendChild(renderCookMode());
    else if (S.view === "settings") main.appendChild(renderSettings());
    else if (S.view === "editor") main.appendChild(renderEditor());
    app.appendChild(main);
    app.appendChild(renderNavigation());
    if (S.timerOpen) {
      app.appendChild(renderTimerOverlay());
      app.appendChild(renderTimerDrawer());
    }
    const alert = renderAlert();
    if (alert) app.appendChild(alert);
    app
      .querySelectorAll(
        'button,input,select,textarea,[role="checkbox"],[role="button"]',
      )
      .forEach((node, index) => {
        if (!node.id) node.id = "control-" + index;
      });
    if (S.timerOpen) {
      const drawer = document.querySelector(".timer-drawer");
      drawer.setAttribute("role", "dialog");
      drawer.setAttribute("aria-modal", "true");
      drawer.setAttribute("aria-label", t().timers);
      document.querySelector(".timer-list").scrollTop = drawerScroll;
    }
    if (focusId) {
      const next = document.getElementById(focusId);
      if (next) {
        next.focus({ preventScroll: true });
        if (selection && next.setSelectionRange)
          try {
            next.setSelectionRange(...selection);
          } catch (e) {}
      }
    }
    if (
      S.timerOpen &&
      !document.querySelector(".timer-drawer")?.contains(document.activeElement)
    )
      document.querySelector(".timer-close")?.focus({ preventScroll: true });
  }
  function renderHeader() {
    const header = el("header", { className: "header" });
    if (S.view === "library" || S.view === "settings")
      header.appendChild(
        el(
          "div",
          { className: "brand" },
          el("img", {
            className: "brand-image",
            src: "/icon-192.png",
            alt: "Servio",
          }),
          el(
            "div",
            {},
            el("div", { className: "brand-name" }, "Servio"),
            el("div", { className: "brand-tag" }, "Kitchen Line"),
          ),
        ),
      );
    else
      header.appendChild(
        button(
          S.view === "cook" ? u().exitCook : u().recipes,
          S.view === "cook" ? exitCooking : goLibrary,
          "back-btn",
          "back",
        ),
      );
    const actions = el("div", { className: "header-actions" });
    actions.appendChild(
      el(
        "button",
        {
          id: "language-switch",
          className: "language-switch",
          "aria-label":
            S.lang === "en" ? "Cambiar a español" : "Switch to English",
          onClick: () => changeLanguage(S.lang === "en" ? "es" : "en"),
        },
        icon("globe"),
        S.lang === "en" ? "EN" : "ES",
      ),
    );
    const soon = S.timers
      .filter((x) => x.running && !x.done)
      .sort((a, b) => a.remaining - b.remaining)[0];
    const timerBtn = button(
      soon ? fmtTime(soon.remaining) : t().timers,
      () => {
        S.timerOpen = true;
        render();
      },
      "btn-timers",
      "timer",
    );
    timerBtn.id = "header-timers";
    if (soon)
      timerBtn.querySelector("span:not(.ui-icon)").id = "header-countdown";
    actions.appendChild(timerBtn);
    header.appendChild(actions);
    return header;
  }
  function renderNavigation() {
    const nav = el("nav", {
      className: "app-nav",
      "aria-label":
        S.lang === "en" ? "Main navigation" : "Navegación principal",
    });
    const entries = [
      [
        "book",
        u().recipes,
        () => {
          goLibrary();
          S.search = "";
          render();
        },
        S.view === "library" && !S.search,
      ],
      [
        "search",
        u().search,
        () => {
          goLibrary();
          document.getElementById("recipe-search")?.focus();
        },
        S.view === "library" && !!S.search,
      ],
      [
        "timer",
        t().timers,
        () => {
          S.timerOpen = true;
          render();
        },
        S.timerOpen,
      ],
      [
        "settings",
        u().settings,
        () => {
          releaseWake();
          S.view = "settings";
          render();
          window.scrollTo(0, 0);
        },
        S.view === "settings",
      ],
    ];
    entries.forEach(([ico, label, fn, active]) => {
      const b = button(label, fn, "nav-item" + (active ? " active" : ""), ico);
      if (active) b.setAttribute("aria-current", "page");
      if (ico === "timer" && S.timers.length)
        b.appendChild(
          el("span", { className: "nav-badge" }, String(S.timers.length)),
        );
      nav.appendChild(b);
    });
    return nav;
  }
  function renderSettings() {
    const wrap = el("div", { className: "settings-view" });
    wrap.appendChild(el("div", { className: "page-eyebrow" }, "KITCHEN LINE"));
    wrap.appendChild(el("h1", {}, u().settings));
    function setting(label, content) {
      return el(
        "section",
        { className: "settings-section" },
        el("h2", {}, label),
        content,
      );
    }
    const themes = el("div", {
      className: "segmented",
      "aria-label": u().appearance,
    });
    ["system", "light", "dark"].forEach((v) =>
      themes.appendChild(
        el(
          "button",
          {
            "aria-pressed": S.theme === v,
            className: S.theme === v ? "selected" : "",
            onClick: () => {
              S.theme = v;
              persistSettings();
              render();
            },
          },
          u()[v],
        ),
      ),
    );
    wrap.appendChild(setting(u().appearance, themes));
    const langs = el("div", { className: "segmented" });
    [
      ["en", "English"],
      ["es", "Español"],
    ].forEach(([v, label]) =>
      langs.appendChild(
        el(
          "button",
          {
            "aria-pressed": S.lang === v,
            className: S.lang === v ? "selected" : "",
            onClick: () => changeLanguage(v),
          },
          label,
        ),
      ),
    );
    wrap.appendChild(
      setting(
        u().language,
        el(
          "div",
          {},
          langs,
          el("p", { className: "settings-help" }, u().fallback),
        ),
      ),
    );
    wrap.appendChild(
      setting(
        u().accessibility,
        el(
          "button",
          {
            className: "setting-toggle",
            role: "switch",
            "aria-checked": !!S.largeText,
            onClick: () => {
              S.largeText = !S.largeText;
              persistSettings();
              render();
            },
          },
          u().largeText,
          el("span", { className: "toggle-track" }, el("span")),
        ),
      ),
    );
    wrap.appendChild(
      setting(
        u().management,
        el(
          "div",
          {},
          el(
            "button",
            {
              className: "setting-toggle",
              role: "switch",
              "aria-checked": S.admin,
              onClick: () => {
                S.admin = !S.admin;
                render();
              },
            },
            "Admin",
            el("span", { className: "toggle-track" }, el("span")),
          ),
          el("p", { className: "settings-help" }, u().adminHint),
        ),
      ),
    );
    wrap.appendChild(
      setting(
        u().install,
        el(
          "div",
          {},
          el("p", { className: "settings-help" }, u().installHint),
          installPrompt
            ? button(
                u().installNow,
                async () => {
                  await installPrompt.prompt();
                  await installPrompt.userChoice;
                  installPrompt = null;
                  render();
                },
                "primary-button",
                "download",
              )
            : null,
        ),
      ),
    );
    return wrap;
  }
  function renderDetail() {
    if (!S.selectedRecipe)
      return el(
        "div",
        { className: "empty-state", role: "status" },
        S.detailError ? u().failed : u().loading,
        S.detailError
          ? button(u().retry, () => loadRecipeDetail(S.selectedId))
          : null,
      );
    const d = S.selectedRecipe,
      wrap = el("div", { className: "detail-view" });
    const intro = el("section", { className: "recipe-intro" });
    const title = el(
      "div",
      { className: "recipe-intro-copy" },
      el("div", { className: "page-eyebrow" }, catLabel(d.category)),
      el("h1", { className: "detail-title" }, recipeTitle(d)),
    );
    const note = d["desc_" + S.lang] || d.quickNote;
    if (note) title.appendChild(el("p", { className: "detail-note" }, note));
    title.appendChild(
      showTranslation(
        "title",
        recipeTitle(d),
        d["name_" + (S.lang === "en" ? "es" : "en")] || "",
      ),
    );
    const availableSteps = activeSteps(d);
    if (availableSteps.length)
      title.appendChild(
        button(u().cook, startCooking, "primary-button", "chef"),
      );
    if (S.admin)
      title.appendChild(
        button(
          t().editRecipe,
          () => {
            S.view = "editor";
            S.editingId = d.id;
            loadRecipeForEdit(S.recipes.find((r) => r.id === d.id) || d);
          },
          "soft-button",
        ),
      );
    intro.appendChild(title);
    if (d.image_url)
      intro.appendChild(
        el("img", {
          className: "detail-hero-photo",
          src: d.image_url,
          alt: recipeTitle(d),
        }),
      );
    wrap.appendChild(intro);
    const stats = el("div", { className: "stat-grid" });
    if (d.prepTime)
      stats.appendChild(statCard(t().prepTime, d.prepTime, t().min));
    if (d.cookTime)
      stats.appendChild(statCard(t().cookTime, d.cookTime, t().min));
    if (d.prepTime + d.cookTime)
      stats.appendChild(statCard(t().total, d.prepTime + d.cookTime, t().min));
    stats.appendChild(
      statCard(
        t().yieldStat,
        d.servings ? KitchenDisplay.quantity(d.servings * S.scale) : "—",
        d.servings ? t().yieldUnit : "",
      ),
    );
    wrap.appendChild(stats);
    const batch = el("section", {
      className: "batch-row",
      "aria-label": u().batch,
    });
    batch.appendChild(
      el(
        "div",
        { className: "batch-caption" },
        el("strong", {}, u().batch),
        el(
          "span",
          {},
          S.scale === 1 ? u().standard : KitchenDisplay.quantity(S.scale) + "×",
        ),
      ),
    );
    const presets = el("div", { className: "batch-presets" });
    [0.5, 1, 2, 3, 4].forEach((v) =>
      presets.appendChild(
        el(
          "button",
          {
            "aria-pressed": S.scale === v,
            className: S.scale === v ? "active" : "",
            onClick: () => {
              S.scale = v;
              render();
            },
          },
          v === 0.5 ? "½×" : v + "×",
        ),
      ),
    );
    batch.appendChild(presets);
    batch.appendChild(
      el(
        "div",
        { className: "batch-manual" },
        el(
          "button",
          {
            "aria-label": S.lang === "en" ? "Decrease batch" : "Reducir lote",
            onClick: () => {
              S.scale = Math.max(0.5, S.scale - 0.5);
              render();
            },
          },
          "−",
        ),
        el(
          "span",
          { className: "val" },
          KitchenDisplay.quantity(S.scale) + "×",
        ),
        el(
          "button",
          {
            "aria-label": S.lang === "en" ? "Increase batch" : "Aumentar lote",
            onClick: () => {
              S.scale = Math.min(20, S.scale + 0.5);
              render();
            },
          },
          "+",
        ),
      ),
    );
    wrap.appendChild(batch);
    const cols = el("div", { className: "detail-cols" }),
      left = el("div", { className: "detail-col" }),
      right = el("div", { className: "detail-col wide" });
    const ingredients = activeIngredients(d),
      count = ingredients.filter(
        (_, i) => S.checked[d.id + ":ing:" + i],
      ).length;
    const ingSection = renderSection(
      t().ingredients,
      el(
        "div",
        {},
        el(
          "div",
          { className: "checklist-caption" },
          el("span", {}, count + " / " + ingredients.length + " " + u().ready),
          button(
            u().reset,
            () => {
              ingredients.forEach(
                (_, i) => delete S.checked[d.id + ":ing:" + i],
              );
              persistChecked();
              render();
            },
            "text-button",
          ),
        ),
        el("p", { className: "section-hint" }, u().ingredientsHint),
        ...ingredients.map((row, i) => {
          const key = d.id + ":ing:" + i,
            checked = !!S.checked[key];
          return el(
            "button",
            {
              role: "checkbox",
              "aria-checked": checked,
              className: "ing-item" + (checked ? " checked" : ""),
              onClick: () => flipCheck(key),
            },
            el(
              "span",
              { className: "ing-box" },
              checked ? icon("check") : null,
            ),
            el("span", { className: "ing-text" }, ingredientText(row)),
          );
        }),
      ),
    );
    left.appendChild(ingSection);
    [
      ["allergens", "allergyNotes", "section-warn"],
      ["holding", "holdingInstructions", ""],
      ["portion", "portionNotes", ""],
    ].forEach(([label, field, cls]) => {
      if (d[field] && d[field] !== "—")
        left.appendChild(
          renderSection(
            t()[label],
            el("p", { className: "section-text" }, d[field]),
            cls,
          ),
        );
    });
    if (d.prepSteps?.length)
      right.appendChild(
        renderStepsSection(t().prepTitle, d.prepSteps, d.id, "prep"),
      );
    if (availableSteps.length)
      right.appendChild(
        renderStepsSection(
          t().cooking,
          availableSteps,
          d.id,
          "cook",
          d["cookSteps_" + (S.lang === "en" ? "es" : "en")],
        ),
      );
    [
      ["plating", "platingInstructions", ""],
      ["chefTips", "chefTips", "section-tip"],
    ].forEach(([label, field, cls]) => {
      if (d[field] && d[field] !== "—")
        right.appendChild(
          renderSection(
            t()[label],
            el("p", { className: "section-text" }, d[field]),
            cls,
          ),
        );
    });
    cols.appendChild(left);
    cols.appendChild(right);
    wrap.appendChild(cols);
    return wrap;
  }
  function renderStepsSection(label, steps, recipeId, kind, alternates) {
    return renderSection(
      label,
      el(
        "div",
        { className: "step-list" },
        ...steps.map((s, i) => {
          const key = recipeId + ":" + kind + ":" + i,
            text = typeof s === "string" ? s : s.text || "",
            checked = !!S.checked[key],
            row = el("article", {
              className: "step-item" + (checked ? " checked" : ""),
            });
          row.appendChild(
            el(
              "button",
              {
                className: "step-num",
                role: "checkbox",
                "aria-checked": checked,
                "aria-label": u().step + " " + (i + 1),
                onClick: () => flipCheck(key),
              },
              checked ? icon("check") : String(i + 1),
            ),
          );
          const body = el(
            "div",
            { className: "step-content" },
            el("p", { className: "step-text" }, text),
          );
          const alternate = alternates?.[i];
          body.appendChild(
            showTranslation(
              key,
              text,
              typeof alternate === "string" ? alternate : alternate?.text || "",
            ),
          );
          const timer = KitchenDisplay.timerFor(s);
          if (timer)
            body.appendChild(
              button(
                timer.inferred
                  ? u().checkTimer(timer.minutes)
                  : t().startTimer(timer.minutes),
                () =>
                  addTimer(
                    recipeTitle(S.selectedRecipe) +
                      " · " +
                      u().step +
                      " " +
                      (i + 1),
                    timer.minutes,
                  ),
                "step-timer-btn",
                "timer",
              ),
            );
          row.appendChild(body);
          return row;
        }),
      ),
    );
  }
  function renderCookMode() {
    const d = S.selectedRecipe;
    if (!d) return el("div", { className: "empty-state" }, u().loading);
    const steps = activeSteps(d),
      index = Math.min(S.cookIndex, steps.length),
      done = index === steps.length;
    const wrap = el("div", { className: "cook-view" });
    wrap.appendChild(
      el(
        "div",
        { className: "cook-topline" },
        el("span", { className: "page-eyebrow" }, u().cookMode),
        el(
          "span",
          { className: "wake-status", title: S.wakeActive ? "" : u().wakeNote },
          icon("screen"),
          S.wakeActive ? u().wakeOn : u().wakeOff,
        ),
      ),
    );
    wrap.appendChild(
      el("h1", { className: "cook-recipe-name" }, recipeTitle(d)),
    );
    const progress = el(
      "div",
      {
        className: "cook-progress",
        role: "progressbar",
        "aria-label": u().cookMode,
        "aria-valuemin": 0,
        "aria-valuemax": steps.length,
        "aria-valuenow": index,
      },
      el("span", {
        style: {
          width: (steps.length ? (index / steps.length) * 100 : 0) + "%",
        },
      }),
    );
    wrap.appendChild(progress);
    if (done) {
      wrap.appendChild(
        el(
          "section",
          { className: "cook-card" },
          icon("check"),
          el("h2", {}, u().finished),
          el("p", {}, u().finishNote),
          button(u().review, exitCooking, "primary-button", "book"),
        ),
      );
      return wrap;
    }
    const step = steps[index],
      key = d.id + ":cook:" + index,
      card = el("section", { className: "cook-card" });
    card.appendChild(
      el(
        "div",
        { className: "cook-step-label" },
        u().step + " " + (index + 1) + " " + u().of + " " + steps.length,
      ),
    );
    card.appendChild(
      el("h2", { className: "cook-instruction" }, step.text || step),
    );
    const alternate =
      d["cookSteps_" + (S.lang === "en" ? "es" : "en")]?.[index];
    card.appendChild(
      showTranslation("cook:" + key, step.text || step, alternate?.text || ""),
    );
    const timer = KitchenDisplay.timerFor(step);
    if (timer) {
      card.appendChild(
        button(
          timer.inferred
            ? u().checkTimer(timer.minutes)
            : t().startTimer(timer.minutes),
          () =>
            addTimer(
              recipeTitle(d) + " · " + u().step + " " + (index + 1),
              timer.minutes,
            ),
          "primary-button cook-timer",
          "timer",
        ),
      );
      if (timer.inferred)
        card.appendChild(el("p", { className: "section-hint" }, u().timerNote));
    }
    card.appendChild(
      el(
        "div",
        { className: "cook-controls" },
        el(
          "button",
          {
            className: "soft-button",
            disabled: index === 0,
            onClick: () => {
              S.cookIndex--;
              render();
            },
          },
          icon("back"),
          u().previous,
        ),
        button(
          index === steps.length - 1 ? u().finish : u().next,
          () => {
            S.checked[key] = true;
            persistChecked();
            S.cookIndex++;
            render();
            window.scrollTo(0, 0);
          },
          "primary-button",
          "arrow",
        ),
      ),
    );
    wrap.appendChild(card);
    const next = steps[index + 1];
    if (next)
      wrap.appendChild(
        el(
          "div",
          { className: "up-next" },
          el("strong", {}, u().next),
          el("p", {}, next.text || next),
        ),
      );
    wrap.appendChild(
      el("p", { className: "progress-note" }, icon("check"), u().saved),
    );
    let touch = null;
    wrap.addEventListener(
      "touchstart",
      (e) => {
        if (e.target.closest("button,input")) return;
        touch = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        };
      },
      { passive: true },
    );
    wrap.addEventListener(
      "touchend",
      (e) => {
        if (!touch) return;
        const dx = e.changedTouches[0].clientX - touch.x,
          dy = e.changedTouches[0].clientY - touch.y;
        touch = null;
        if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        S.cookIndex = Math.max(
          0,
          Math.min(steps.length, S.cookIndex + (dx < 0 ? 1 : -1)),
        );
        render();
      },
      { passive: true },
    );
    return wrap;
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
    if (S.view === "settings") render();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (S.view === "settings") render();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (S.theme === "system") render();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && S.view === "cook")
      requestWake();
  });
  document.addEventListener("keydown", (e) => {
    const typing = e.target.matches(
      'input,textarea,select,[contenteditable="true"]',
    );
    if (e.key === "Escape") {
      if (S.timerOpen) {
        S.timerOpen = false;
        render();
        document.getElementById("header-timers")?.focus();
      } else if (S.view === "cook") exitCooking();
      return;
    }
    if (S.timerOpen && e.key === "Tab") {
      const controls = [
        ...document.querySelectorAll(
          ".timer-drawer button,.timer-drawer input",
        ),
      ].filter((x) => !x.disabled);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    if (
      !typing &&
      !S.timerOpen &&
      S.view === "cook" &&
      ["ArrowRight", "ArrowLeft"].includes(e.key)
    ) {
      e.preventDefault();
      S.cookIndex = Math.max(
        0,
        Math.min(
          activeSteps(S.selectedRecipe).length,
          S.cookIndex + (e.key === "ArrowRight" ? 1 : -1),
        ),
      );
      render();
    }
  });

  // ─── Editor ────────────────────────────────────────────────────────────────────
  function blankDraft() {
    return {
      name: "",
      category: "Lunch",
      prepTime: "",
      cookTime: "",
      yield: "",
      quickNote: "",
      ingredients: [""],
      cookSteps: [{ text: "", minutes: "" }],
      plating: "",
      holding: "",
      allergens: "",
      tips: "",
      portions: "",
      active: true,
    };
  }

  async function loadRecipeForEdit(source) {
    if (!source) {
      S.draft = blankDraft();
      render();
      return;
    }
    // If demo or already-mapped
    if (source.dish_name || source.name) {
      const mapped = S.useDemo
        ? {
            name: source.name,
            prepTime: source.prepTime,
            cookTime: source.cookTime,
            yield: source.yield,
            quickNote: source.quickNote,
            ingredients: source.ingredients,
            cookSteps: source.cookSteps,
            plating: source.plating,
            holding: source.holding,
            allergens: source.allergens,
            tips: source.tips,
            portions: source.portions,
          }
        : mapRecipeForUI(source);
      S.draft = {
        name: mapped.name || "",
        category: recipeCategoryName(source),
        prepTime: String(mapped.prepTime || ""),
        cookTime: String(mapped.cookTime || ""),
        yield: mapped.yield || "",
        quickNote: mapped.quickNote || "",
        ingredients: (mapped.ingredients || []).map((i) =>
          typeof i === "string" ? i : i.text,
        ),
        cookSteps: (mapped.cookSteps || []).map((s) => ({
          text: s.text,
          minutes: s.minutes ? String(s.minutes) : "",
        })),
        plating: mapped.platingInstructions || "",
        holding: mapped.holdingInstructions || "",
        allergens: mapped.allergyNotes || "",
        tips: mapped.chefTips || "",
        portions: mapped.portionNotes || "",
        active: source.is_active !== false,
      };
      render();
    } else {
      // Load from API
      try {
        const data = await apiGet(
          "/api/kitchen-assistant/recipes/" + source.id,
        );
        const r = data.recipe;
        const mapped = mapRecipeForUI(r);
        S.draft = {
          name: mapped.name,
          category: recipeCategoryName(r),
          prepTime: String(mapped.prepTime || ""),
          cookTime: String(mapped.cookTime || ""),
          yield: mapped.yield,
          quickNote: mapped.quickNote,
          ingredients: mapped.ingredients.map((i) => i.text),
          cookSteps: mapped.cookSteps.map((s) => ({
            text: s.text,
            minutes: s.minutes ? String(s.minutes) : "",
          })),
          plating: mapped.platingInstructions,
          holding: mapped.holdingInstructions,
          allergens: mapped.allergyNotes,
          tips: mapped.chefTips,
          portions: mapped.portionNotes,
          active: r.is_active !== false,
        };
        render();
      } catch (e) {
        S.draft = blankDraft();
        render();
      }
    }
  }

  function renderEditor() {
    const d = S.draft || blankDraft();
    const tr = t();
    const wrap = el("div", { className: "editor-view" });
    wrap.appendChild(
      el(
        "div",
        { className: "editor-title" },
        S.editingId ? tr.editRecipeTitle : tr.newRecipeTitle,
      ),
    );

    const form = el("div", {});

    // Name
    form.appendChild(
      field(
        tr.nameLabel,
        el("input", {
          type: "text",
          className: "large",
          placeholder: tr.namePh,
          value: d.name,
          onInput: (e) => (d.name = e.target.value),
        }),
      ),
    );

    // Category + active
    const catSelect = el("select", {
      onChange: (e) => (d.category = e.target.value),
    });
    (S.categories || []).forEach((c) => {
      const opt = el("option", { value: c.name }, catLabel(c.name));
      if (c.name === d.category) opt.selected = true;
      catSelect.appendChild(opt);
    });
    const activeBtn = el(
      "button",
      {
        onClick: () => {
          d.active = !d.active;
          render();
        },
        style: {
          height: "52px",
          padding: "0 20px",
          borderRadius: "12px",
          border:
            "1px solid " + (d.active ? "var(--success)" : "var(--border)"),
          background: d.active ? "rgba(67,184,119,.14)" : "var(--surface)",
          color: d.active ? "var(--success)" : "var(--text-dim)",
          fontFamily: "'Archivo'",
          fontWeight: "700",
          fontSize: "14.5px",
        },
      },
      d.active ? tr.activeYes : tr.activeNo,
    );
    form.appendChild(
      el(
        "div",
        { className: "editor-row" },
        el(
          "div",
          {
            className: "editor-field",
            style: { flex: "1", minWidth: "180px" },
          },
          el("label", {}, tr.categoryLabel),
          catSelect,
        ),
        el(
          "div",
          {
            className: "editor-field",
            style: { flex: "none", alignSelf: "flex-end" },
          },
          activeBtn,
        ),
      ),
    );

    // Prep / Cook / Yield
    form.appendChild(
      el(
        "div",
        { className: "editor-row" },
        field(
          tr.prepMin,
          el("input", {
            type: "number",
            className: "mono",
            placeholder: "0",
            value: d.prepTime,
            onInput: (e) => (d.prepTime = e.target.value),
          }),
        ),
        field(
          tr.cookMin,
          el("input", {
            type: "number",
            className: "mono",
            placeholder: "0",
            value: d.cookTime,
            onInput: (e) => (d.cookTime = e.target.value),
          }),
        ),
        field(
          tr.yieldLabel,
          el("input", {
            type: "text",
            placeholder: tr.yieldPh,
            value: d.yield,
            onInput: (e) => (d.yield = e.target.value),
          }),
        ),
      ),
    );

    // Quick note
    form.appendChild(
      field(
        tr.quickNote,
        el(
          "textarea",
          {
            placeholder: tr.notePh,
            onInput: (e) => (d.quickNote = e.target.value),
          },
          d.quickNote,
        ),
      ),
    );

    // Ingredients
    form.appendChild(
      arrField(
        tr.ingredients,
        d.ingredients,
        tr.ingPh,
        (val) => d.ingredients.push(val),
        (idx) => {
          d.ingredients.splice(idx, 1);
          render();
        },
        (idx, val) => (d.ingredients[idx] = val),
      ),
    );

    // Cooking steps
    const cookLabel = el(
      "div",
      {},
      tr.cookingSteps + " ",
      el(
        "span",
        {
          style: {
            color: "var(--text-faint)",
            fontWeight: "500",
            textTransform: "none",
            letterSpacing: "0",
          },
        },
        tr.cookingHint,
      ),
    );
    form.appendChild(
      cookStepsField(
        cookLabel,
        d.cookSteps,
        (idx) => {
          d.cookSteps.splice(idx, 1);
          render();
        },
        (idx, key, val) => {
          d.cookSteps[idx][key] = val;
        },
      ),
    );

    // Plating / Holding
    form.appendChild(
      el(
        "div",
        { className: "editor-row" },
        field(
          tr.plating,
          el(
            "textarea",
            {
              style: { minHeight: "80px" },
              onInput: (e) => (d.plating = e.target.value),
            },
            d.plating,
          ),
        ),
        field(
          tr.holding,
          el(
            "textarea",
            {
              style: { minHeight: "80px" },
              onInput: (e) => (d.holding = e.target.value),
            },
            d.holding,
          ),
        ),
      ),
    );
    // Allergens / Tips
    form.appendChild(
      el(
        "div",
        { className: "editor-row" },
        field(
          tr.allergens,
          el(
            "textarea",
            {
              style: { minHeight: "70px" },
              onInput: (e) => (d.allergens = e.target.value),
            },
            d.allergens,
          ),
        ),
        field(
          tr.chefTips,
          el(
            "textarea",
            {
              style: { minHeight: "70px" },
              onInput: (e) => (d.tips = e.target.value),
            },
            d.tips,
          ),
        ),
      ),
    );
    // Portion
    form.appendChild(
      field(
        tr.portion,
        el(
          "textarea",
          {
            style: { minHeight: "60px" },
            onInput: (e) => (d.portions = e.target.value),
          },
          d.portions,
        ),
      ),
    );

    wrap.appendChild(form);

    // Actions
    const actions = el("div", { className: "editor-actions" });
    if (S.editingId) {
      actions.appendChild(
        el(
          "button",
          {
            className: "btn-danger",
            onClick: () => {
              deleteRecipe(S.editingId);
              S.view = "library";
              S.editingId = null;
            },
          },
          tr.deleteRecipe,
        ),
      );
    }
    actions.appendChild(el("div", { style: { flex: "1" } }));
    actions.appendChild(
      el(
        "button",
        {
          className: "btn-cancel",
          onClick: () => {
            S.view = S.editingId ? "detail" : "library";
            S.editingId = null;
            render();
          },
        },
        tr.cancel,
      ),
    );
    actions.appendChild(
      el(
        "button",
        { className: "btn-save", onClick: saveDraft },
        tr.saveRecipe,
      ),
    );
    wrap.appendChild(actions);

    return wrap;
  }

  function field(label, input) {
    if (!input.id)
      input.id =
        "field-" +
        String(label)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
    return el(
      "div",
      { className: "editor-field" },
      el("label", { htmlFor: input.id }, label),
      input,
    );
  }

  function arrField(label, items, ph, onAdd, onRemove, onChange) {
    const wrap = el("div", { className: "editor-field" });
    const hdr = el("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "11px",
      },
    });
    hdr.appendChild(
      el(
        "label",
        {
          style: {
            fontFamily: "'Archivo'",
            fontWeight: "700",
            fontSize: "12.5px",
            letterSpacing: ".1em",
            color: "var(--text-faint)",
          },
        },
        label,
      ),
    );
    hdr.appendChild(
      el(
        "button",
        {
          className: "editor-add-btn",
          onClick: () => {
            onAdd("");
            render();
          },
        },
        t().add,
      ),
    );
    wrap.appendChild(hdr);
    items.forEach((item, i) => {
      const row = el("div", { className: "editor-arr-item" });
      const inp = el("input", {
        "aria-label": String(label) + " " + (i + 1),
        type: "text",
        placeholder: ph,
        value: item,
        onInput: (e) => onChange(i, e.target.value),
      });
      row.appendChild(inp);
      row.appendChild(
        el(
          "button",
          { className: "remove-btn", onClick: () => onRemove(i) },
          "×",
        ),
      );
      wrap.appendChild(row);
    });
    return wrap;
  }

  function cookStepsField(label, items, onRemove, onChange) {
    const wrap = el("div", { className: "editor-field" });
    const hdr = el("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "11px",
      },
    });
    hdr.appendChild(
      el(
        "label",
        {
          style: {
            fontFamily: "'Archivo'",
            fontWeight: "700",
            fontSize: "12.5px",
            letterSpacing: ".1em",
            color: "var(--text-faint)",
          },
        },
        label,
      ),
    );
    hdr.appendChild(
      el(
        "button",
        {
          className: "editor-add-btn",
          onClick: () => {
            items.push({ text: "", minutes: "" });
            render();
          },
        },
        t().add,
      ),
    );
    wrap.appendChild(hdr);
    items.forEach((item, i) => {
      const row = el("div", { className: "editor-arr-item" });
      row.appendChild(
        el(
          "textarea",
          {
            "aria-label": t().stepWord + " " + (i + 1),
            placeholder: t().stepPh,
            onInput: (e) => onChange(i, "text", e.target.value),
          },
          item.text || "",
        ),
      );
      row.appendChild(
        el("input", {
          "aria-label": t().min + " " + (i + 1),
          type: "number",
          className: "mono",
          placeholder: t().min,
          style: {
            flex: "none",
            width: "78px",
            height: "50px",
            padding: "0 12px",
            borderRadius: "11px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            fontFamily: "'JetBrains Mono'",
            fontWeight: "700",
            fontSize: "15px",
            textAlign: "center",
          },
          value: item.minutes || "",
          onInput: (e) => onChange(i, "minutes", e.target.value),
        }),
      );
      row.appendChild(
        el(
          "button",
          { className: "remove-btn", onClick: () => onRemove(i) },
          "×",
        ),
      );
      wrap.appendChild(row);
    });
    return wrap;
  }

  async function saveDraft() {
    const d = S.draft;
    if (!d.name.trim()) {
      alert("Recipe name is required");
      return;
    }

    const payload = {
      dish_name: d.name.trim(),
      description: d.quickNote,
      category_id: categoryIdByName(d.category),
      prep_time_minutes: parseInt(d.prepTime) || null,
      cook_time_minutes: parseInt(d.cookTime) || null,
      servings: parseInt(d.yield) || 1,
      ingredients: d.ingredients
        .map((x) => ({ name: x.trim() }))
        .filter((x) => x.name),
      steps: d.cookSteps
        .filter((s) => (s.text || "").trim())
        .map((s) => ({
          instruction: s.text.trim(),
          timer_seconds: s.minutes ? parseInt(s.minutes) * 60 : null,
        })),
      plating_instructions: d.plating,
      holding_instructions: d.holding,
      allergy_notes: d.allergens,
      chef_tips: d.tips,
      portion_notes: d.portions,
    };

    try {
      if (S.editingId && !S.useDemo) {
        await apiPut("/api/kitchen-assistant/recipes/" + S.editingId, payload);
      } else if (!S.useDemo) {
        await apiPost("/api/kitchen-assistant/recipes", payload);
      } else {
        // Demo mode — save to local array
        const newRecipe = {
          id: "demo" + Date.now(),
          dish_name: payload.dish_name,
          description: payload.description,
          category_name: d.category,
          prep_time_minutes: payload.prep_time_minutes,
          cook_time_minutes: payload.cook_time_minutes,
          servings: payload.servings,
          is_active: d.active,
          ingredients: payload.ingredients.map((x, i) => ({
            name: x.name,
            order_index: i,
          })),
          steps: payload.steps.map((s, i) => ({
            step_number: i + 1,
            instruction: s.instruction,
            timer_seconds: s.timer_seconds,
          })),
          plating: payload.plating_instructions,
          holding: payload.holding_instructions,
          allergens: payload.allergy_notes,
          tips: payload.chef_tips,
          portions: payload.portion_notes,
        };
        S.recipes.unshift(newRecipe);
      }
      S.view = "library";
      S.editingId = null;
      if (!S.useDemo) await loadRecipes();
      else render();
    } catch (e) {
      alert("Save failed: " + e.message);
    }
  }

  // ─── Timer drawer ──────────────────────────────────────────────────────────────
  function updateTimerDisplays() {
  // A clock tick must not replace inputs, steal focus or reset the reader's scroll.
  S.timers.forEach(tm => {
    const card = document.querySelector('[data-timer-id="' + tm.id + '"]');
    if (!card) return;
    const color = tm.done ? 'var(--danger)' : tm.running ? (tm.remaining <= 10 ? 'var(--danger)' : tm.remaining <= 60 ? 'var(--warn)' : 'var(--success)') : 'var(--text)';
    const display = card.querySelector('.timer-card-display');
    display.textContent = fmtTime(tm.remaining);
    display.style.color = color;
    display.style.animation = tm.done || (tm.running && tm.remaining <= 10) ? 'pulse .9s ease-in-out infinite' : 'none';
    card.classList.toggle('urgent', tm.done || (tm.running && tm.remaining <= 10));
    const bar = card.querySelector('.timer-card-bar-fill');
    bar.style.width = (tm.total ? Math.max(0,Math.min(100,tm.remaining / tm.total * 100)) : 0) + '%';
    bar.style.background = color;
  });
}

function renderTimerDrawer() {
    const tr = t();
    const drawer = el("aside", {
      className: "timer-drawer" + (S.timerOpen ? " open" : ""),
    });

    drawer.appendChild(
      el(
        "div",
        { className: "timer-header" },
        el("h2", {}, tr.timersTitle),
        el(
          "button",
          {
            className: "timer-close",
            id: "timer-close",
            "aria-label": u().close,
            onClick: () => {
              S.timerOpen = false;
              render();
            },
          },
          "×",
        ),
      ),
    );

    // Quick add
    const quick = el("div", { className: "timer-quick" });
    quick.appendChild(
      el("div", { className: "timer-quick-label" }, tr.quickAdd),
    );
    const grid = el("div", { className: "timer-quick-grid" });
    [5, 10, 15, 30].forEach((m) =>
      grid.appendChild(
        el(
          "button",
          { onClick: () => addTimer(m + " min", m) },
          String(m) + " " + tr.min,
        ),
      ),
    );
    quick.appendChild(grid);
    const custom = el("div", { className: "timer-custom" });
    custom.appendChild(
      el("input", {
        id: "timer-label",
        "aria-label": tr.labelOptional,
        type: "text",
        placeholder: tr.labelOptional,
        value: S.customName,
        onInput: (e) => (S.customName = e.target.value),
      }),
    );
    custom.appendChild(
      el("input", {
        id: "timer-minutes",
        "aria-label": tr.min,
        min: "0.1",
        max: "1440",
        step: "0.1",
        type: "number",
        className: "mono",
        placeholder: tr.min,
        value: S.customMin,
        onInput: (e) => (S.customMin = e.target.value),
      }),
    );
    custom.appendChild(
      el(
        "button",
        {
          className: "add-btn",
          "aria-label": tr.add,
          onClick: () => {
            const m = parseFloat(S.customMin);
            if (!Number.isFinite(m) || m <= 0 || m > 1440) return;
            addTimer(S.customName.trim() || m + " min", m);
            S.customName = "";
            S.customMin = "";
          },
        },
        "+",
      ),
    );
    quick.appendChild(custom);
    drawer.appendChild(quick);

    // Timer list
    const list = el("div", { className: "timer-list" });
    if (S.timers.length === 0) {
      list.appendChild(
        el(
          "div",
          { className: "timer-empty" },
          icon("timer"),
          tr.noTimersA,
          el("br"),
          tr.noTimersB,
        ),
      );
    } else {
      // Sort: done first, then running (by remaining), then paused
      const sorted = S.timers.slice().sort((a, b) => {
        const rank = (t) => (t.done ? 0 : t.running ? 1 : 2);
        const ra = rank(a),
          rb = rank(b);
        if (ra !== rb) return ra - rb;
        if (ra === 1) return a.remaining - b.remaining;
        return 0;
      });

      sorted.forEach((tm) => {
        const pct = tm.total
          ? Math.max(0, Math.min(100, (tm.remaining / tm.total) * 100))
          : 0;
        const running = tm.running,
          done = tm.done;
        let col = "var(--text)";
        if (done) col = "var(--danger)";
        else if (running)
          col =
            tm.remaining <= 10
              ? "var(--danger)"
              : tm.remaining <= 60
                ? "var(--warn)"
                : "var(--success)";

        const card = el("div", {
          "data-timer-id": tm.id,
          className:
            "timer-card" +
            (done || (running && tm.remaining <= 10) ? " urgent" : ""),
        });
        card.appendChild(
          el(
            "div",
            { className: "timer-card-name" },
            tm.name,
            el(
              "button",
              {
                onClick: () => deleteTimer(tm.id),
                style: {
                  background: "transparent",
                  border: "none",
                  color: "var(--text-faint)",
                  fontSize: "18px",
                  cursor: "pointer",
                },
              },
              "×",
            ),
          ),
        );
        card.appendChild(
          el(
            "div",
            {
              className: "timer-card-display",
              style: {
                color: col,
                animation:
                  done || (running && tm.remaining <= 10)
                    ? "pulse .9s ease-in-out infinite"
                    : "none",
              },
            },
            fmtTime(tm.remaining),
          ),
        );
        const bar = el("div", { className: "timer-card-bar" });
        bar.appendChild(
          el("div", {
            className: "timer-card-bar-fill",
            style: { width: pct.toFixed(1) + "%", background: col },
          }),
        );
        card.appendChild(bar);

        const actions = el("div", { className: "timer-card-actions" });
        const mainBtn = el(
          "button",
          {
            className: done ? "done" : running ? "" : "start",
            onClick: () => toggleTimer(tm.id),
          },
          done ? tr.restart : running ? tr.pause : tr.start,
        );
        actions.appendChild(mainBtn);
        actions.appendChild(
          el("button", { onClick: () => nudgeTimer(tm.id, 60) }, "+1m"),
        );
        actions.appendChild(
          el("button", { onClick: () => nudgeTimer(tm.id, 300) }, "+5m"),
        );
        actions.appendChild(
          el("button", { onClick: () => resetTimer(tm.id) }, tr.resetLabel),
        );
        card.appendChild(actions);

        list.appendChild(card);
      });
    }
    drawer.appendChild(list);
    return drawer;
  }

  function renderTimerOverlay() {
    return el("div", {
      className: "timer-overlay" + (S.timerOpen ? " open" : ""),
      onClick: () => {
        S.timerOpen = false;
        render();
      },
    });
  }

  function renderAlert() {
    const doneUnacked = S.timers.filter((x) => x.done && !x.ack);
    if (doneUnacked.length === 0 || S.timerOpen) return null;
    const primary = doneUnacked[0];
    const tr = t();
    const banner = el("div", { className: "alert-banner", role: "alert" });
    banner.appendChild(icon("timer"));
    banner.appendChild(
      el(
        "div",
        {},
        el(
          "div",
          { className: "alert-title" },
          '"' + primary.name + '" — ' + tr.timerDone,
        ),
        doneUnacked.length > 1
          ? el(
              "div",
              {
                style: {
                  fontFamily: "'JetBrains Mono'",
                  fontWeight: "700",
                  fontSize: "12px",
                  opacity: ".82",
                },
              },
              "+" + (doneUnacked.length - 1),
            )
          : null,
      ),
    );
    banner.appendChild(
      el(
        "button",
        {
          onClick: () => {
            S.timers = S.timers.map((t) =>
              t.id === primary.id ? { ...t, ack: true } : t,
            );
            persistTimers();
            render();
          },
          style: {
            border: "1px solid rgba(255,255,255,.55)",
            background: "transparent",
            color: "#fff",
          },
        },
        tr.stopWord,
      ),
    );
    return banner;
  }

  // ─── Init ──────────────────────────────────────────────────────────────────────
  function init() {
    loadRecipes();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
