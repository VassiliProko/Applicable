# Design System

The design system below is the single source of truth. It overrides any assumptions about what a 'Social Platform' typically looks like. Apply these tokens exactly — colors, spacing, radius, elevation, motion — even if they contradict conventional patterns for this project type.

Use only the tokens defined below within each category. Do not introduce new values. If a token cannot be applied under stack constraints, skip it rather than approximating.

## Design DNA (read this first)

- Preset: Scandinavian — all tokens below derive from this aesthetic. Maintain its visual identity.
- Layout: Contained layout — max-width 1280px, 12-column grid. Gutter 18px, margin 36px.
- Spacing: Balanced spacing — standard density. Base unit 24px, baseline grid 8px.
- Surfaces: Moderately rounded (12px) — friendly but structured. Bordered (1px at 6% opacity) — explicit structure. Layered elevation — shadow for depth hierarchy.
- Motion: Standard motion timing.
- Color: Primary #E8432A + Accent #2E7EA6 — bold contrast. on #0E2A3C background.
- Type: Playfair Display (headings) + Source Sans 3 (body) — serif/sans pairing.

This combination defines the visual personality. Every token below serves this DNA. Prioritize tokens that reinforce these characteristics.

## 1. Color Tokens

### Primary: #E8432A — hsl(8, 81%, 54%)
Shades (darker): primary-100: #2e0d06, primary-200: #5c1a0c, primary-300: #8a2712, primary-400: #b8351e
Base: primary-500: #E8432A
Tints (lighter): primary-600: #ed6b55, primary-700: #f19380, primary-800: #f6bbab, primary-900: #faddd5
Text on primary: #ffffff (primary), #2e0d06 (secondary)

### Secondary: #F5A432 — hsl(36, 91%, 58%)
Shades (darker): secondary-100: #31200a, secondary-200: #624014, secondary-300: #93601e, secondary-400: #c48028
Base: secondary-500: #F5A432
Tints (lighter): secondary-600: #f7b75b, secondary-700: #f9ca84, secondary-800: #fbddad, secondary-900: #fdeed6
Text on secondary: #31200a (primary), #624014 (secondary)

### Accent: #2E7EA6 — hsl(200, 57%, 41%)
Shades (darker): accent-100: #091921, accent-200: #123242, accent-300: #1c4c64, accent-400: #256585
Base: accent-500: #2E7EA6
Tints (lighter): accent-600: #5898b8, accent-700: #82b2ca, accent-800: #abccdb, accent-900: #d5e5ed
Text on accent: #ffffff (primary), #091921 (secondary)

### Background & Surfaces
- Background: #0E2A3C
- surface-1: #153a50 | surface-2: #1d4a64 | surface-3: #255a78 (progressively lighter shades)
- Border: rgba(255,255,255,0.08)
- Text primary: #f0f0ec, secondary: #b8c8d0, tertiary: #7a8f9c, disabled: #4a5f6c
- Neutral gray: #C8C8C8 (for borders, dividers, muted UI elements)

### Semantic Colors
- Success: #22C55E | Warning: #F59E0B | Error: #EF4444 | Info: #3B82F6

### Interactive State Colors (derived from primary)
- Primary hover: #d03a23
- Primary active: #b8321d
- Ghost hover bg: rgba(232, 67, 42, 0.08)
- Disabled opacity: 0.4 (applied to all disabled interactive elements — buttons, inputs, selects)

### Focus Indicator Strategy
- Buttons/links/cards: outline: 2px solid #2E7EA6, offset 2px. No transition.
- Inputs: border 1px solid #E8432A + box-shadow: 0 0 0 2px rgba(232, 67, 42, 0.2). Transition: 100ms.
- Never remove focus without replacement. Never combine outline + box-shadow on same element.

### Overlay & Effects
- Backdrop overlay: rgba(0,0,0, 0.6)
- Uniform overlay (cover cards): rgba(0,0,0, 0.35)
- Backdrop blur: blur(4px)
- Scrim gradient: linear-gradient(transparent, rgba(0,0,0, 0.6))

## 2. Typography

