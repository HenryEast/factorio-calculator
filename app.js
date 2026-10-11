/* Factorio Calculator - External JavaScript Application Logic
   API Source: Raw JSON from https://kevinta893.github.io/factorio-recipes-json/recipes.min.json
*/

// Endpoint config for raw GitHub JSON
const API_URL = 'https://kevinta893.github.io/factorio-recipes-json/recipes.min.json';

// Local fallback recipe dataase in case of issues
const LOCAL_RECIPE_FALLBACK = {
  "electronic-circuit": { name: "Electronic Circuit", time: 0.5, ingredients: { "copper-cable": 3, "iron-plate": 1 }, resultCount: 1 },
  "advanced-circuit": { name: "Advanced Circuit", time: 6.0, ingredients: { "electronic-circuit": 2, "plastic-bar": 2, "copper-cable": 4 }, resultCount: 1 },
  "processing-unit": { name: "Processing Unit", time: 10.0, ingredients: { "electronic-circuit": 20, "advanced-circuit": 2, "sulfuric-acid": 5 }, resultCount: 1 },
  "automation-science-pack": { name: "Automation Science Pack", time: 5.0, ingredients: { "copper-plate": 1, "iron-gear-wheel": 1 }, resultCount: 1 },
  "logistic-science-pack": { name: "Logistic Science Pack", time: 6.0, ingredients: { "transport-belt": 1, "inserter": 1 }, resultCount: 1 },
  "chemical-science-pack": { name: "Chemical Science Pack", time: 24.0, ingredients: { "engine-unit": 2, "advanced-circuit": 3, "sulfur": 1 }, resultCount: 2 }
};

// Global object store for API recipes
let recipeDatabase = LOCAL_RECIPE_FALLBACK;

// DOM Element Selection
const form = document.getElementById('factorio-form');
const itemSelect = document.getElementById('item-select');
const targetRateInput = document.getElementById('target-rate');
const assemblerTierSelect = document.getElementById('assembler-tier');
const speedModuleCheckbox = document.getElementById('speed-module');
const resultsPlaceholder = document.getElementById('results-placeholder');
const resultsDisplay = document.getElementById('results-display');

// Asynchronous API Data Fetching (Week 5 Fetch API & JSON)
async function loadRecipeData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Successfully fetched recipes from GitHub API:", data);
    
// Normalise API array or objct into recipe lookup using the repo's schema
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.name || item.id) {
          const key = (item.id || item.name).toLowerCase().replace(/\s+/g, '-');
          recipeDatabase[key] = {
            name: item.name || key,
            time: item.recipe?.time || 0.5,
            ingredients: item.recipe?.ingredients || {},
            resultCount: item.recipe?.yield || 1
          };
        }
      });
    }
  } catch (error) {
    console.warn("Using local recipe fallback due to API fetch error:", error.message);
    // Retains LOCAL FALLBACK
  }
}

// Execute inial recipe fetch when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadRecipeData();
});

// Form Submission & Calculation Event Handler (Week 4 Events)
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent full-page submit refresh

  // Get selected input values
  const selectedItemKey = itemSelect.value;
  const targetRate = parseFloat(targetRateInput.value);
  const baseMachineSpeed = parseFloat(assemblerTierSelect.value);
  const selectedBeltRadio = document.querySelector('input[name="beltTier"]:checked');
  const maxBeltCapacity = parseFloat(selectedBeltRadio.value);
  const hasSpeedModule = speedModuleCheckbox.checked;

  // Basic validatin check
  if (!selectedItemKey || isNaN(targetRate) || targetRate <= 0) {
    alert("Please select a valid target item and enter a positive production rate.");
    return;
  }

  // Retrieve recipe specs from database or fallback
  const recipe = recipeDatabase[selectedItemKey] || LOCAL_RECIPE_FALLBACK[selectedItemKey];

  if (!recipe) {
    alert("Recipe specs for selected item could not be found.");
    return;
  }

  // Calculate Effective Crafting Speed
  const effectiveCraftingSpeed = hasSpeedModule ? baseMachineSpeed * 1.20 : baseMachineSpeed;

  // Core Math Formula: Assemblers Needed = (Target Rate * Base Craft Time) / (Crafting Speed * Recipe Yield)
  const craftingTime = recipe.time || 0.5;
  const recipeYield = recipe.resultCount || 1;
  const assemblersNeeded = (targetRate * craftingTime) / (effectiveCraftingSpeed * recipeYield);

  // Belt Throughput Analysis
  const beltUtilisationPercent = ((targetRate / maxBeltCapacity) * 100).toFixed(1);
  const isOverCapacity = targetRate > maxBeltCapacity;

  // Render dynamic result cards into DOM
  renderResults({
    itemName: recipe.name || itemSelect.value,
    targetRate: targetRate,
    craftingTime: craftingTime,
    assemblersNeeded: assemblersNeeded.toFixed(2),
    effectiveCraftingSpeed: effectiveCraftingSpeed.toFixed(2),
    maxBeltCapacity: maxBeltCapacity,
    beltUtilisationPercent: beltUtilisationPercent,
    isOverCapacity: isOverCapacity,
    ingredients: recipe.ingredients
  });
});

