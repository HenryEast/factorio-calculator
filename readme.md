# Factorio Ratio & Belt Speed Calculator

> **Web Technologies - Practical Web Development Project** > An interactive web application built by Henry Eastham with semantic HTML5, mobile-first CSS3, JavaScript, and third-party API data integration.

## Live Application & Links 
* **Live Web App (GitHub Pages)**: `https://henryeast.github.io/factorio-calculator/`
* **GitHub Repository**: `https://github.com/HenryEast/factorio-calculator` 

## Overview & Domain Purpose
In the factory management game *Factorio*, players design complex, automated production lines. Optimising factory output requires balancing item crafting rates, assembler speeds, and transport belt throughput capacities. 

The **Factorio Ratio & Belt Speed Calculator** provides an intuitive web interface that allows players to: 
1. Select target items (e.g., Electronic Circuits, Science Packs) and enter **desired output rates** (items per second). 
2. Configure **machine parameters** (Assembler Tiers 1–3 and Speed Module multipliers). 
3. Evaluate output throughput against **transport belt capacities** (Yellow: 15/s, Red: 30/s, Blue: 45/s). 
4. Analyse raw ingredient flow rates in real-time to detect input **supply belt bottlenecks**. 

## Key Features & Technical Highlights
### 1. Dynamic Ratio & Throughput Math Engine
* **Assembler Requirement Calculation**: Uses exact crafting formulas.
* **Output Belt Capacity Analysis**: Evaluates load percentages on chosen transport belt tiers and dynamically displays contextual visual status badges (`.badge-success` vs. `.badge-warning`). 
* **Input Ingredient Belt Analysis**: Dynamically calculates raw material consumption rates per second and verifies whether each supply line fits the chosen transport belt tier or requires higher-tier belts (Red/Blue).
### 2. Asynchronous Third-Party API Integration 
* **Data Source**: Fetches live recipe specifications directly from the public GitHub raw JSON repository: `https://github.com/kevinta893/factorio-recipes-json` 
* **Resilient Architecture**: Uses asynchronous ES6 `fetch()` with `async/await` and `try...catch` error handling. Includes a structured local fallback database (`LOCAL_RECIPE_FALLBACK`) to ensure uninterrupted functionality in offline or high-latency environments.
### 3. W3C WCAG 2.1 AA Accessibility Integration 
* **Semantic Landmarks**: Formatted using `<header>`, `<main>`, `<section>`, and `<footer>` landmarks. 
* **Programmatic Form Associations**: All form controls feature explicit `<label for="...">` linkages, `required` attributes, and `aria-required="true"`. 
* **Dynamic Live Region**: The results output section utilises `aria-live="polite"` so screen readers automatically announce dynamic calculation updates without refreshing the page. 
* **High Contrast & Focus State**: Dark industrial slate theme maintaining a high contrast ratio with clear, high-visibility `:focus` outlines for keyboard users.

## 🛠️ Technology Stack & Standards 
| Technology | Implementation & Standards |
| :--- | :--- | 
| **HTML5** | Semantic structure (`<header>`, `<main>`, `<section>`, `<footer>`), `<fieldset>`/`<legend>` form grouping, and WCAG accessibility attributes (`aria-live`, `aria-required`). |
| **CSS3** | External stylesheet (`style.css`), `box-sizing` reset, CSS Custom Properties (`:root` variables), and a tested mobile-first responsive layout expanding via `@media (min-width: 768px)` media queries. |
| **JavaScript (ES6+)** | (`app.js`), DOM event handling (`submit`, `reset`), `fetch()` API, dynamic DOM manipulation (`innerHTML`), and normalisation for varied JSON structures. |
| **Version Control & Hosting** | Git source control, structured commit messages, semantic changelog (`see below`), and GitHub Pages deployment. |

## Acknowledgements
 * **Web Technologies Module Team**: Academic guidance, module structure, and learning materials provided by the Level 7 Web Technologies course team (Module Leader Dr. Junghun Yoo and Module Tutors). 
 * **Wube Software**: Creators of *Factorio* for the game mechanics, recipe ratios, item concepts, and domain inspiration. 
 * **Factorio Recipes API**: Kevin Ta ([kevinta893]([https://github.com/kevinta893/factorio-recipes-json])) for creating and hosting the open-source `factorio-recipes-json` repository used for third-party API integration. 
 * **W3C & Web Accessibility Initiative (WAI)**: For the Web Content Accessibility Guidelines (WCAG 2.1 AA) and WAI-ARIA standards. 
 * **Documentation & Technical References**: W3Schools and MDN Web Docs for technical HTML5, CSS3, and ES6 JavaScript standards documentation. 
 * **Hosting & Deployment**: GitHub for Git version control and continuous hosting via GitHub Pages.

## Repository Structure 
```text 
factorio-calculator/
 ├── index.html # Semantic HTML5 layout & accessible form markup 
 ├── style.css # External stylesheet with mobile-first CSS Grid/Flexbox 
 ├── app.js # Ratio math engine, API fetch pipeline & DOM rendering
```



## Changelog
| Date |Change|Affected Files|
|-|-|-|
|11/10/2026 - 00:26|Made Initial Commit and added readme| app.js, index.html, style.css, readme.md|
|11/10/2026 - 12:40|**`index.html`**: Created core HTML structure for the Factorio Ratio & Belt Speed Calculator. **Form Controls**: Built production goal inputs (target item dropdown, output rate input) and machine configuration controls (assembler tier dropdown, belt speed radio buttons, speed module checkbox). **Accessibility & Validation**: Implemented semantic layout landmarks, explicitly linked form labels, native input validation constraints (`min`, `step`, `required`), and an `aria-live="polite"` dynamic container for calculation outputs. |index.html|
|11/10/2026 - 14:36 | Built complete mobile-first external stylesheet for the Factorio Ratio Calculator. **Responsive Layout**: Designed single-column mobile stacking layout expanding into a two-column CSS Grid desktop dashboard at 768px+. **Theme & Accessibility**: Implemented Factorio industrial slate palette, focus outlines for interactive form inputs, and custom status badge styles.| style.css|
|11/10/2026 - 18:32| **`app.js`**: Initial complete release of JavaScript application logic for the Factorio Ratio Calculator. **API Integration**: Asynchronously fetches recipe specifications from GitHub raw JSON (`kevinta893/factorio-recipes-json`). **Calculation Engine**: Added real-time ratio math for assembling machines, output belt utilisation, and raw ingredient flow rates. **Input Belt Analysis**: Added automated checks evaluating whether each ingredient line fits the chosen transport belt tier or requires higher belt speeds (Red/Blue).|app.js|
|11/10/2026 - 19:20| Final Readme Update/.| readme.md|