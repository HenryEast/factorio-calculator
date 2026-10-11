# Welcome to my Factorio Calculator

## Changelog

| Date |Change|Affected Files|
|-|-|-|
|11/10/2026 - 00:26|Made Initial Commit and added readme| app.js, index.html, style.css, readme.md|
|11/10/2026 - 12:40|**`index.html`**: Created core HTML structure for the Factorio Ratio & Belt Speed Calculator. **Form Controls**: Built production goal inputs (target item dropdown, output rate input) and machine configuration controls (assembler tier dropdown, belt speed radio buttons, speed module checkbox). **Accessibility & Validation**: Implemented semantic layout landmarks, explicitly linked form labels, native input validation constraints (`min`, `step`, `required`), and an `aria-live="polite"` dynamic container for calculation outputs. |index.html|
|11/10/2026 - 14:36 | Built complete mobile-first external stylesheet for the Factorio Ratio Calculator. **Responsive Layout**: Designed single-column mobile stacking layout expanding into a two-column CSS Grid desktop dashboard at 768px+. **Theme & Accessibility**: Implemented Factorio industrial slate palette, focus outlines for interactive form inputs, and custom status badge styles.| style.css|