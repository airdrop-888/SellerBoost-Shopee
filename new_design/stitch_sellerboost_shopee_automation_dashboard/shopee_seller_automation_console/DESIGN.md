---
name: Shopee Seller Automation Console
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d9e3f9'
  on-surface: '#121c2c'
  on-surface-variant: '#5b403b'
  inverse-surface: '#273141'
  inverse-on-surface: '#ebf1ff'
  outline: '#8f7069'
  outline-variant: '#e3beb6'
  surface-tint: '#b62506'
  primary: '#b22204'
  on-primary: '#ffffff'
  primary-container: '#d63c1e'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a4'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#515c71'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a758a'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a4'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#8d1600'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f9f9ff'
  on-background: '#121c2c'
  surface-variant: '#d9e3f9'
typography:
  display-metric:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  title-section:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.02em
  title-card:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-product:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-table:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  body-table-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  mono-timer:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  mono-terminal:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system is constructed for mission-critical e-commerce operations, tailored directly for high-velocity Indonesian Shopee sellers managing multi-store deployments. It strikes a deliberate balance between developer-grade operational tooling and the familiar, high-tempo atmosphere of Southeast Asian digital commerce.

### Brand Personality & Core Audience
- **Target Audience:** Multi-account merchants, e-commerce operations leads, and automated store managers who require zero-downtime execution, continuous product visibility boosting, and instant telemetry feedback.
- **Brand Character:** Surgical, dependable, hyper-vigilant, and energizing.
- **Emotional Target:** Uncompromising operational peace of mind. The user should perceive the platform as an tireless autonomous command desk running seamlessly in the background.

### Design Movement: High-Density Enterprise SaaS & Tactical Duality
The aesthetic leverages a stark architectural duality:
1. **The Tactical Command Core:** An unapologetic, focused dark anchor (`#111827` to `#1E293B`) utilized for navigation sidebars, process feeds, and terminal telemetry log streams.
2. **The Surgical Workspace:** Ultra-crisp, light porcelain and white operational surfaces (`#FFFFFF` on `#F6F8F9`) accentuated by an engineering dot-matrix field (`radial-gradient(#E2E8F0 1px, transparent 1px)` spaced at 20px).
3. **The Commercial Catalyst:** Shopee’s distinctive high-visibility energetic cadmium orange (`#EE4D2D` / `#D63D20`) serving strictly as the primary interactive catalyst and active operational signal.

## Colors

The color architecture is built around clear visual utility: high-contrast feedback for automated actions, clinical distinction between normal operations and throttled states, and immediate brand recognition.

### Color Roles

- **Primary (`#EE4D2D`):** Shopee-inspired active cadmium orange. Reserved for primary triggers, active automation switches, focused input rings, and critical progress badges.
- **Primary Hover (`#D63D20`):** Deeper ember used for active click and hover states to provide tactile weight.
- **Primary Container (`#FFF5F3`):** Ultra-soft tinted wash for primary button outlines, active row tints, and warning/brand highlights.
- **Secondary (`#111827`):** Midnight Operator Navy. Serves as the fixed Electron desktop sidebar background and top-tier framing container.
- **Tertiary (`#1E293B`):** Dark Operations Slate. Applied to log console backgrounds, store avatar disks, and monospaced terminal panels.
- **Neutral / Canvas:**
  - `Canvas Background`: `#F6F8F9` (Porcelain Gray)
  - `Card Surface`: `#FFFFFF` (Crisp Optical White)
  - `Subtle Surface`: `#F8FAFC` (Slate Table Header / Muted Chip Container)
  - `Border / Hairline`: `#E2E8F0` (Surgical Divider Slate)
  - `Border Active / Subtle`: `#CBD5E1` (Muted input boundaries and slider tracks)
- **Text Tiers:**
  - `Primary Text`: `#2D3748` (Dense Slate Charcoal, non-pure black for reduced eye strain)
  - `Muted / Meta Text`: `#718096` (Cool Steel Slate for column titles, breadcrumbs, and units)
  - `De-emphasized Text`: `#64748B` (Brackets, timestamps, and terminal gutters)

### Functional & Status Tiers
- **Active / Operational:** Border & Text `#1E8E3E`, Surface Container `#E6F4EA` (Emerald Forest).
- **Cooldown / Throttled:** Border & Text `#B06000`, Surface Container `#FEF7E0` (Ochre Amber).
- **Error / Expired Session:** Border & Text `#DC2626` / `#D93025`, Surface Container `#FEE2E2` (Crimson Alert).
- **Terminal Syntax Output:**
  - Background: `#1E293B`
  - Body: `#E2E8F0`
  - Success Log Stream: `#4ADE80`
  - Cooldown / Rate Limit Stream: `#FBBF24`
  - Error / Network Drop Stream: `#F87171`