### Heading Font: Playfair Display
- Family: 'Playfair Display', Georgia, 'Times New Roman', serif
- Load: inject via <style> tag: @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap')
- Weights available: 400, 500, 600, 700, 800, 900
- Use for: page titles, section headers, hero text, display numbers, card headings

### Body Font: Source Sans 3
- Family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif
- Load: inject via <style> tag: @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&display=swap')
- Weights available: 300, 400, 500, 600, 700
- Use for: paragraphs, UI labels, buttons, inputs, captions, navigation, metadata

### Pairing Strategy
Playfair Display (serif) + Source Sans 3 (sans-serif) — classic contrast pairing. Serif headings provide elegance and authority, sans-serif body ensures readability. Differentiate via family and weight: Playfair Display at 600-900 for titles, Source Sans 3 at 400 for body text.

### Type Scale — Major Third (ratio 1.25)
Apply these exact values. Define as CSS custom properties or design tokens:

**Caption** → font-family: Source Sans 3 | font-size: 12px | font-weight: 400 | line-height: 24px (1.4 → snapped to 8px grid) | letter-spacing: 0.01em
**Body** → font-family: Source Sans 3 | font-size: 16px | font-weight: 400 | line-height: 32px (1.6 → snapped to 8px grid) | letter-spacing: 0em
**Subhead** → font-family: Source Sans 3 | font-size: 20px | font-weight: 500 | line-height: 32px (1.35 → snapped to 8px grid) | letter-spacing: 0em
**Title** → font-family: Playfair Display | font-size: 24px | font-weight: 600 | line-height: 32px (1.2 → snapped to 8px grid) | letter-spacing: -0.01em
**Headline** → font-family: Playfair Display | font-size: 32px | font-weight: 700 | line-height: 40px (1.2 → snapped to 8px grid) | letter-spacing: -0.015em
**Display** → font-family: Playfair Display | font-size: 40px | font-weight: 700 | line-height: 48px (1.2 → snapped to 8px grid) | letter-spacing: -0.02em

### Iconography — Lucide
- Library: Lucide (1,500+ icons) by Community (Feather fork)
- Styles: Outline · adjustable stroke
- Grid: 24px · 2px rounded strokes — clean, modern, widely adopted
- Style: Outlined, stroke-width 2px, linecap round
- License: ISC · lucide.dev
- Implementation: import icons by PascalCase name from lucide-react. Example: import { Search, Home, Heart, User, Settings, Menu, X, ArrowRight, Check, Plus, Trash2, Eye, Bell, Mail, ChevronDown, Filter, Star, Bookmark, Share2, ExternalLink } from lucide-react. Render as JSX component with size prop, e.g. size 20.

## 3. Surfaces & Depth

### Border Radius
- Base (md): 12px
- Scale: xs 3px · sm 6px · md 12px · lg 18px · xl 24px · full 9999px
- Component mapping:
  - Buttons: sm (6px)
  - Inputs / Selects: sm (6px)
  - Cards: md (12px)
  - Modals / Dialogs: lg (18px)
  - Tooltips / Popovers: xs (3px)
  - Badges / Tags: full (9999px)
  - Chips: full (9999px)
  - Avatars: full (9999px)
  - Switches / Toggles: full (9999px)
  - Inner elements: subtract parent padding (e.g. card inner radius = md − card padding)

### Elevation (Box Shadow)
- **Low** (cards, inputs, list items): box-shadow: 0 1px 3px -1px rgba(0,0,0,0.059),0 3px 8px -1px rgba(0,0,0,0.047)
- **Mid** (dropdowns, tooltips, popovers): box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1),0 8px 24px -4px rgba(0,0,0,0.08)
- **High** (modals, dialogs, drawers): box-shadow: 0 4px 18px -4px rgba(0,0,0,0.148),0 18px 53px -9px rgba(0,0,0,0.119)
- Hover lift: transition from Low → Mid (cards gain depth on hover)
- Active press: reduce current level to 60% of its values
- Focus indicators use outline or box-shadow as defined in Focus Indicator Strategy (§1). These are accessibility markers, NOT decorative elevation — always permitted regardless of flat/shadow setting.

