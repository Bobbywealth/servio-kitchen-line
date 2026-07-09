// ═══════════════════════════════════════════════════════════════════════════════
//  Servio Kitchen Line — Application Logic
//  Vanilla JS — no framework, no build step
// ═══════════════════════════════════════════════════════════════════════════════

(function() {
'use strict';

// ─── Config ────────────────────────────────────────────────────────────────────
// Points to the main Servio backend — kitchen-line is now a connected tablet UI,
// not a standalone service. Auth token is passed via ?token= on launch.
const API = 'https://servio-backend-zexb.onrender.com';

// ─── I18n ──────────────────────────────────────────────────────────────────────
const T = {
  en: {
    tagline: 'Kitchen Recipes', search: 'Search recipes or ingredients…', library: 'Library', timers: 'Timers',
    inactive: 'INACTIVE', edit: 'Edit', del: 'Del', delete: 'Delete', newRecipe: '+ New Recipe',
    prepShort: 'PREP', cookShort: 'COOK', yieldShort: 'YIELD', prepTime: 'PREP TIME', cookTime: 'COOK TIME',
    total: 'TOTAL', yieldStat: 'YIELD', min: 'min', ingredients: 'INGREDIENTS', allergens: 'ALLERGENS',
    holding: 'HOLDING & STORAGE', portion: 'PORTION CONTROL', prepTitle: 'PREP',
    cooking: 'COOKING INSTRUCTIONS', plating: 'PLATING', chefTips: 'CHEF TIPS',
    noRecipes: 'No recipes found', editRecipe: 'Edit recipe',
    timersTitle: 'TIMERS', quickAdd: 'QUICK ADD', labelOptional: 'Label (optional)',
    noTimersA: 'No timers running.', noTimersB: 'Add one above or from a recipe step.',
    pause: 'Pause', start: 'Start', restart: 'Restart', resetLabel: 'Reset',
    nameLabel: 'RECIPE NAME', categoryLabel: 'CATEGORY', prepMin: 'PREP (MIN)', cookMin: 'COOK (MIN)',
    yieldLabel: 'YIELD', quickNote: 'QUICK NOTE', prepSteps: 'PREP STEPS',
    cookingSteps: 'COOKING STEPS', cookingHint: '— add minutes to attach a timer',
    add: '+ Add', deleteRecipe: 'Delete recipe', cancel: 'Cancel', saveRecipe: 'Save recipe',
    namePh: 'e.g. Braised Oxtail', notePh: 'Short summary shown on the card',
    ingPh: '2 lb oxtail, cut', stepPh: 'Describe this step', yieldPh: '4 portions',
    adminOff: 'Admin', adminOn: 'Admin ✓', listBtn: '☰ List', gridBtn: '▦ Grid', all: 'All',
    activate: 'Activate', deactivate: 'Deactivate', activeYes: '● Active', activeNo: '○ Inactive',
    newRecipeTitle: 'New recipe', editRecipeTitle: 'Edit recipe',
    startTimer: m => 'Start ' + m + ' min timer', stepWord: 'step',
    hintNothing: q => 'Nothing matches "' + q + '"', hintTry: 'Try another category or add a recipe in Admin.',
    batch: 'BATCH SCALE', makes: 'Makes', timerDone: 'timer done', viewStep: 'View step',
    open: 'Open timers', stopWord: 'Stop', startNext: m => 'Start next (' + m + 'm)', running: 'running'
  },
  es: {
    tagline: 'Recetas de Cocina', search: 'Buscar recetas o ingredientes…', library: 'Recetario', timers: 'Temporizadores',
    inactive: 'INACTIVA', edit: 'Editar', del: 'Borrar', delete: 'Eliminar', newRecipe: '+ Nueva Receta',
    prepShort: 'PREP', cookShort: 'COCCIÓN', yieldShort: 'RINDE', prepTime: 'PREPARACIÓN', cookTime: 'COCCIÓN',
    total: 'TOTAL', yieldStat: 'RINDE', min: 'min', ingredients: 'INGREDIENTES', allergens: 'ALÉRGENOS',
    holding: 'CONSERVACIÓN', portion: 'PORCIONES', prepTitle: 'PREPARACIÓN',
    cooking: 'INSTRUCCIONES DE COCCIÓN', plating: 'EMPLATADO', chefTips: 'CONSEJOS DEL CHEF',
    noRecipes: 'No se encontraron recetas', editRecipe: 'Editar receta',
    timersTitle: 'TEMPORIZADORES', quickAdd: 'AGREGAR RÁPIDO', labelOptional: 'Nombre (opcional)',
    noTimersA: 'No hay temporizadores activos.', noTimersB: 'Añade uno arriba o desde un paso de receta.',
    pause: 'Pausar', start: 'Iniciar', restart: 'Reiniciar', resetLabel: 'Restablecer',
    nameLabel: 'NOMBRE DE LA RECETA', categoryLabel: 'CATEGORÍA', prepMin: 'PREP (MIN)', cookMin: 'COCCIÓN (MIN)',
    yieldLabel: 'RINDE', quickNote: 'NOTA RÁPIDA', prepSteps: 'PASOS DE PREPARACIÓN',
    cookingSteps: 'PASOS DE COCCIÓN', cookingHint: '— añade minutos para un temporizador',
    add: '+ Añadir', deleteRecipe: 'Eliminar receta', cancel: 'Cancelar', saveRecipe: 'Guardar receta',
    namePh: 'ej. Rabo de Res Estofado', notePh: 'Resumen corto que se muestra en la tarjeta',
    ingPh: '2 lb de rabo, en trozos', stepPh: 'Describe este paso', yieldPh: '4 porciones',
    adminOff: 'Admin', adminOn: 'Admin ✓', listBtn: '☰ Lista', gridBtn: '▦ Cuadrícula', all: 'Todas',
    activate: 'Activar', deactivate: 'Desactivar', activeYes: '● Activa', activeNo: '○ Inactiva',
    newRecipeTitle: 'Nueva receta', editRecipeTitle: 'Editar receta',
    startTimer: m => 'Iniciar temporizador de ' + m + ' min', stepWord: 'paso',
    hintNothing: q => 'Nada coincide con "' + q + '"', hintTry: 'Prueba otra categoría o añade una receta en Admin.',
    batch: 'ESCALAR LOTE', makes: 'Rinde', timerDone: 'temporizador listo', viewStep: 'Ver paso',
    open: 'Abrir', stopWord: 'Parar', startNext: m => 'Iniciar siguiente (' + m + 'm)', running: 'activo'
  }
};

// ─── Categories ─────────────────────────────────────────────────────────────────
const CATS = [
  { key: 'All', color: null },
  { key: 'Breakfast', color: '#e6b84a' },
  { key: 'Lunch', color: '#e0553a' },
  { key: 'Seafood', color: '#4fa3d8' },
  { key: 'Sides', color: '#43b877' },
  { key: 'Sauces', color: '#d64f8f' },
  { key: 'Drinks', color: '#8f7fe0' },
  { key: 'Specials', color: '#e0a83a' },
];

// ─── Demo recipes (fallback when no auth) ───────────────────────────────────────
const DEMO_RECIPES = [
  {
    id: 'demo1', dish_name: 'Braised Oxtail (Big Batch)', description: 'Big-batch oxtail braised in caramelized sugar and browning, finished with peppers and a fresh blended aromatic base.',
    category_name: 'Lunch', prep_time_minutes: 30, cook_time_minutes: 120, servings: 25, is_active: true,
    ingredients: [
      { name: '25–30 lb oxtail, trimmed of excess fat', order_index: 0 },
      { name: '1 cup browning sauce', order_index: 1 },
      { name: '1 cup mixed seasoning (Knorr + Lawry\'s, combined)', order_index: 2 },
      { name: '16 oz sugar', order_index: 3 },
      { name: '16 oz water (to melt the sugar)', order_index: 4 },
      { name: '4 tbsp fresh ginger, chopped', order_index: 5 },
      { name: '3000 ml (3 L) water', order_index: 6 },
      { name: '1 bunch scallion + garlic + onion + ginger, blended into a paste', order_index: 7 },
    ],
    steps: [
      { step_number: 1, instruction: 'Cut excess fat from the oxtail.', timer_seconds: null },
      { step_number: 2, instruction: 'Wash oxtail thoroughly with vinegar, then rinse well.', timer_seconds: null },
      { step_number: 3, instruction: 'Blend the scallion, garlic, onion and ginger together into a seasoning paste; set aside for later.', timer_seconds: null },
      { step_number: 4, instruction: 'Season the trimmed oxtail with the browning, mixed seasoning (Knorr + Lawry\'s) and chopped ginger.', timer_seconds: null },
      { step_number: 5, instruction: 'In a large pot over medium-high heat, melt the sugar with the 16 oz water until it caramelizes, then add the seasoned oxtail and sear until well coated.', timer_seconds: null },
      { step_number: 6, instruction: 'Add the 3000 ml water and bring to a boil over medium-high heat.', timer_seconds: 1500 },
      { step_number: 7, instruction: 'Turn the fire down to low and let it cook slowly, covered.', timer_seconds: 2100 },
      { step_number: 8, instruction: 'Stir in the blended scallion, garlic, onion and ginger seasoning (about 1 hour after the pot went on). Continue cooking covered on low.', timer_seconds: 2700 },
      { step_number: 9, instruction: 'Add the sliced onions and sweet peppers and cook down to finish — 2 hours total cook time minimum.', timer_seconds: 900 },
    ],
    plating: 'Spoon over rice & peas. Ladle extra gravy on top, with peppers and onions visible on the plate.',
    holding: 'Hold in gravy at 150°F+ on the steam table. Do not let gravy break — stir every 20 min.',
    allergens: 'Contains: none of the top-8 by default. Check Knorr / Lawry\'s seasoning labels for soy or wheat additives.',
    tips: 'Let the sugar go dark amber, not black, before adding water — that\'s what builds the deep color without turning bitter.',
    portions: 'This is a bulk batch (25–30 lb raw). Portion after cooking at roughly 3 pieces oxtail (~8 oz) per plate.'
  },
  {
    id: 'demo2', dish_name: 'Jerk Chicken', description: 'Smoky, spicy marinated chicken quarters grilled over pimento wood char.',
    category_name: 'Lunch', prep_time_minutes: 25, cook_time_minutes: 40, servings: 4, is_active: true,
    ingredients: [
      { name: '4 chicken leg quarters', order_index: 0 },
      { name: '3 tbsp jerk marinade', order_index: 1 },
      { name: '2 scallions', order_index: 2 },
      { name: '1 scotch bonnet', order_index: 3 },
      { name: '1 tbsp allspice, ground', order_index: 4 },
      { name: '2 tbsp brown sugar', order_index: 5 },
      { name: '1 lime', order_index: 6 },
    ],
    steps: [
      { step_number: 1, instruction: 'Score chicken to the bone. Rub jerk marinade into every cut.', timer_seconds: null },
      { step_number: 2, instruction: 'Marinate covered, refrigerated, minimum 4 hours.', timer_seconds: 14400 },
      { step_number: 3, instruction: 'Bring chicken to room temp. Sear skin-side down over high heat.', timer_seconds: 480 },
      { step_number: 4, instruction: 'Move to indirect heat, cover, and cook turning occasionally.', timer_seconds: 1800 },
      { step_number: 5, instruction: 'Finish over direct flame for char. Rest before serving.', timer_seconds: 300 },
    ],
    plating: 'Chop into portions across the bone. Finish with fresh lime and scallion. Serve with festival or rice & peas.',
    holding: 'Hold at 160°F. Brush with reserved marinade to keep moist. Discard after 3 hours on the line.',
    allergens: 'Marinade may contain soy. Confirm with prep sheet. Scotch bonnet — high heat.',
    tips: 'Rest the chicken 5 min before chopping or the juices run out on the board.',
    portions: '1 quarter per plate. Cut into 3 pieces for buffet service.'
  },
  {
    id: 'demo3', dish_name: 'Blackened Salmon', description: 'Cajun-spice salmon fillet with a crisp blackened crust and a tender center.',
    category_name: 'Seafood', prep_time_minutes: 10, cook_time_minutes: 12, servings: 2, is_active: true,
    ingredients: [
      { name: '2 salmon fillets (6 oz each)', order_index: 0 },
      { name: '2 tbsp blackening spice', order_index: 1 },
      { name: '2 tbsp clarified butter', order_index: 2 },
      { name: '1 lemon', order_index: 3 },
      { name: 'Fresh dill', order_index: 4 },
    ],
    steps: [
      { step_number: 1, instruction: 'Pat fillets bone-dry. Coat both sides heavily with blackening spice.', timer_seconds: null },
      { step_number: 2, instruction: 'Heat cast iron until smoking. Add clarified butter.', timer_seconds: 180 },
      { step_number: 3, instruction: 'Lay fillets presentation-side down; do not move.', timer_seconds: 240 },
      { step_number: 4, instruction: 'Flip once, finish to 125°F internal.', timer_seconds: 240 },
    ],
    plating: 'Present crust-side up over grits or greens. Lemon wedge at 4 o\'clock. Dust with fresh dill.',
    holding: 'Cook to order — do not hold. If unavoidable, hold max 15 min at 140°F on a sizzle plate.',
    allergens: 'Contains: FISH. Blackening spice may contain celery. Cross-contact risk with shellfish station.',
    tips: 'Dry fish = better crust. Don\'t crowd the pan. Pull at 120°F — carryover brings it to 125°F.',
    portions: '6 oz raw fillet per plate. Trim tail portions to even thickness for consistent cook.'
  }
];

// ─── State ──────────────────────────────────────────────────────────────────────
const S = {
  view: 'library', // library | detail | editor
  recipes: [],
  selectedId: null,
  selectedRecipe: null,
  search: '',
  category: 'All',
  layout: 'grid',
  theme: 'dark',
  lang: 'en',
  admin: false,
  timers: [],
  timerOpen: false,
  checked: {},
  scale: 1,
  draft: null,
  editingId: null,
  categories: [],
  useDemo: false,
  customName: '',
  customMin: '',
};

// Load persisted settings
try {
  const saved = JSON.parse(localStorage.getItem('kl_settings') || '{}');
  if (saved.theme) S.theme = saved.theme;
  if (saved.layout) S.layout = saved.layout;
  if (saved.lang) S.lang = saved.lang;
} catch(e) {}

// Load checked items
try { S.checked = JSON.parse(localStorage.getItem('kl_checked') || '{}'); } catch(e) {}

// ─── Auth ───────────────────────────────────────────────────────────────────────
function getToken() {
  // Check URL param first (launched from Servio dashboard with ?token=)
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  if (urlToken) {
    // Standardized key: servio_access_token — shared across all Servio properties
    localStorage.setItem('servio_access_token', urlToken);
    // Clean URL immediately after capturing the token
    window.history.replaceState({}, document.title, window.location.pathname);
    return urlToken;
  }
  // Fall back to existing key for backwards compat during transition
  return localStorage.getItem('servio_access_token') || localStorage.getItem('servio_token');
}

function authHeaders(extra) {
  const headers = { ...(extra || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  // API key is optional (kitchen-line uses JWT Bearer from Servio dashboard)
  const apiKey = localStorage.getItem('servio_api_key');
  if (apiKey) headers['X-API-Key'] = apiKey;
  return headers;
}

function getCompanyId() {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return payload.companyId || payload.company_id || payload.restaurantId || null;
    }
  } catch(e) {}
  return null;
}

// ─── API ────────────────────────────────────────────────────────────────────────
async function apiGet(path) {
  const res = await fetch(API + path, { headers: authHeaders() });
  if (!res.ok) throw new Error('API ' + res.status);
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(API + path, {
    method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('API ' + res.status);
  return res.json();
}
async function apiPut(path, body) {
  const res = await fetch(API + path, {
    method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('API ' + res.status);
  return res.json();
}
async function apiDelete(path) {
  const res = await fetch(API + path, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('API ' + res.status);
  return res.json();
}

// ─── Data loading ───────────────────────────────────────────────────────────────
async function loadRecipes() {
  try {
    // Point to main Servio backend kitchen-assistant recipe routes
    const data = await apiGet('/api/kitchen-assistant/recipes');
    S.recipes = data.recipes || [];
    S.useDemo = false;
    // Also try loading categories
    try {
      const catData = await apiGet('/api/kitchen-assistant/categories');
      S.categories = catData.categories || [];
    } catch(e) { /* categories are optional */ }
    // If we have no recipes, fall back to demo so the UI still works
    if (S.recipes.length === 0) {
      S.recipes = DEMO_RECIPES.slice();
      S.useDemo = true;
    }
  } catch(e) {
    // Fallback to demo recipes when offline or main backend unreachable
    S.recipes = DEMO_RECIPES.slice();
    S.useDemo = true;
  }
  render();
}

async function loadRecipeDetail(id) {
  // Demo recipe — already fully loaded
  if (S.useDemo || String(id).startsWith('demo')) {
    const r = S.recipes.find(x => String(x.id) === String(id));
    S.selectedRecipe = mapRecipeForUI(r);
    render();
    return;
  }
  try {
    const data = await apiGet('/api/kitchen-assistant/recipes/' + id);
    S.selectedRecipe = mapRecipeForUI(data.recipe);
    render();
  } catch(e) {
    console.error('Failed to load recipe', e);
  }
}

// Map API recipe shape → UI recipe shape
function mapRecipeForUI(r) {
  if (!r) return null;
  const ingredients = (r.ingredients || []).map(ing => {
    let text = ing.name || '';
    if (ing.amount != null) text = ing.amount + (ing.unit ? ' ' + ing.unit + ' ' : ' ') + text;
    return { text, order_index: ing.order_index || 0 };
  }).sort((a, b) => a.order_index - b.order_index);

  const steps = (r.steps || []).sort((a, b) => a.step_number - b.step_number).map(s => ({
    text: s.instruction,
    minutes: s.timer_seconds ? Math.round(s.timer_seconds / 60) : null,
  }));

  return {
    id: r.id,
    name: r.dish_name,
    category: r.category_name || 'Lunch',
    prepTime: r.prep_time_minutes || 0,
    cookTime: r.cook_time_minutes || 0,
    yield: r.servings ? (r.servings + ' portions') : '—',
    quickNote: r.description || '',
    ingredients,
    cookSteps: steps,
    prepSteps: [],
    platingInstructions: r.plating || '—',
    holdingInstructions: r.holding || '—',
    allergyNotes: r.allergens || '—',
    chefTips: r.tips || '—',
    portionNotes: r.portions || '—',
    active: r.is_active !== false,
  };
}

// ─── Persistence ────────────────────────────────────────────────────────────────
function persistSettings() {
  try {
    localStorage.setItem('kl_settings', JSON.stringify({
      theme: S.theme, layout: S.layout, lang: S.lang
    }));
  } catch(e) {}
}
function persistChecked() {
  try { localStorage.setItem('kl_checked', JSON.stringify(S.checked)); } catch(e) {}
}
function persistTimers() {
  try { localStorage.setItem('kl_timers', JSON.stringify(S.timers)); } catch(e) {}
}
function loadTimers() {
  try {
    const arr = JSON.parse(localStorage.getItem('kl_timers') || '[]');
    const now = Date.now();
    return arr.map(t => {
      if (t.running && t.endsAt) {
        const rem = Math.max(0, Math.round((t.endsAt - now) / 1000));
        return { ...t, remaining: rem, running: rem > 0, done: rem <= 0, endsAt: rem > 0 ? t.endsAt : null };
      }
      return t;
    });
  } catch(e) { return []; }
}

// ─── Audio ──────────────────────────────────────────────────────────────────────
let _ac;
function beep() {
  try {
    if (navigator.vibrate) navigator.vibrate([320, 130, 320, 130, 520]);
  } catch(e) {}
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    _ac = _ac || new C();
    if (_ac.state === 'suspended') _ac.resume();
    const master = _ac.createGain();
    master.gain.value = 0.95;
    master.connect(_ac.destination);
    const chirp = (t, f) => {
      const o = _ac.createOscillator(), g = _ac.createGain();
      o.type = 'square'; o.frequency.value = f; o.connect(g); g.connect(master);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.7, t + 0.01);
      g.gain.setValueAtTime(0.7, t + 0.16);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.start(t); o.stop(t + 0.22);
    };
    const base = _ac.currentTime;
    [0, 1, 2, 3].forEach(i => chirp(base + i * 0.24, (i % 2) ? 988 : 1319));
  } catch(e) {}
}

// ─── Timers ─────────────────────────────────────────────────────────────────────
S.timers = loadTimers();

function addTimer(name, min) {
  const total = Math.max(1, Math.round(min * 60));
  const t = {
    id: 't' + Date.now() + Math.random().toString(36).slice(2, 5),
    name: name || (min + ' min'), total, remaining: total,
    running: true, endsAt: Date.now() + total * 1000, done: false
  };
  S.timers = [t, ...S.timers];
  S.timerOpen = true;
  persistTimers();
  render();
}
function toggleTimer(id) {
  S.timers = S.timers.map(t => {
    if (t.id !== id) return t;
    if (t.done) return { ...t, remaining: t.total, running: true, done: false, endsAt: Date.now() + t.total * 1000 };
    if (t.running) return { ...t, running: false, remaining: Math.max(0, Math.round(((t.endsAt || Date.now()) - Date.now()) / 1000)), endsAt: null };
    return { ...t, running: true, endsAt: Date.now() + t.remaining * 1000 };
  });
  persistTimers(); render();
}
function resetTimer(id) {
  S.timers = S.timers.map(t => t.id === id ? { ...t, remaining: t.total, running: false, done: false, endsAt: null } : t);
  persistTimers(); render();
}
function deleteTimer(id) {
  S.timers = S.timers.filter(t => t.id !== id);
  persistTimers(); render();
}
function nudgeTimer(id, seconds) {
  S.timers = S.timers.map(t => {
    if (t.id !== id) return t;
    if (t.done || !t.running) {
      const rem = (t.done ? 0 : t.remaining) + seconds;
      return { ...t, total: Math.max(t.total, rem), remaining: rem, running: true, done: false, endsAt: Date.now() + rem * 1000 };
    }
    const rem = Math.max(0, Math.round(((t.endsAt || Date.now()) - Date.now()) / 1000)) + seconds;
    return { ...t, total: Math.max(t.total, rem), remaining: rem, endsAt: Date.now() + rem * 1000 };
  });
  persistTimers(); render();
}

// Tick every second
setInterval(() => {
  const now = Date.now();
  let changed = false;
  S.timers = S.timers.map(t => {
    if (t.running && t.endsAt) {
      const rem = Math.max(0, Math.round((t.endsAt - now) / 1000));
      if (rem <= 0 && !t.done) { changed = true; return { ...t, remaining: 0, running: false, done: true, endsAt: null }; }
      if (rem !== t.remaining) { changed = true; return { ...t, remaining: rem }; }
    }
    return t;
  });
  if (changed) { persistTimers(); beep(); }
  if (S.timerOpen || S.timers.some(t => t.done)) render();
  else if (changed) render();
}, 1000);

// ─── Batch scaling ──────────────────────────────────────────────────────────────
function toFrac(n) {
  const whole = Math.floor(n + 1e-9); const frac = n - whole;
  const parts = [[0,''],[0.125,'⅛'],[0.25,'¼'],[1/3,'⅓'],[0.375,'⅜'],[0.5,'½'],[0.625,'⅝'],[2/3,'⅔'],[0.75,'¾'],[0.875,'⅞'],[1,'']];
  let best = parts[0], bd = Infinity;
  for (const p of parts) { const dd = Math.abs(frac - p[0]); if (dd < bd) { bd = dd; best = p; } }
  let w = whole, fs = best[1]; if (best[0] === 1) { w += 1; fs = ''; }
  if (w === 0 && fs) return fs; if (fs) return w + ' ' + fs; return String(w);
}
function formatQty(n) { if (!isFinite(n)) return String(n); if (n >= 10) return String(Math.round(n * 2) / 2); return toFrac(n); }
function scaleIng(text, f) {
  if (!f || f === 1) return text;
  const re = /^\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(\s*[-–]\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?))?/;
  const m = text.match(re); if (!m) return text;
  const pn = s => { s = s.trim(); if (/\s/.test(s)) { const a = s.split(/\s+/); const fr = a[1].split('/'); return parseFloat(a[0]) + parseFloat(fr[0]) / parseFloat(fr[1]); } if (s.indexOf('/') >= 0) { const fr = s.split('/'); return parseFloat(fr[0]) / parseFloat(fr[1]); } return parseFloat(s); };
  let out = formatQty(pn(m[1]) * f); if (m[3]) out += '–' + formatQty(pn(m[3]) * f);
  return out + text.slice(m[0].length);
}

// ─── Rendering ──────────────────────────────────────────────────────────────────

function t() { return T[S.lang]; }

function getApp() {
  let app = document.getElementById('app');
  if (!app) {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  }
  return app;
}

function fmtTime(s) {
  s = Math.max(0, s | 0); const m = Math.floor(s / 60), ss = s % 60;
  return String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
}

function catColor(key) {
  if (key === 'All') return null;
  const c = CATS.find(x => x.key === key);
  return c ? c.color : '#e0a83a';
}
function catLabel(key) {
  if (S.lang === 'es') {
    const ES = { All: 'Todas', Breakfast: 'Desayuno', Lunch: 'Almuerzo', Seafood: 'Mariscos', Sides: 'Guarniciones', Sauces: 'Salsas', Drinks: 'Bebidas', Specials: 'Especiales' };
    return ES[key] || key;
  }
  return key;
}

function el(tag, props, ...children) {
  const e = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (k === 'className') e.className = v;
      else if (k === 'onClick') e.onclick = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else if (k.startsWith('data-')) e.setAttribute(k, v);
      else e[k] = v;
    }
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') e.appendChild(document.createTextNode(String(child)));
    else if (Array.isArray(child)) child.forEach(c => { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    else e.appendChild(child);
  }
  return e;
}

function render() {
  document.documentElement.setAttribute('data-theme', S.theme);
  document.body.style.background = S.theme === 'light' ? '#f2efe6' : '#131210';

  const app = getApp();
  app.innerHTML = '';
  app.appendChild(renderHeader());

  if (S.view === 'library') app.appendChild(renderLibrary());
  else if (S.view === 'detail') app.appendChild(renderDetail());
  else if (S.view === 'editor') app.appendChild(renderEditor());

  app.appendChild(renderTimerDrawer());
  app.appendChild(renderTimerOverlay());

  const alert = renderAlert();
  if (alert) app.appendChild(alert);
}

function renderHeader() {
  const hdr = el('header', { className: 'header' });

  if (S.view === 'library') {
    hdr.appendChild(el('div', { className: 'brand' },
      el('div', { className: 'brand-logo' }, 'S'),
      el('div', {},
        el('div', { className: 'brand-name' }, 'Servio'),
        el('div', { className: 'brand-tag' }, t().tagline)
      )
    ));
    const sw = el('div', { className: 'search-wrap' });
    sw.appendChild(el('span', {}, '⌕'));
    sw.appendChild(el('input', {
      type: 'text', placeholder: t().search, value: S.search,
      onInput: e => { S.search = e.target.value; render(); }
    }));
    hdr.appendChild(sw);
  } else {
    hdr.appendChild(el('button', { className: 'back-btn', onClick: () => { S.view = 'library'; S.selectedId = null; render(); } }, '← ' + t().library));
  }

  const actions = el('div', { className: 'header-actions' });
  actions.appendChild(el('button', { onClick: () => { S.lang = S.lang === 'en' ? 'es' : 'en'; persistSettings(); render(); } }, '🌐 ', S.lang === 'es' ? 'ES' : 'EN'));
  actions.appendChild(el('button', { className: 'btn-theme', onClick: () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; persistSettings(); render(); } }, S.theme === 'light' ? '☀' : '☾'));
  actions.appendChild(el('button', { className: 'btn-admin' + (S.admin ? ' on' : ''), onClick: () => { S.admin = !S.admin; render(); } }, S.admin ? t().adminOn : t().adminOff));

  // Timers button
  const runningSorted = S.timers.filter(x => x.running && !x.done).sort((a, b) => a.remaining - b.remaining);
  const soonest = runningSorted[0];
  const doneCount = S.timers.filter(x => x.done).length;
  const badgeCount = S.timers.filter(x => x.running).length + doneCount;
  const tb = el('button', { className: 'btn-timers', onClick: () => { S.timerOpen = true; render(); } }, '⏱ ');
  if (soonest) {
    tb.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono'", fontWeight: '800', fontSize: '16px', color: soonest.remaining <= 60 ? 'var(--warn)' : 'var(--accent-ink)' } }, fmtTime(soonest.remaining)));
  } else {
    tb.appendChild(document.createTextNode(t().timers));
  }
  if (badgeCount > 0) {
    tb.appendChild(el('span', {
      style: { minWidth: '24px', height: '24px', padding: '0 6px', borderRadius: '999px', background: doneCount > 0 ? 'var(--danger)' : 'rgba(0,0,0,.35)', color: '#fff', fontFamily: "'JetBrains Mono'", fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }, String(badgeCount)));
  }
  actions.appendChild(tb);

  hdr.appendChild(actions);
  return hdr;
}

function renderLibrary() {
  const wrap = el('div');

  // Category bar
  let list = S.recipes.slice();
  if (!S.admin) list = list.filter(r => r.is_active !== false);
  if (S.category !== 'All') list = list.filter(r => (r.category_name || 'Lunch') === S.category);
  const q = S.search.trim().toLowerCase();
  if (q) list = list.filter(r => (r.dish_name || r.name || '').toLowerCase().includes(q) || (r.description || r.quickNote || '').toLowerCase().includes(q));

  const catBar = el('div', { className: 'cat-bar', style: { padding: '20px 22px 0', maxWidth: '1440px', margin: '0 auto' } });
  CATS.forEach(c => {
    const count = S.recipes.filter(r => (S.admin || r.is_active !== false) && (c.key === 'All' || (r.category_name || 'Lunch') === c.key)).length;
    const isActive = S.category === c.key;
    const col = c.color;
    const pill = el('button', {
      className: 'cat-pill' + (isActive ? ' active' : ''),
      onClick: () => { S.category = c.key; render(); }
    }, catLabel(c.key), el('span', { className: 'count' }, String(count)));
    if (isActive && col) { pill.style.background = col; pill.style.borderColor = 'transparent'; }
    catBar.appendChild(pill);
  });
  // Layout toggle + new recipe
  if (S.admin) {
    const newBtn = el('button', { className: 'cat-pill', onClick: () => { S.view = 'editor'; S.editingId = null; S.draft = blankDraft(); render(); } }, t().newRecipe);
    newBtn.style.background = 'var(--accent)'; newBtn.style.color = 'var(--accent-ink)'; newBtn.style.borderColor = 'transparent';
    catBar.appendChild(newBtn);
  }
  const layoutBtn = el('button', { className: 'cat-pill', onClick: () => { S.layout = S.layout === 'grid' ? 'list' : 'grid'; persistSettings(); render(); } }, S.layout === 'grid' ? t().listBtn : t().gridBtn);
  catBar.appendChild(layoutBtn);
  wrap.appendChild(catBar);

  // Demo banner
  if (S.useDemo) {
    wrap.appendChild(el('div', {
      style: { margin: '16px 22px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(224,168,58,.1)', border: '1px solid rgba(224,168,58,.3)', fontSize: '13.5px', color: 'var(--accent)', maxWidth: '1440px' }
    }, '⚠ Demo mode — not connected to Servio database. Open via Servio dashboard to see your recipes.'));
  }

  if (list.length === 0) {
    wrap.appendChild(el('div', { className: 'empty-state' },
      el('div', { className: 'icon' }, '🍳'),
      el('div', { className: 'title' }, t().noRecipes),
      el('div', { style: { fontSize: '14px', marginTop: '6px' } }, q ? t().hintNothing(S.search) : t().hintTry)
    ));
    return wrap;
  }

  if (S.layout === 'grid') {
    const grid = el('div', { className: 'recipe-grid' });
    list.forEach(r => grid.appendChild(renderCard(r)));
    wrap.appendChild(grid);
  } else {
    const list2 = el('div', { className: 'recipe-list' });
    list.forEach(r => list2.appendChild(renderListItem(r)));
    wrap.appendChild(list2);
  }
  return wrap;
}

function renderCard(r) {
  const cat = r.category_name || r.name && r.category || 'Lunch';
  const col = catColor(cat) || '#e0a83a';
  const inactive = r.is_active === false;
  const mapped = S.useDemo ? {
    name: r.dish_name, quickNote: r.description,
    prepTime: r.prep_time_minutes, cookTime: r.cook_time_minutes,
    yield: r.servings ? r.servings + ' portions' : '—'
  } : {
    name: r.dish_name, quickNote: r.description,
    prepTime: r.prep_time_minutes, cookTime: r.cook_time_minutes,
    yield: r.servings ? r.servings + ' portions' : '—'
  };

  const card = el('div', { className: 'recipe-card', onClick: () => { S.view = 'detail'; S.selectedId = r.id; S.scale = 1; loadRecipeDetail(r.id); } });
  const imgArea = el('div', { className: 'card-img', style: { background: col + '22' } }, '🍽');
  imgArea.appendChild(el('div', { className: 'card-overlay' },
    el('span', { className: 'card-chip', style: { background: col + '26', color: col } }, cat),
    inactive ? el('span', { className: 'card-chip inactive' }, t().inactive) : null
  ));
  card.appendChild(imgArea);
  card.appendChild(el('div', { className: 'card-body' },
    el('div', { className: 'card-title' }, mapped.name || r.dish_name),
    el('div', { className: 'card-stats' },
      el('div', {}, el('div', { className: 'stat-label' }, t().prepShort), el('div', { className: 'stat-val' }, (mapped.prepTime || 0) + 'm')),
      el('div', {}, el('div', { className: 'stat-label' }, t().cookShort), el('div', { className: 'stat-val' }, (mapped.cookTime || 0) + 'm')),
      el('div', {}, el('div', { className: 'stat-label' }, t().yieldShort), el('div', { className: 'stat-val' }, mapped.yield || '—'))
    ),
    el('div', { className: 'card-note' }, mapped.quickNote || '')
  ));
  if (S.admin) {
    const actions = el('div', { className: 'card-actions' });
    actions.appendChild(el('button', { onClick: e => { e.stopPropagation(); toggleActive(r.id); } }, inactive ? t().activate : t().deactivate));
    actions.appendChild(el('button', { onClick: e => { e.stopPropagation(); S.view = 'editor'; S.editingId = r.id; loadRecipeForEdit(r); } }, t().edit));
    actions.appendChild(el('button', { onClick: e => { e.stopPropagation(); deleteRecipe(r.id); }, style: { color: 'var(--danger)' } }, t().delete));
    card.appendChild(actions);
  }
  return card;
}

function renderListItem(r) {
  const cat = r.category_name || 'Lunch';
  const col = catColor(cat) || '#e0a83a';
  const mapped = { name: r.dish_name || r.name, quickNote: r.description || r.quickNote, prepTime: r.prep_time_minutes || r.prepTime, cookTime: r.cook_time_minutes || r.cookTime };

  const item = el('div', { className: 'list-item', onClick: () => { S.view = 'detail'; S.selectedId = r.id; S.scale = 1; loadRecipeDetail(r.id); } });
  item.appendChild(el('span', { className: 'list-chip', style: { background: col + '26', color: col } }, cat));
  item.appendChild(el('div', { className: 'list-body' },
    el('div', { className: 'list-title' }, mapped.name || r.dish_name),
    el('div', { className: 'list-note' }, mapped.quickNote || '')
  ));
  item.appendChild(el('div', { className: 'list-meta' }, t().prepShort + ' ' + (mapped.prepTime || 0) + ' · ' + t().cookShort + ' ' + (mapped.cookTime || 0)));
  return item;
}

function toggleActive(id) {
  if (S.useDemo) {
    S.recipes = S.recipes.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r);
    render();
    return;
  }
  // API doesn't have toggle — would need a PATCH. For now just reload.
  loadRecipes();
}

async function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  if (S.useDemo || String(id).startsWith('demo')) {
    S.recipes = S.recipes.filter(r => r.id !== id);
    render();
    return;
  }
  try { await apiDelete('/api/recipes/' + id); } catch(e) {}
  await loadRecipes();
}

// ─── Detail view ───────────────────────────────────────────────────────────────
function renderDetail() {
  if (!S.selectedRecipe) return el('div', { className: 'empty-state' }, el('div', { className: 'icon' }, '⏳'), 'Loading…');

  const d = S.selectedRecipe;
  const col = catColor(d.category) || '#e0a83a';
  const tr = t();
  const wrap = el('div', { className: 'detail-view' });

  // Header
  const hdr = el('div', { className: 'detail-header' });
  hdr.appendChild(el('div', { style: { flex: '1', minWidth: '280px' } },
    el('div', { style: { display: 'flex', gap: '10px', marginBottom: '14px' } },
      el('span', { style: { padding: '7px 14px', borderRadius: '9px', background: col + '26', color: col, fontFamily: "'Archivo'", fontWeight: '700', fontSize: '13px' } }, catLabel(d.category)),
      d.active === false ? el('span', { style: { padding: '6px 12px', borderRadius: '8px', background: 'rgba(224,85,58,.16)', color: 'var(--danger)', fontFamily: "'Archivo'", fontWeight: '800', fontSize: '11px' } }, tr.inactive) : null
    ),
    el('h1', { className: 'detail-title' }, d.name),
    el('p', { className: 'detail-note' }, d.quickNote)
  ));
  if (S.admin) {
    hdr.appendChild(el('button', { className: 'btn-cancel', onClick: () => { S.view = 'editor'; S.editingId = d.id; loadRecipeForEdit(S.recipes.find(r => r.id === d.id) || d); } }, tr.editRecipe));
  }
  wrap.appendChild(hdr);

  // Stats
  wrap.appendChild(el('div', { className: 'stat-grid' },
    statCard(tr.prepTime, d.prepTime, tr.min),
    statCard(tr.cookTime, d.cookTime, tr.min),
    statCard(tr.total, (d.prepTime || 0) + (d.cookTime || 0), tr.min),
    statCard(tr.yieldStat, d.yield, '')
  ));

  // Batch scale
  const batchRow = el('div', { className: 'batch-row' });
  batchRow.appendChild(el('div', { className: 'batch-label' }, tr.batch));
  const presets = el('div', { className: 'batch-presets' });
  [0.5, 1, 2, 3, 4].forEach(v => {
    const btn = el('button', { className: S.scale === v ? 'active' : '', onClick: () => { S.scale = v; render(); } }, v === 0.5 ? '½' : v + '×');
    presets.appendChild(btn);
  });
  batchRow.appendChild(presets);
  batchRow.appendChild(el('div', { className: 'batch-manual' },
    el('button', { onClick: () => { S.scale = Math.max(0.5, (S.scale || 1) - 0.5); render(); } }, '−'),
    el('div', { className: 'val' }, S.scale === 0.5 ? '½×' : S.scale + '×'),
    el('button', { onClick: () => { S.scale = Math.min(20, (S.scale || 1) + 0.5); render(); } }, '+')
  ));
  batchRow.appendChild(el('div', { style: { fontSize: '13.5px', color: 'var(--text-dim)' } }, tr.makes + ' '));
  wrap.appendChild(batchRow);

  // Cols
  const cols = el('div', { className: 'detail-cols' });
  const leftCol = el('div', { className: 'detail-col' });

  // Ingredients
  leftCol.appendChild(renderSection(tr.ingredients, (d.ingredients || []).map((ing, i) => {
    const key = d.id + ':ing:' + i;
    const checked = !!S.checked[key];
    const scaledText = scaleIng(ing.text || '', S.scale);
    return el('button', {
      className: 'ing-item' + (checked ? ' checked' : ''),
      onClick: () => { if (checked) delete S.checked[key]; else S.checked[key] = true; persistChecked(); render(); }
    },
      el('span', { className: 'ing-box' }, checked ? '✓' : ''),
      el('span', { className: 'ing-text' }, scaledText)
    );
  })));

  // Allergens
  if (d.allergyNotes && d.allergyNotes !== '—') {
    leftCol.appendChild(renderSection(tr.allergens, el('div', { className: 'section-text', style: { color: 'var(--text)' } }, d.allergyNotes), 'section-warn'));
  }
  // Holding
  if (d.holdingInstructions && d.holdingInstructions !== '—') {
    leftCol.appendChild(renderSection(tr.holding, el('div', { className: 'section-text' }, d.holdingInstructions)));
  }
  // Portion
  if (d.portionNotes && d.portionNotes !== '—') {
    leftCol.appendChild(renderSection(tr.portion, el('div', { className: 'section-text' }, d.portionNotes)));
  }

  cols.appendChild(leftCol);

  // Right column — steps
  const rightCol = el('div', { className: 'detail-col wide' });

  // Prep steps (if any)
  if (d.prepSteps && d.prepSteps.length > 0) {
    rightCol.appendChild(renderStepsSection(tr.prepTitle, d.prepSteps, d.id, 'prep'));
  }

  // Cooking steps
  if (d.cookSteps && d.cookSteps.length > 0) {
    rightCol.appendChild(renderStepsSection(tr.cooking, d.cookSteps, d.id, 'cook'));
  }

  // Plating
  if (d.platingInstructions && d.platingInstructions !== '—') {
    rightCol.appendChild(renderSection(tr.plating, el('div', { className: 'section-text', style: { color: 'var(--text)' } }, d.platingInstructions)));
  }

  // Chef tips
  if (d.chefTips && d.chefTips !== '—') {
    rightCol.appendChild(renderSection(tr.chefTips, el('div', { className: 'section-text', style: { color: 'var(--text)' } }, d.chefTips), 'section-tip'));
  }

  cols.appendChild(rightCol);
  wrap.appendChild(cols);
  return wrap;
}

function statCard(label, val, unit) {
  return el('div', { className: 'stat-card' },
    el('div', { className: 'stat-label' }, label),
    el('div', { className: 'stat-val' }, String(val || 0), el('span', { className: 'stat-unit' }, unit ? ' ' + unit : ''))
  );
}

function renderSection(label, content, extraClass) {
  return el('section', { className: 'detail-section' + (extraClass ? ' ' + extraClass : '') },
    el('div', { className: 'section-label' }, label),
    content
  );
}

function renderStepsSection(label, steps, recipeId, kind) {
  const children = steps.map((s, i) => {
    const key = recipeId + ':' + kind + ':' + i;
    const checked = !!S.checked[key];
    const text = typeof s === 'string' ? s : (s.text || '');
    const minutes = typeof s === 'object' && s.minutes != null ? s.minutes : null;
    const stepBtn = el('div', {
      className: 'step-item' + (checked ? ' checked' : ''),
      onClick: () => { if (checked) delete S.checked[key]; else S.checked[key] = true; persistChecked(); render(); }
    },
      el('div', { className: 'step-num' }, String(i + 1)),
      el('div', { className: 'step-text' }, text)
    );
    if (minutes && minutes > 0) {
      const timerBtn = el('button', { className: 'step-timer-btn', onClick: e => { e.stopPropagation(); addTimer(S.selectedRecipe.name + ' · ' + t().stepWord + ' ' + (i + 1), minutes); } }, '⏱ ' + t().startTimer(minutes));
      stepBtn.appendChild(timerBtn);
    }
    return stepBtn;
  });
  return renderSection(label, el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, ...children));
}

// ─── Editor ────────────────────────────────────────────────────────────────────
function blankDraft() {
  return {
    name: '', category: 'Lunch', prepTime: '', cookTime: '', yield: '', quickNote: '',
    ingredients: [''], cookSteps: [{ text: '', minutes: '' }],
    plating: '', holding: '', allergens: '', tips: '', portions: '', active: true
  };
}

async function loadRecipeForEdit(source) {
  if (!source) { S.draft = blankDraft(); render(); return; }
  // If demo or already-mapped
  if (source.dish_name || source.name) {
    const mapped = S.useDemo ? {
      name: source.name, prepTime: source.prepTime, cookTime: source.cookTime,
      yield: source.yield, quickNote: source.quickNote, ingredients: source.ingredients,
      cookSteps: source.cookSteps, plating: source.plating, holding: source.holding,
      allergens: source.allergens, tips: source.tips, portions: source.portions
    } : mapRecipeForUI(source);
    S.draft = {
      name: mapped.name || '', category: source.category_name || 'Lunch',
      prepTime: String(mapped.prepTime || ''), cookTime: String(mapped.cookTime || ''),
      yield: mapped.yield || '', quickNote: mapped.quickNote || '',
      ingredients: (mapped.ingredients || []).map(i => typeof i === 'string' ? i : i.text),
      cookSteps: (mapped.cookSteps || []).map(s => ({ text: s.text, minutes: s.minutes ? String(s.minutes) : '' })),
      plating: mapped.platingInstructions || '', holding: mapped.holdingInstructions || '',
      allergens: mapped.allergyNotes || '', tips: mapped.chefTips || '',
      portions: mapped.portionNotes || '', active: source.is_active !== false
    };
    render();
  } else {
    // Load from API
    try {
      const data = await apiGet('/api/recipes/' + source.id);
      const r = data.recipe;
      const mapped = mapRecipeForUI(r);
      S.draft = {
        name: mapped.name, category: r.category_name || 'Lunch',
        prepTime: String(mapped.prepTime || ''), cookTime: String(mapped.cookTime || ''),
        yield: mapped.yield, quickNote: mapped.quickNote,
        ingredients: mapped.ingredients.map(i => i.text),
        cookSteps: mapped.cookSteps.map(s => ({ text: s.text, minutes: s.minutes ? String(s.minutes) : '' })),
        plating: mapped.platingInstructions, holding: mapped.holdingInstructions,
        allergens: mapped.allergyNotes, tips: mapped.chefTips,
        portions: mapped.portionNotes, active: r.is_active !== false
      };
      render();
    } catch(e) {
      S.draft = blankDraft(); render();
    }
  }
}

function renderEditor() {
  const d = S.draft || blankDraft();
  const tr = t();
  const wrap = el('div', { className: 'editor-view' });
  wrap.appendChild(el('div', { className: 'editor-title' }, S.editingId ? tr.editRecipeTitle : tr.newRecipeTitle));

  const form = el('div', {});

  // Name
  form.appendChild(field(tr.nameLabel, el('input', { type: 'text', className: 'large', placeholder: tr.namePh, value: d.name, onInput: e => d.name = e.target.value })));

  // Category + active
  const catSelect = el('select', { onChange: e => d.category = e.target.value });
  CATS.filter(c => c.key !== 'All').forEach(c => {
    const opt = el('option', { value: c.key }, catLabel(c.key));
    if (c.key === d.category) opt.selected = true;
    catSelect.appendChild(opt);
  });
  const activeBtn = el('button', {
    onClick: () => { d.active = !d.active; render(); },
    style: { height: '52px', padding: '0 20px', borderRadius: '12px', border: '1px solid ' + (d.active ? 'var(--success)' : 'var(--border)'), background: d.active ? 'rgba(67,184,119,.14)' : 'var(--surface)', color: d.active ? 'var(--success)' : 'var(--text-dim)', fontFamily: "'Archivo'", fontWeight: '700', fontSize: '14.5px' }
  }, d.active ? tr.activeYes : tr.activeNo);
  form.appendChild(el('div', { className: 'editor-row' },
    el('div', { className: 'editor-field', style: { flex: '1', minWidth: '180px' } }, el('label', {}, tr.categoryLabel), catSelect),
    el('div', { className: 'editor-field', style: { flex: 'none', alignSelf: 'flex-end' } }, activeBtn)
  ));

  // Prep / Cook / Yield
  form.appendChild(el('div', { className: 'editor-row' },
    field(tr.prepMin, el('input', { type: 'number', className: 'mono', placeholder: '0', value: d.prepTime, onInput: e => d.prepTime = e.target.value })),
    field(tr.cookMin, el('input', { type: 'number', className: 'mono', placeholder: '0', value: d.cookTime, onInput: e => d.cookTime = e.target.value })),
    field(tr.yieldLabel, el('input', { type: 'text', placeholder: tr.yieldPh, value: d.yield, onInput: e => d.yield = e.target.value }))
  ));

  // Quick note
  form.appendChild(field(tr.quickNote, el('textarea', { placeholder: tr.notePh, onInput: e => d.quickNote = e.target.value }, d.quickNote)));

  // Ingredients
  form.appendChild(arrField(tr.ingredients, d.ingredients, tr.ingPh, val => d.ingredients.push(val), idx => { d.ingredients.splice(idx, 1); render(); }, (idx, val) => d.ingredients[idx] = val));

  // Cooking steps
  const cookLabel = el('div', {},
    tr.cookingSteps + ' ',
    el('span', { style: { color: 'var(--text-faint)', fontWeight: '500', textTransform: 'none', letterSpacing: '0' } }, tr.cookingHint)
  );
  form.appendChild(cookStepsField(cookLabel, d.cookSteps, idx => { d.cookSteps.splice(idx, 1); render(); }, (idx, key, val) => { d.cookSteps[idx][key] = val; }));

  // Plating / Holding
  form.appendChild(el('div', { className: 'editor-row' },
    field(tr.plating, el('textarea', { style: { minHeight: '80px' }, onInput: e => d.plating = e.target.value }, d.plating)),
    field(tr.holding, el('textarea', { style: { minHeight: '80px' }, onInput: e => d.holding = e.target.value }, d.holding))
  ));
  // Allergens / Tips
  form.appendChild(el('div', { className: 'editor-row' },
    field(tr.allergens, el('textarea', { style: { minHeight: '70px' }, onInput: e => d.allergens = e.target.value }, d.allergens)),
    field(tr.chefTips, el('textarea', { style: { minHeight: '70px' }, onInput: e => d.tips = e.target.value }, d.tips))
  ));
  // Portion
  form.appendChild(field(tr.portion, el('textarea', { style: { minHeight: '60px' }, onInput: e => d.portions = e.target.value }, d.portions)));

  wrap.appendChild(form);

  // Actions
  const actions = el('div', { className: 'editor-actions' });
  if (S.editingId) {
    actions.appendChild(el('button', { className: 'btn-danger', onClick: () => { deleteRecipe(S.editingId); S.view = 'library'; S.editingId = null; } }, tr.deleteRecipe));
  }
  actions.appendChild(el('div', { style: { flex: '1' } }));
  actions.appendChild(el('button', { className: 'btn-cancel', onClick: () => { S.view = S.editingId ? 'detail' : 'library'; S.editingId = null; render(); } }, tr.cancel));
  actions.appendChild(el('button', { className: 'btn-save', onClick: saveDraft }, tr.saveRecipe));
  wrap.appendChild(actions);

  return wrap;
}

function field(label, input) {
  return el('div', { className: 'editor-field' }, el('label', {}, label), input);
}

function arrField(label, items, ph, onAdd, onRemove, onChange) {
  const wrap = el('div', { className: 'editor-field' });
  const hdr = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' } });
  hdr.appendChild(el('label', { style: { fontFamily: "'Archivo'", fontWeight: '700', fontSize: '12.5px', letterSpacing: '.1em', color: 'var(--text-faint)' } }, label));
  hdr.appendChild(el('button', { className: 'editor-add-btn', onClick: () => { onAdd(''); render(); } }, t().add));
  wrap.appendChild(hdr);
  items.forEach((item, i) => {
    const row = el('div', { className: 'editor-arr-item' });
    const inp = el('input', { type: 'text', placeholder: ph, value: item, onInput: e => onChange(i, e.target.value) });
    row.appendChild(inp);
    row.appendChild(el('button', { className: 'remove-btn', onClick: () => onRemove(i) }, '×'));
    wrap.appendChild(row);
  });
  return wrap;
}

function cookStepsField(label, items, onRemove, onChange) {
  const wrap = el('div', { className: 'editor-field' });
  const hdr = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' } });
  hdr.appendChild(el('label', { style: { fontFamily: "'Archivo'", fontWeight: '700', fontSize: '12.5px', letterSpacing: '.1em', color: 'var(--text-faint)' } }, label));
  hdr.appendChild(el('button', { className: 'editor-add-btn', onClick: () => { items.push({ text: '', minutes: '' }); render(); } }, t().add));
  wrap.appendChild(hdr);
  items.forEach((item, i) => {
    const row = el('div', { className: 'editor-arr-item' });
    row.appendChild(el('textarea', { placeholder: t().stepPh, onInput: e => onChange(i, 'text', e.target.value) }, item.text || ''));
    row.appendChild(el('input', { type: 'number', className: 'mono', placeholder: t().min, style: { flex: 'none', width: '78px', height: '50px', padding: '0 12px', borderRadius: '11px', border: '1px solid var(--border)', background: 'var(--surface)', fontFamily: "'JetBrains Mono'", fontWeight: '700', fontSize: '15px', textAlign: 'center' }, value: item.minutes || '', onInput: e => onChange(i, 'minutes', e.target.value) }));
    row.appendChild(el('button', { className: 'remove-btn', onClick: () => onRemove(i) }, '×'));
    wrap.appendChild(row);
  });
  return wrap;
}

async function saveDraft() {
  const d = S.draft;
  if (!d.name.trim()) { alert('Recipe name is required'); return; }

  const payload = {
    dish_name: d.name.trim(),
    description: d.quickNote,
    prep_time_minutes: parseInt(d.prepTime) || null,
    cook_time_minutes: parseInt(d.cookTime) || null,
    servings: parseInt(d.yield) || 1,
    ingredients: d.ingredients.map(x => ({ name: x.trim() })).filter(x => x.name),
    steps: d.cookSteps.filter(s => (s.text || '').trim()).map(s => ({ instruction: s.text.trim(), timer_seconds: s.minutes ? parseInt(s.minutes) * 60 : null })),
    plating_instructions: d.plating,
    holding_instructions: d.holding,
    allergy_notes: d.allergens,
    chef_tips: d.tips,
    portion_notes: d.portions,
  };

  try {
    if (S.editingId && !S.useDemo) {
      await apiPut('/api/recipes/' + S.editingId, payload);
    } else if (!S.useDemo) {
      await apiPost('/api/recipes', payload);
    } else {
      // Demo mode — save to local array
      const newRecipe = {
        id: 'demo' + Date.now(), dish_name: payload.dish_name, description: payload.description,
        category_name: d.category, prep_time_minutes: payload.prep_time_minutes,
        cook_time_minutes: payload.cook_time_minutes, servings: payload.servings,
        is_active: d.active,
        ingredients: payload.ingredients.map((x, i) => ({ name: x.name, order_index: i })),
        steps: payload.steps.map((s, i) => ({ step_number: i + 1, instruction: s.instruction, timer_seconds: s.timer_seconds })),
        plating: payload.plating_instructions, holding: payload.holding_instructions,
        allergens: payload.allergy_notes, tips: payload.chef_tips, portions: payload.portion_notes
      };
      S.recipes.unshift(newRecipe);
    }
    S.view = 'library';
    S.editingId = null;
    if (!S.useDemo) await loadRecipes();
    else render();
  } catch(e) {
    alert('Save failed: ' + e.message);
  }
}

// ─── Timer drawer ──────────────────────────────────────────────────────────────
function renderTimerDrawer() {
  const tr = t();
  const drawer = el('aside', { className: 'timer-drawer' + (S.timerOpen ? ' open' : '') });

  drawer.appendChild(el('div', { className: 'timer-header' },
    el('h2', {}, tr.timersTitle),
    el('button', { className: 'timer-close', onClick: () => { S.timerOpen = false; render(); } }, '×')
  ));

  // Quick add
  const quick = el('div', { className: 'timer-quick' });
  quick.appendChild(el('div', { className: 'timer-quick-label' }, tr.quickAdd));
  const grid = el('div', { className: 'timer-quick-grid' });
  [5, 10, 15, 30].forEach(m => grid.appendChild(el('button', { onClick: () => addTimer(m + ' min', m) }, String(m))));
  quick.appendChild(grid);
  const custom = el('div', { className: 'timer-custom' });
  custom.appendChild(el('input', { type: 'text', placeholder: tr.labelOptional, value: S.customName, onInput: e => S.customName = e.target.value }));
  custom.appendChild(el('input', { type: 'number', className: 'mono', placeholder: tr.min, value: S.customMin, onInput: e => S.customMin = e.target.value }));
  custom.appendChild(el('button', { className: 'add-btn', onClick: () => {
    const m = parseFloat(S.customMin);
    if (!m || m <= 0) return;
    addTimer(S.customName.trim() || (m + ' min'), m);
    S.customName = ''; S.customMin = '';
  } }, '+'));
  quick.appendChild(custom);
  drawer.appendChild(quick);

  // Timer list
  const list = el('div', { className: 'timer-list' });
  if (S.timers.length === 0) {
    list.appendChild(el('div', { className: 'timer-empty' },
      el('div', { className: 'icon' }, '⏱'),
      tr.noTimersA, el('br'), tr.noTimersB
    ));
  } else {
    // Sort: done first, then running (by remaining), then paused
    const sorted = S.timers.slice().sort((a, b) => {
      const rank = t => t.done ? 0 : (t.running ? 1 : 2);
      const ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      if (ra === 1) return a.remaining - b.remaining;
      return 0;
    });

    sorted.forEach(tm => {
      const pct = tm.total ? Math.max(0, Math.min(100, (tm.remaining / tm.total) * 100)) : 0;
      const running = tm.running, done = tm.done;
      let col = 'var(--text)';
      if (done) col = 'var(--danger)';
      else if (running) col = tm.remaining <= 10 ? 'var(--danger)' : (tm.remaining <= 60 ? 'var(--warn)' : 'var(--success)');

      const card = el('div', { className: 'timer-card' + ((done || (running && tm.remaining <= 10)) ? ' urgent' : '') });
      card.appendChild(el('div', { className: 'timer-card-name' },
        tm.name,
        el('button', { onClick: () => deleteTimer(tm.id), style: { background: 'transparent', border: 'none', color: 'var(--text-faint)', fontSize: '18px', cursor: 'pointer' } }, '×')
      ));
      card.appendChild(el('div', { className: 'timer-card-display', style: { color: col, animation: (done || (running && tm.remaining <= 10)) ? 'pulse .9s ease-in-out infinite' : 'none' } }, fmtTime(tm.remaining)));
      const bar = el('div', { className: 'timer-card-bar' });
      bar.appendChild(el('div', { className: 'timer-card-bar-fill', style: { width: pct.toFixed(1) + '%', background: col } }));
      card.appendChild(bar);

      const actions = el('div', { className: 'timer-card-actions' });
      const mainBtn = el('button', { className: done ? 'done' : (running ? '' : 'start'), onClick: () => toggleTimer(tm.id) }, done ? tr.restart : (running ? tr.pause : tr.start));
      actions.appendChild(mainBtn);
      actions.appendChild(el('button', { onClick: () => nudgeTimer(tm.id, 60) }, '+1m'));
      actions.appendChild(el('button', { onClick: () => nudgeTimer(tm.id, 300) }, '+5m'));
      actions.appendChild(el('button', { onClick: () => resetTimer(tm.id) }, tr.resetLabel));
      card.appendChild(actions);

      list.appendChild(card);
    });
  }
  drawer.appendChild(list);
  return drawer;
}

function renderTimerOverlay() {
  return el('div', { className: 'timer-overlay' + (S.timerOpen ? ' open' : ''), onClick: () => { S.timerOpen = false; render(); } });
}

function renderAlert() {
  const doneUnacked = S.timers.filter(x => x.done && !x.ack);
  if (doneUnacked.length === 0 || S.timerOpen) return null;
  const primary = doneUnacked[0];
  const tr = t();
  const banner = el('div', { className: 'alert-banner' });
  banner.appendChild(el('span', { style: { fontSize: '22px', flex: 'none' } }, '🔔'));
  banner.appendChild(el('div', {},
    el('div', { className: 'alert-title' }, '"' + primary.name + '" — ' + tr.timerDone),
    doneUnacked.length > 1 ? el('div', { style: { fontFamily: "'JetBrains Mono'", fontWeight: '700', fontSize: '12px', opacity: '.82' } }, '+' + (doneUnacked.length - 1)) : null
  ));
  banner.appendChild(el('button', { onClick: () => { resetTimer(primary.id); }, style: { border: '1px solid rgba(255,255,255,.55)', background: 'transparent', color: '#fff' } }, tr.stopWord));
  return banner;
}

// ─── Init ──────────────────────────────────────────────────────────────────────
function init() { loadRecipes(); }
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