## Typography

The design system relies on **Inter** configured with strict numerical and spatial conventions to handle real-time data feeds, continuous countdown timers, and dense accounting tables.

### Rules and Numerical Discipline
- **Tabular Figures for Dynamic Data:** For all live counts, clocks, currency (`Rp`), percentages, and telemetry counters, activate `font-feature-settings: "tnum" 1` (or `font-variant-numeric: tabular-nums`). This prevents horizontal jitter and jumping text during real-time updates.
- **Mono Timers & Feeds:** Elements tagged with `mono-timer` and `mono-terminal` inherit monospace fallbacks (`monospace`) to maintain strict character alignment across variable-length operational logs.
- **Uppercase Tracking:** All micro-headings, telemetry indicators, and column sort headers (`label-caps`) utilize `text-transform: uppercase` paired with an expanded tracking of `+0.05em` to ensure legibility at `11px`.
- **Vertical Clamping:** Product titles inside catalog tables are limited to 2 lines (`line-clamp: 2`) with an explicit line height of 20px to prevent uneven row heights.

## Layout & Spacing

The layout model is crafted for an Electron desktop interface optimized for standard resolutions starting at 1280×850px. The interface utilizes a locked structural shell with internal card-level scrolling.

### Structural Framework
- **Master Split:** A fixed 250px vertical sidebar anchored to the left, running full viewport height. The adjacent main panel takes the remaining fluid width, containing an inner container centered with a maximum width of `1100px`.
- **Header Dock:** A fixed-height 60px frosted header (`backdrop-filter: blur(12px)`) that anchors global breadcrumbs, network heartbeat indicators, and active account switchers.
- **Viewport Locking:** The application window enforces `overflow: hidden` on the root body. All layout scrolling occurs strictly within the designated `.main-content` panel or targeted container feeds (such as the log terminal and data tables).

### Rhythm & Density
- **Spacing Scale:** Built entirely upon a baseline 4px step:
  - `space-xs` (4px): Micro gaps between icons and labels, badge internal vertical padding.
  - `space-sm` (8px): Gaps between badge chips, row element margins, small button vertical padding.
  - `space-md` (12px): Standard sidebar link padding, button horizontal spacing.
  - `space-lg` (16px): Standard table row cell vertical padding, modal inner element margins.
  - `space-xl` (24px): Card padding, structural section separations.
- **Telemetry Grid:** Dashboard top-level stat metrics sit on a 3-column equal grid (`repeat(3, 1fr)`) separated by a `20px` gap (`1.25rem`).
- **Product Card Matrix:** Flexible multi-card layout using `repeat(auto-fill, minmax(280px, 1fr))` with `24px` gutter and row separation.

## Elevation & Depth

The design system purposefully avoids dramatic skeuomorphic depth, relying on **tactile tonal layering, subtle hairline borders, and targeted ambient drop shadows** to communicate structural hierarchy.

### Depth Hierarchy

1. **Base Foundation (Level 0):**
   - Canvas surface (`#F6F8F9`) combined with an active geometric blueprint: a 20×20px repeating radial dot pattern (`radial-gradient(#E2E8F0 1px, transparent 1px)`). This adds subtle texture underneath flat data cards.
2. **Resting Cards & Containers (Level 1):**
   - White surface fill (`#FFFFFF`) framed with a crisp hairline border (`1px solid #E2E8F0`).
   - Ambient diffuse shadow: `0 1px 3px rgba(0, 0, 0, 0.04)`.
3. **Card Interactive / Hover State (Level 2):**
   - Slight physical translation: `transform: translateY(-2px)`.
   - Expanded elevation shadow: `0 4px 12px rgba(0, 0, 0, 0.06)`, maintaining the `1px solid #E2E8F0` border.
4. **Docked Navigation & Overlays (Level 3):**
   - Top navigation bar: Translucent white fill (`rgba(255, 255, 255, 0.85)`) backed by a hardware-accelerated blur (`backdrop-filter: blur(12px)`), bounded by a bottom hairline (`1px solid #E2E8F0`).
   - Modal dialogs: Positioned above an obsidian translucent backdrop (`rgba(17, 24, 39, 0.6)`), sporting an elevation shadow of `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` and `1px solid #E2E8F0`.
5. **Dark Terminal Gutter (Level Inset):**
   - Log terminal containers use an inverted visual anchor: background `#1E293B` with an inset shadow (`inset 0 2px 4px rgba(0, 0, 0, 0.25)`) to create the physical sensation of an embedded CRT console.

## Shapes

