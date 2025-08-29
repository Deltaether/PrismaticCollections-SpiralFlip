# Header Component

This file documents the unified header component for the Prismatic Collections website.

## Overview

The header component provides a consistent navigation bar across all pages of the Prismatic Collections website. It features:

- Orange background with SVG logo
- Navigation links for Home, Experience, and Collection sections
- Responsive design for mobile devices

## Related Files

- `src/app/components/header/header.component.ts` - Main component logic
- `src/app/components/header/header.component.html` - Component template
- `src/app/components/header/header.component.scss` - Component styles

## Usage

The header component is imported and used in the following layout components:

- `src/app/layout/main-layout/main-layout.component.ts`
- `src/app/layout/phantasia-layout/phantasia-layout.component.ts`

## Navigation

The header provides three main navigation options:

- **Home** - Navigates to the landing page (`/`)
- **Experience** - Navigates to the 3D experience page (`/phantasia/introduction`)
- **Collection** - Navigates to the album information page (`/collections`)

## Style Notes

- Orange background color: `#E37C55`
- SVG logo path: `/assets/images/prismcoll_logox.svg`
- Active states use white opacity overlays for highlighting

## Active Development

【✓】 Component is currently active and working as expected
【✓】 Navigation methods correctly route to appropriate pages
【✓】 Used across all layouts to ensure UI consistency

## Future Improvements

- Add mobile menu functionality
- Consider adding animation for active state transitions
- Evaluate accessibility improvements for navigation 