### Borders
- Width: 1px | Style: solid
- Color (dark): rgba(255,255,255,0.08) | Color (light): rgba(255,255,255,0.08)
- Component mapping:
  - Cards / Panels: NO border — use elevation or background contrast for separation
  - Inputs (default): 1px solid, 8% opacity
  - Inputs (focus): border color changes to primary + focus ring as defined in Focus Indicator Strategy (§1)
  - Outlined / secondary buttons: 1px solid, 8% opacity
- Dividers (section breaks): 1px solid, 3% opacity — lighter than component borders
- Separators (within components): 1px solid, 6% opacity
- Border opacity scale (all formally defined tokens):
  - Base: 0.08 (8%) — default state
  - Divider: 0.04 (4%) — section breaks, lighter than components
  - Hover: 0.12 (12%) — interactive hover state
  - Focus: 0.16 (16%) — interactive focus state
- Pre-computed border color tokens (dark theme — use these directly in code):
  - border-base: rgba(255,255,255,0.08)
  - border-divider: rgba(255,255,255,0.04)
  - border-hover: rgba(255,255,255,0.12)
  - border-focus: rgba(255,255,255,0.16)
- Interactive: on hover use border-hover, on focus use border-focus from the tokens above.

### Card Anatomy
- Outer radius: 12px
- Card padding: 18px
- Inner radius: 0px — formula: outer(12) − padding(18) = inner(0). Always apply this relationship.
- Content gap: 18px between elements
- Text inset: additional 4px uniform padding around content zones (all sides). Total text padding from card edge: 22px. Use when aggressive radius needs extra breathing room for text.
- Image aspect-ratio: 4/3 — use CSS aspect-ratio property directly, not padding hacks
- Image fit: object-fit: cover (crop to fill, no empty space)
- Content alignment: text-align left, flex items align-items flex-start
- Vertical content alignment: center (vertically centered)
- Actions: aligned left
- CTA button radius: 9999px (pill)

#### Card Layouts (5 active: Cover, Top image, Horizontal, Text only, Profile):
- Cover: image fills entire card. Content overlay at bottom with gradient scrim (linear-gradient transparent → rgba(0,0,0,0.6)). White text for contrast. overflow:hidden. Use for hero cards, featured content, media galleries.
- Top image: image flush to top/side edges, no padding. overflow:hidden clips to outer radius. Content padded below. Standard blog/product card.
- Horizontal: 18px padding. Image left at ~38% width, aspect-ratio 3/4. Content right. Inner radius 0px. Best for lists, search results, compact layouts.
- Text only: no image. 18px padding. Title, body text, optional action row. Use for content summaries, announcements, simple info blocks.
- Profile: centered layout. Circular avatar (48–64px), name, role/subtitle, optional social/contact icon row. 18px padding. Use for team pages, user lists, author bios.

#### Contextual Card Mapping (Social Platform):
The following cards should be understood in context — they are not generic containers but specific UI patterns for this webapp:

- **Cover** → story or featured post — full-bleed media with text overlay. For stories, highlights, featured content
- **Top image** → post card — media content on top, engagement actions below. The primary feed unit
- **Horizontal** → notification or message preview — avatar left, message content right
- **Text only** → text post — status update, thought, or discussion without media. Title is username
- **Profile** → user card — avatar, name, bio, follow button. For suggestions, followers lists, search results

#### Composition Guidance:
- Rich palette: 5 card types. Establish clear hierarchy — designate 1-2 types as the dominant grid pattern, others for specialized sections. Never mix all 5 types in a single view.

#### Absence Analysis:
- No dedicated CTA or pricing cards. Conversion actions should be inline — buttons within content cards, sticky nav CTAs, or section-level call-to-actions rather than standalone card-based prompts.
- No list items. For dense content (search results, logs, archives), adapt the horizontal card or use direct table/row patterns with the same spacing tokens.

#### Pattern Recognition:
- **Social feed**: profile cards for user discovery, top-image cards for media posts, text cards for status updates. Interleave in a single-column feed.
- Visual-first: image cards dominate. Prioritize large, high-quality imagery. Text should support images, not compete.
- Social proof present: place testimonials/profiles strategically near conversion points, not clustered together.

## 4. Layout & Spacing