The design system maintains a structured, professional corner radius architecture (`Level 1 - Soft`), using exact corner radiuses to reinforce precision.

### Radius Distribution
- **Cards & Primary Modules:** `12px` (`rounded-xl` in this scale). Used for stat cards, terminal shells, product catalog wrappers, and modal windows to create smooth enclosures.
- **Interactive Buttons & Form Fields:** `6px` (`rounded.DEFAULT`). Balanced geometry for text inputs, select dropdowns, primary/secondary buttons, and sidebar action tiles.
- **Nested Inner Elements & Micro-Controls:** `4px` (`rounded-sm`). Checkboxes, icon action buttons, slot usage progress tracks, and nested breadcrumb chips.
- **Status Badges & Pills:** `9999px` (Full pill shape). Used exclusively for live statuses (Active, Cooldown, Expired) and store identity indicators.

## Components

### Buttons
- **Primary Action (`.btn-primary`):**
  - Surface: `#EE4D2D`; Text: `#FFFFFF`; Radius: `6px`.
  - Padding: `8px 16px`; Font: `13px / 600 weight`; Inline icon spacing: `6px`.
  - Hover: Background `#D63D20`, transition `all 0.15s ease`.
  - Active: Scale down slightly (`transform: scale(0.98)`).
- **Secondary Ghost / Outlined (`.btn-secondary`):**
  - Surface: `#FFFFFF`; Border: `1px solid #EE4D2D`; Text: `#EE4D2D`; Radius: `6px`.
  - Hover: Background `#FFF5F3`.
- **Icon Utility Actions:**
  - Base: Transparent background, `4px` radius, `4px` internal padding, `#718096` icon color.
  - Hover: `#F1F5F9` background, `#2D3748` icon color.
  - Destructive hover (e.g., Delete Account): `#FEE2E2` background, `#DC2626` icon glyph.

### Form Fields & Cookies Ingestion
- **Shopee Cookie / Session Input:**
  - Dedicated multi-line textarea with a monospace font (`Inter, monospace`, 12px) for cookie tokens.
  - Background: `#FFFFFF`; Border: `1px solid #E2E8F0`; Radius: `6px`; Internal padding: `10px 12px`.
  - Focus: Border shifts to `#EE4D2D` with an ambient glow (`box-shadow: 0 0 0 3px rgba(238, 77, 45, 0.12)`).
- **Interactive Automation Toggle (`.switch`):**
  - Track: Width `34px`, height `18px`, radius `9999px`. Base color `#CBD5E1`.
  - Active Track: `#EE4D2D`.
  - Thumb: Circle `14px` diameter in `#FFFFFF`, with `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2)`. Translates `16px` smoothly when checked.

### Badges, Pills & Indicators
- **Operational Status Pills:**
  - Border-radius `9999px`, padding `4px 10px`, font size `12px`, weight `600`.
  - `Active`: Background `#E6F4EA`, Text `#1E8E3E`.
  - `Cooldown`: Background `#FEF7E0`, Text `#B06000`.
  - `Expired`: Background `#FCE8E6`, Text `#D93025`.
- **Live Pulse Beacon:**
  - An `8×8px` circular dot with a `3px` solid concentric ring matching the container status color.
  - Animate using an infinite 1.2s ease pulse keyframe cycling opacity between `1.0` and `0.35`.
- **Slot Capacity Meter:**
  - Track: Height `4px`, background `#E2E8F0`, width capped at `100px`.
  - Dynamic Fill:
    - 1–2 slots utilized: `#F1582C`
    - 3–4 slots utilized: `#F39C12`
    - 5 slots (fully saturated): `#E74C3C`

### Data Tables & Logs
- **Multi-Shop Account Table:**
  - Header Row: Background `#F8FAFC`, height `40px`, border-bottom `1px solid #E2E8F0`. Typography is `label-caps` (`11px`, bold, tracking `0.05em`, color `#718096`).
  - Row Architecture: White background, height `56px`, horizontal padding `24px`, border-bottom `1px solid #E2E8F0`. Hover triggers background change to `#F8FAFC`.
  - Store Badge: `28×28px` circle in `#1E293B` featuring a centered uppercase letter in white.
- **Embedded Dark Operator Terminal (`#bot-logs`):**
  - Shell: Deep slate surface (`#1E293B`), height fixed at `180px`, corner radius `8px`, border `1px solid #334155`.
  - Padding: `14px 18px`; Typography: `mono-terminal` (`12px`, regular).
  - Row Entry: Monospace line height `20px`. Timestamps bracketed in muted `#64748B` (`[14:22:01]`), followed by syntax-colored feedback streams (Success: `#4ADE80`, Warning: `#FBBF24`, Error: `#F87171`, Info: `#E2E8F0`).