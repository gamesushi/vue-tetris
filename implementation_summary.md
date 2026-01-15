
- **UI Layout Fixes (`src/app.js`)**:
  - Adjusted the layout calculation logic in `render()`.
  - Introduced `baseHeight` variable:
    - PC (`!isMobile`): `962px` (matching the reduced height without keyboard).
    - Mobile (`isMobile`): `1350px` (original height with virtual keyboard).
  - Updated `margin-top` calculation to use `baseHeight`, ensuring the game container is vertically centered on PC screens without clipping the top logo. Previous hardcoded value `-675px` was causing the top part to be hidden on PC.