### Grid: 12 columns, 18px gutter, 36px margin
- CSS: display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px
- Rows: content-driven (auto) — row heights determined by content, vertical spacing controlled by gap and margin tokens.
- Container: max-width 1280px, margin 0 auto, padding 0 36px
- Responsive breakpoints:
  - xs (base): 1 columns, 9px gutter, 18px margin
  - sm (≥640px): 2 columns, 12px gutter, 18px margin
  - md (≥768px): 6 columns, 18px gutter, 36px margin
  - lg (≥1024px): 8 columns, 18px gutter, 36px margin
  - xl (≥1280px): 12 columns, 18px gutter, 36px margin
  - 2xl (≥1536px): 12 columns, 18px gutter, 36px margin
- Content area: 1208px max
- Sidebar pattern: content occupies ~8/12 cols, sidebar ~4/12 cols on lg+

### Spacing (density: comfortable, base: 24px)
Scale: 4xs:3px | 3xs:6px | 2xs:9px | xs:12px | sm:18px | md:24px | lg:36px | xl:48px | 2xl:72px | 3xl:96px | 4xl:144px
Baseline grid: 8px — all line-heights (computed px), paddings, margins, and gaps must be multiples of 8px. This creates consistent vertical rhythm across the entire UI.
Use only these values for layout margin, padding, and gap. Values in Component Sizing (heights, internal padding) and Focus Dimension Tokens are declared independently in their respective sections.

### Component Sizing
- Button height: 48px (sm: 36px, lg: 60px)
- Input height: 48px, horizontal padding 14px
- Icon: 16px sm, 20px default, 24px lg
- Avatar: 32px sm, 40px md, 48px lg
- Touch target minimum: 44×44px
- Modal max-width: 480px

## 5. Motion (Balanced)

### Timing Tokens
| Role | Duration | Easing |
|------|----------|--------|
| Micro (hover, focus, press) | 100ms | cubic-bezier(0,.9,.1,1) |
| Base (dropdown, tooltip, toggle) | 200ms | cubic-bezier(0,0,.2,1) |
| Medium (modal, drawer, panel) | 300ms | cubic-bezier(0,0,.2,1) |
| Large (page, hero, onboarding) | 500ms | cubic-bezier(0,0,.2,1) |

### Easing by Intent
- Enter: cubic-bezier(0,0,.2,1) | Exit: cubic-bezier(.4,0,1,1) | Move: cubic-bezier(.4,0,.2,1) | Micro: cubic-bezier(0,.9,.1,1)

### Exit Durations (pre-computed: enter × 0.6)
- Press: 60ms | Dropdown exit: 120ms | Modal exit: 180ms | Toast exit: 100ms

### Transitions (apply these exactly)
- Hover: all 100ms cubic-bezier(0,.9,.1,1)
- Press: scale(0.97) 60ms cubic-bezier(0,.9,.1,1)
- Dropdown: translateY(-4px→0) + opacity 200ms enter / 120ms exit
- Modal: scale(0.92→1) + translateY(8px→0) 300ms enter / 180ms exit
- Page enter: translateY(12px→0) + opacity 500ms, children stagger 30ms
- Scroll reveal: IntersectionObserver, translateY(20px→0) + opacity, once
- Card hover: translateY(-1px) + shadow lift. Card active: scale(0.99)

### Stagger: 30ms per child, pattern: cascade
- @media (prefers-reduced-motion: reduce): disable all animation

### Implementation Note
- Inline style objects for ALL styling. <style> tag ONLY for @import, @keyframes, @media.
- Stagger via transitionDelay: `${index * 30}ms`

## 6. Visual Direction

**Scandinavian**: Deep navy backgrounds with bold red and orange accents. Generous padding. Rounded corners. Soft diffused shadows. Line-weight icons. Calm, breathable layouts. Cool blue undertones with warm accent pops.

## 7. Component Specifications

### Buttons
**Primary button**
- background: #E8432A
- color: #ffffff
- border-radius: 6px
- height: 48px
- padding: 0 24px
- font-weight: 500
- border: none

**Secondary button**
- background: transparent
- color: #E8432A
- border: 1px solid #E8432A

**Ghost button**
- background: transparent
- border: none
- color: #E8432A

