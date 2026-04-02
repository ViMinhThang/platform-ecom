# Design System Specification: The Editorial Marketplace

## 1. Overview & Creative North Star
### The Creative North Star: "The Curated Kinetic"
This design system rejects the "commodity grid" of legacy e-commerce. While it draws from the trustworthiness of industry giants, it moves toward a "Curated Kinetic" aesthetic—one that feels like a high-end editorial magazine brought to life with digital energy. 

We move beyond the static template by using **intentional asymmetry**, where product imagery occasionally breaks the container bounds, and **tonal depth**, where hierarchy is defined by light and warmth rather than rigid lines. The goal is a digital marketplace that feels "alive" and premium, inviting the user to explore rather than just transact.

---

## 2. Colors & Surface Architecture
Our palette uses a high-energy **Primary Orange (`#ab2d00`)** balanced by a sophisticated **Secondary Blue (`#0959b6`)**. The foundation is built on a warm, "creamy" neutral base to avoid the sterile coldness of pure white.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define boundaries, designers must use background color shifts. 
*   **Example:** A product description block (`surface-container-low`) sitting on the main page background (`surface`).
*   **The Goal:** A seamless, fluid interface that feels like it was molded from a single material.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to create depth:
*   **Canvas:** `surface` (#fff4f3) – The base of the application.
*   **Structural Sections:** `surface-container-low` (#ffedeb) – For large layout blocks.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) – Used to make product cards "pop" against the warm background.
*   **Persistent Elements:** `surface-container-high` (#ffdad8) – For navigation bars or sidebars that need to feel "closer" to the user.

### The Glass & Gradient Rule
*   **Glassmorphism:** For floating elements like "Quick Buy" overlays or sticky headers, use `surface-variant` at 70% opacity with a `24px` backdrop blur.
*   **Signature Gradients:** Main CTAs and Hero sections should utilize a subtle linear gradient from `primary` (#ab2d00) to `primary-container` (#ff7851) at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography: The Editorial Voice
We utilize a duo-font system to balance authority with accessibility.

*   **The Authority (Display & Headlines):** **Plus Jakarta Sans**. A modern, wide-aperture sans-serif that feels premium and tech-forward. Use `display-lg` (3.5rem) for major brand moments and `headline-md` (1.75rem) for category titles.
*   **The Utility (Body & Labels):** **Inter**. Chosen for its extreme legibility at small sizes. Use `body-md` (0.875rem) for product descriptions and `label-md` (0.75rem) for metadata.

**Hierarchy Tip:** Always pair a `headline-lg` in a heavier weight with `body-lg` in a regular weight to create a high-contrast editorial look that guides the eye instantly to the most important information.

---

## 4. Elevation & Depth
Traditional drop shadows are too "cheap" for this system. We use **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container` (#ffe1e0) background. This creates a natural, soft lift.
*   **Ambient Shadows:** For elements that truly float (e.g., Modals), use a "Sunlight Shadow":
    *   `Box-shadow: 0px 20px 40px rgba(78, 33, 32, 0.06);` 
    *   The shadow is tinted with the `on-surface` color (#4e2120) to ensure it looks like a natural occlusion of light.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline-variant` at 15% opacity. Never use 100% opaque black or grey borders.

---

## 5. Components

### Buttons: The "Pill" Aesthetic
*   **Primary:** `primary` background with `on-primary` text. Shape: `full` (9999px). Gradient encouraged.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. Shape: `lg` (1rem).
*   **States:** On hover, shift the background color to its `dim` variant (e.g., `primary` to `primary-dim`).

### Cards & Lists: The "No-Divider" Mandate
*   **Product Cards:** Use `surface-container-lowest` and a `md` (0.75rem) corner radius. Separate product info from the image using `1.5` (0.375rem) padding scale increments, never a horizontal line.
*   **Lists:** Forbid the use of divider lines. Separate list items using `spacing-4` (1rem) vertical gaps and a subtle background shift on hover.

### Input Fields: Soft Focus
*   **Style:** `surface-container-low` background with no border.
*   **Active State:** Transitions to `surface-container-lowest` with a `2px` "Ghost Border" of the `primary` color at 40% opacity.

### Featured Component: "The Spotlight Carousel"
A bespoke component for this system. A large-scale horizontal scroll where the active item uses `display-sm` typography and breaks out of the card container, overlapping the background section to create 3D depth.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical padding (e.g., `spacing-10` on the left, `spacing-8` on the right) for hero layouts to create movement.
*   **Do** use high-quality imagery with warm lighting to complement the `#fff4f3` background.
*   **Do** use `tertiary` (#833e9a) sparingly as a "Flash Sale" or "Exclusive" accent color.

### Don’t:
*   **Don’t** use 1px solid `#CCCCCC` or `#000000` borders. They break the editorial flow.
*   **Don’t** use standard "Material Design" shadows. They are too heavy for this warm palette.
*   **Don’t** overcrowd. If in doubt, increase the spacing by one tier on the scale (e.g., move from `spacing-6` to `spacing-8`).
*   **Don’t** use pure black `#000000` for text. Use `on-surface` (#4e2120) for a softer, more premium reading experience.