# TaskFlow Design System - Stitch Project Reference

## 📐 Project Information

**Project ID:** 11974491654586566170  
**Project Title:** TaskFlow Productivity Platform UI/UX  
**Design System:** Kinetic Clarity  
**Source:** Google Stitch Design System

## 🎨 Design System Specifications

### Color Palette
The design system uses a sophisticated, professional color scheme optimized for high-legibility and functional signaling.

#### Primary Colors
- **Primary Indigo:** #3525CD
- **Primary Container:** #4F46E5
- **Inverse Primary:** #C3C0FF

#### Surface Colors
- **Surface:** #F9F9FF (very light gray background)
- **Surface Container Low:** #F1F3FF
- **Surface Container:** #E9EDFF
- **Surface Container High:** #E1E8FD
- **Surface Container Highest:** #DCE2F7
- **Surface Dim:** #D3DAEF
- **Surface Bright:** #F9F9FF
- **Surface Container Lowest:** #FFFFFF

#### Semantic Colors
- **Secondary:** #585F6C
- **Tertiary:** #7E3000
- **Error:** #BA1A1A
- **Error Container:** #FFDAD6

#### Text Colors
- **On Surface:** #141B2B (dark text on light backgrounds)
- **On Surface Variant:** #464555 (secondary text)
- **On Background:** #141B2B
- **On Primary:** #FFFFFF (white text on primary)

### Typography System

All typography uses **Inter** font family for a neutral, utilitarian feel.

#### Heading Styles
- **H1:** 36px, Weight 700, Line Height 1.2, Letter Spacing -0.02em
- **H2:** 30px, Weight 600, Line Height 1.3, Letter Spacing -0.01em
- **H3:** 24px, Weight 600, Line Height 1.3, Letter Spacing -0.01em

#### Body Styles
- **Body Large:** 18px, Weight 400, Line Height 1.6
- **Body Medium:** 16px, Weight 400, Line Height 1.5
- **Body Small:** 14px, Weight 400, Line Height 1.5

#### Label Styles
- **Label Medium:** 14px, Weight 500, Line Height 1, Letter Spacing 0.01em
- **Label Small:** 12px, Weight 600, Line Height 1, Letter Spacing 0.02em

### Spacing Scale

Base unit: **8px** (0.5rem in Tailwind)

```
8px × 1 = 8px   (stack-sm)
8px × 2 = 16px  (stack-md)
8px × 3 = 24px  (stack-lg)
8px × 6 = 48px  (stack-xl)
```

#### Spacing Variables
- **unit:** 8px
- **stack-xs:** 4px
- **stack-sm:** 8px
- **stack-md:** 16px
- **stack-lg:** 24px
- **stack-xl:** 48px
- **gutter:** 24px
- **margin-page:** 40px
- **container-max:** 1280px

### Border Radius

Consistently rounded for a modern, approachable feel.

```
- DEFAULT: 0.25rem (4px)
- lg:     0.5rem (8px) — standard components
- xl:     0.75rem (12px) — large containers
- full:   9999px — pills and badges
```

### Shadows

Dual-shadow approach for elevation and depth:

**Resting State:**
```
0px 4px 6px -1px rgba(0, 0, 0, 0.1)
0px 2px 4px -1px rgba(0, 0, 0, 0.06)
```

**Hover State:**
- Increase blur and Y-offset slightly to simulate movement

**Floating Elements (Modals/Dropdowns):**
- Deeper shadow with 20% opacity indigo tint

## 📊 Component Library

### Available Components (from Stitch)

1. **Navigation States**
   - Logged Out State
   - Logged In State with search and notifications

2. **Task Cards**
   - Pending State (yellow accent)
   - In Progress State (blue accent with progress bar)
   - Done State (green accent, dimmed)

3. **Status Badges**
   - Pending (amber)
   - In Progress (blue)
   - Done (emerald)

4. **Delete Button Lifecycle**
   - Default State
   - Confirmation State
   - Loading State with spinner

5. **Task Skeleton**
   - Shimmer loading animation
   - Placeholder matching task card structure

## 🎯 Design Principles

### Brand Personality
- **Efficiency:** Streamlined, focused interface
- **Reliability:** Trustworthy visual language
- **Cognitive Ease:** Reduces visual noise and complexity

### Visual Language
- **Minimalism:** Generous whitespace, restricted color palette
- **Modern Corporate:** High-quality typography, subtle depth
- **Order:** Logical placement, clear purpose

### Interaction Patterns
- **Status Clarity:** Use subtle backgrounds (10% opacity) with high-saturation text
- **Visual Hierarchy:** Contrast through weight and color, not size
- **Consistency:** Every element has a defined purpose and location

## 📦 Assets Downloaded

Two files have been downloaded from the Stitch project:

1. **stitch-components.html**
   - Complete HTML rendering of all components
   - Tailwind CSS configuration embedded
   - Material Icons included
   - Ready to view and reference

2. **stitch-screenshot.jpg**
   - Visual reference screenshot of the design system
   - Shows all components in context
   - High-resolution preview (2560x6694px)

## 🔄 Integration Notes

The TaskFlow implementation aligns with the Stitch design system:

✅ **Color System** - Indigo primary, neutral grays, status colors
✅ **Typography** - Inter font with specified scales
✅ **Spacing** - 8px base unit applied consistently
✅ **Shadows** - Ambient shadows for elevation
✅ **Borders** - Rounded corners (8px standard)
✅ **Components** - All design system components implemented

## 💡 Design System Best Practices

### When Building Components
1. Use the defined color palette only
2. Apply spacing in multiples of 8px
3. Use Inter for all typography
4. Apply consistent shadow patterns
5. Use 8px border radius for standard components

### For Dark Mode (Future)
The design system supports dark mode with:
- Inverted surface colors
- Adjusted contrast for readability
- Consistent color semantics

### For Accessibility
- High contrast ratios maintained
- Semantic color usage for status
- Sufficient touch target sizes
- Clear focus indicators

## 📚 Resources

- **Design System Documentation:** See design-md in project
- **Colors:** Named color tokens in configuration
- **Typography:** Predefined font scales
- **Spacing:** Standardized measurements
- **Components:** Ready-to-use HTML examples

## 🎨 Reference Links

- Material Design 3 Color System inspiration
- Inter font: https://fonts.google.com/specimen/Inter
- Tailwind CSS: https://tailwindcss.com

---

**Last Updated:** May 5, 2026  
**Status:** Design system fully implemented and integrated