**Button states**
- Hover: background #d03a23, transition 100ms cubic-bezier(0,.9,.1,1)
- Active: background #b8321d, transform scale(0.98)
- Disabled: opacity 0.4, pointer-events none
- Focus: outline 2px solid #2E7EA6, outline-offset 2px
- Ghost hover: background rgba(232, 67, 42, 0.08)

### Cards
**Default state**
- background: #153a50
- border-radius: 12px
- padding: 18px
- box-shadow: 0 1px 3px -1px rgba(0,0,0,0.059),0 3px 8px -1px rgba(0,0,0,0.047)

**Hover state**
- box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1),0 8px 24px -4px rgba(0,0,0,0.08)
- transform: translateY(-1px)
- transition: all 100ms cubic-bezier(0,.9,.1,1)

**Active state**
- transform: scale(0.99)

### Inputs
**Default state**
- height: 48px
- border-radius: 6px
- padding: 0 14px
- background: transparent
- border: 1px solid rgba(255,255,255,0.08)

**Focus state**
- border: 1px solid #E8432A
- box-shadow: 0 0 0 2px rgba(232, 67, 42, 0.2)

**Error state**
- border: 1px solid #EF4444

**Disabled state**
- background: #1d4a64
- opacity: 0.4

### Modals
**Backdrop**
- background: rgba(0,0,0,0.6), backdrop-filter: blur(4px)

**Panel**
- background: #153a50
- border-radius: 18px
- box-shadow: 0 4px 18px -4px rgba(0,0,0,0.148),0 18px 53px -9px rgba(0,0,0,0.119)
- max-width: 480px
- padding: 36px

### Dropdowns / Popovers
- background: #1d4a64
- border-radius: 3px
- box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1),0 8px 24px -4px rgba(0,0,0,0.08)
- border: 1px solid rgba(255,255,255,0.08)
- offset: 10px from trigger
- enter animation: scale(0.95) → scale(1), opacity 0 → 1, duration 200ms, easing cubic-bezier(0,0,.2,1)

### Tooltips
- background: #255a78
- border-radius: 3px
- padding: 6px 12px
- font-size: 12px
- enter animation: fade, duration 100ms, easing cubic-bezier(0,.9,.1,1)

### Toast / Snackbar
- position: fixed, bottom-right, 24px from edges
- background: #1d4a64
- border-radius: 6px
- box-shadow: 0 2px 8px -2px rgba(0,0,0,0.1),0 8px 24px -4px rgba(0,0,0,0.08)
- auto-dismiss: 5s
- enter: slide-up + fade, duration 200ms, easing cubic-bezier(0,0,.2,1)
- exit: fade, duration 100ms, easing cubic-bezier(.4,0,1,1)
- stack: up to 3 visible, gap 12px

## 8. Accessibility

- WCAG AA contrast (4.5:1 body, 3:1 large). Focus: outline #2E7EA6 2px for buttons/links, box-shadow ring for inputs. Keyboard: Tab + Enter/Space. ARIA labels on icon buttons, aria-expanded on toggles, aria-live on dynamic content. Color never sole indicator.

## 9. Implementation: Claude

- Single React component, default export. All styles inline. Import only: react, recharts, lucide-react, d3, lodash, shadcn/ui. React hooks for state. No localStorage. Use recharts for all chart visualizations; use d3 only for custom calculations or layouts that recharts cannot handle.

## Claude Rules for Design System Updates

When the user requests changes to the design system:

1. Update this DESIGN_SYSTEM.md file first with the new tokens or rules.
2. Search the entire codebase for references to the old tokens and replace them with the new ones.
3. Ensure all changes maintain consistency across components.
4. If a change affects multiple files, update them all in a single operation.
5. Validate that the changes align with the Scandinavian aesthetic and other DNA principles.
6. Do not introduce new values unless explicitly defined in updated tokens.
7. For color changes, update both the hex values and any derived states (hover, active, etc.).
8. For spacing or sizing changes, ensure they remain multiples of 8px for baseline grid.
9. Test for accessibility compliance after changes, especially contrast ratios.
10. If a token cannot be applied, note it and suggest alternatives within the system.