// Dynamic DOM Rendering Function (Week 5 DOM Manipulation)
function renderResults(data) {
  // Hide placeholder and reveal results grid
    resultsPlaceholder.classList.add('hidden');
    resultsDisplay.classList.remove('hidden');

  // Normalise ingredients into a standardised array of { name, amount }
    let ingredientList = [];
    if (Array.isArray(data.ingredients)) {
        ingredientList = data.ingredients.map(ing => ({
        name: ing.name || ing.title || ing.item || 'Ingredient',
        amount: typeof ing.amount === 'number' ? ing.amount : (ing.count || 1)
        }));
    } else if (data.ingredients && typeof data.ingredients === 'object') {
        ingredientList = Object.entries(data.ingredients).map(([ingName, ingAmount]) => ({
        name: ingName,
        amount: ingAmount
        }));
    }

  // Helper function: evaluates ingredient flow rate against belt tiers
  function getBeltRequirement(rate, selectedMax) {
    const isOverChosen = rate > selectedMax;
    let requiredBeltTier = '';

    if (rate <= 15) {
      requiredBeltTier = 'Yellow Belt (15/s)';
    } else if (rate <= 30) {
      requiredBeltTier = 'Red Belt (30/s)';
    } else if (rate <= 45) {
      requiredBeltTier = 'Blue Belt (45/s)';
    } else {
      const beltsNeeded = Math.ceil(rate / 45);
      requiredBeltTier = `${beltsNeeded} Blue Belts (${rate.toFixed(1)}/s)`;
    }

    if (isOverChosen) {
      return `<span class="badge badge-warning">${rate.toFixed(1)}/s exceeds chosen belt! Needs ${requiredBeltTier}</span>`;
    } else {
      return `<span class="badge badge-success">${rate.toFixed(1)}/s — Fits chosen belt (${requiredBeltTier})</span>`;
    }
  }

  // Build ingredient breakdown HTML list with belt throughput checks
  let ingredientsHTML = '';
  if (ingredientList.length > 0) {
    ingredientsHTML = '<ul class="ingredient-list" style="list-style: none; padding-left: 0;">';
    ingredientList.forEach(ing => {
      const ingRate = data.targetRate * ing.amount;
      const beltBadge = getBeltRequirement(ingRate, data.maxBeltCapacity);
      ingredientsHTML += `
        <li style="margin-bottom: 0.85rem; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
          <strong>${ing.name}</strong>: ${ingRate.toFixed(1)} / sec (${ing.amount} per craft)
          <br>${beltBadge}
        </li>`;
    });
    ingredientsHTML += '</ul>';
  } else {
    ingredientsHTML = '<p>No intermediate ingredients required (Raw Material).</p>';
  }

  // Build Output Belt Status Badge
  const badgeClass = data.isOverCapacity ? 'badge-warning' : 'badge-success';
  const badgeText = data.isOverCapacity 
    ? `Bottleneck: Output exceeds belt limit (${data.beltUtilisationPercent}% capacity)!` 
    : `Optimal: ${data.beltUtilisationPercent}% of output belt capacity used.`;

  // Inject markup directly into results section
  resultsDisplay.innerHTML = `
    <article class="result-card">
      <h3>Target: ${data.itemName}</h3>
      <p><strong>Desired Output Rate:</strong> ${data.targetRate} items / sec</p>
      <p><strong>Required Assemblers:</strong> <span class="highlight-val">${data.assemblersNeeded}</span> machines</p>
      <p><strong>Machine Crafting Speed:</strong> ${data.effectiveCraftingSpeed}</p>
    </article>

    <article class="result-card">
      <h3>Output Belt Throughput Analysis</h3>
      <p><strong>Selected Belt Limit:</strong> ${data.maxBeltCapacity} items / sec</p>
      <p><strong>Belt Load:</strong> ${data.beltUtilisationPercent}%</p>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </article>

    <article class="result-card">
      <h3>Required Ingredient Flow Rates & Input Belt Analysis</h3>
      ${ingredientsHTML}
    </article>
  `;
}

// Form Reset Event Handler
form.addEventListener('reset', () => {
  // Hide output display and restore default placeholder
  resultsDisplay.classList.add('hidden');
  resultsDisplay.innerHTML = '';
  resultsPlaceholder.classList.remove('hidden');
});