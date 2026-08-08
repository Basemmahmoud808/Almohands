# Design Tokens & UI Architecture Mapping

This document details how the design rules from `D:\Almohands_wed\.agents\skills` (`ui-ux-pro-max`, `banner-design`, `brand`, `design-system`, `ui-styling`, `ponytail`) are implemented across the **El Mohandes (المهندس)** frontend.

---

## 🎨 1. Color Palette Tokens (3-Layer Architecture)

```css
/* Layer 1: Primitive Tokens */
--primitive-blue-950: #0f172a;  /* Dark Math Navy */
--primitive-blue-900: #1e3a8a;  /* Royal Blue Primary */
--primitive-blue-600: #2563eb;  /* Interactive Blue */
--primitive-amber-500: #f59e0b; /* Math Gold / Secondary Accent */
--primitive-emerald-600: #059669; /* Success Green */

/* Layer 2: Semantic Tokens */
--color-primary: var(--primitive-blue-900);
--color-secondary: var(--primitive-amber-500);
--color-success: var(--primitive-emerald-600);
--color-bg-app: #f8fafc;
--color-surface: #ffffff;

/* Layer 3: Component Tokens */
--card-bg: var(--color-surface);
--card-border: #e2e8f0;
--card-radius: 1.25rem;
```

---

## ✍️ 2. Typography & RTL Scale

- **Font Family**: Cairo (`--font-cairo`), Google Font with full Arabic & Latin glyph support.
- **Direction**: `dir="rtl"`, text aligned right with mirrored icons (`ArrowLeft` pointing left for "forward" in RTL).
- **Scale**:
  - `Hero Headline`: `text-4xl` to `text-6xl`, `font-black` (Weight 900)
  - `Section Heading`: `text-2xl` to `text-3xl`, `font-bold` (Weight 700)
  - `Body Text`: `text-sm` to `text-base`, `font-medium` (Weight 500)
  - `Caption / Meta`: `text-xs` to `text-[10px]`, `font-bold`

---

## ✨ 3. Motion & Micro-Interactions (Framer Motion)

- Page load fade & slide up animations (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`).
- Hover scaling on cards (`whileHover={{ scale: 1.02 }}`).
- Tap feedback on buttons (`whileTap={{ scale: 0.98 }}`).

---

## 📱 4. Mobile-First & Responsive Layouts

- Minimum touch target size: 44px × 44px on all buttons and interactive choices.
- Grid breakpoints: 1 column on mobile (`grid-cols-1`), 2 columns on tablet (`md:grid-cols-2`), 3–4 columns on desktop (`lg:grid-cols-3` / `lg:grid-cols-4`).
