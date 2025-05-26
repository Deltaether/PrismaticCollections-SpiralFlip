# Collection Header Global Styles

## Overview
【✓】
This file contains the global styling for the site header across all pages in the Prismatic Collections website. It provides a consistent appearance with dark background and teal accents.

## Usage
These styles are imported directly by the SiteHeaderComponent and apply to any instance of this component across the application. The stylesheet uses high-specificity selectors and targeted class combinations to ensure that styles are applied consistently.

## Key Design Elements
- Dark background (`rgba(17, 17, 17, 0.95)`)
- Teal accent color (`#00e5ff`)
- Backdrop blur for a modern glass effect
- Subtle glow effects on active elements
- Consistent font styling and spacing

## Class Modifiers
The stylesheet provides styling based on these main parent classes:
- `body.collections-page` - For collection-related pages
- `.phantasia-collection-page` - For Phantasia-related pages
- `.collections-header` - Generic class for any collection header element

## Selector Specificity
The stylesheet uses high-specificity selectors to override any conflicting styles:
- Component + element selectors (e.g., `body.collections-page .site-header`)
- Multiple class combinations (e.g., `.nav-link.active.collections-nav-link`)
- Direct child selectors (e.g., `.nav-section li.active`)

## Variables
```scss
$header-bg: rgba(17, 17, 17, 0.95); // Dark/black background
$header-accent: #00e5ff;           // Teal accent
$header-primary: #003b4f;          // Deep teal
$header-secondary: #ffd700;        // Gold 
$header-text: #e0f7ff;             // Light blue text
```

## Notes for Developers
- This is the master stylesheet for header styling
- Do not create additional header style files; modify this one instead
- When adding new components that use the header, ensure they import the SiteHeaderComponent
- Test header styling in both direct routes (`/collections`) and nested routes (`/phantasia/collections`)
- Maintain the existing color scheme unless a global design change is approved 