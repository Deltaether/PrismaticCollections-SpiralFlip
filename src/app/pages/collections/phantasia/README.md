# Phantasia Collections Module

## Header Modifications
The collections page has been modified to display only the site-header, which contains the navigation items like Home, Prismatic Collections, Experience, and Collection tabs, while hiding the main-header.

### Changes Made
- Added CSS rules to hide the main-header and other unwanted navigation bars
- Kept only the site-header and header-container elements visible
- Added comprehensive CSS that works both on initial page load (F5) and during navigation between pages
- Applied similar header hiding to both the Collections and Home components
- Used multiple techniques to ensure the header remains hidden:
  - display: none
  - height/min-height/max-height: 0
  - visibility: hidden
  - opacity: 0
  - pointer-events: none

### File Structure
- `new-collections.component.scss`: Contains styling for the collections page, including header visibility rules
- `new-collections.component.ts`: Main component logic
- `new-collections.component.html`: Template for collections display
- `home.component.scss`: Contains the same header visibility rules to ensure consistency

### Notes for Developers
- If navigation elements are not appearing correctly, check that the CSS selectors in both components are correctly targeting the elements you want to hide/show
- We're keeping only the `header.site-header` and `.header-container` elements visible
- We're hiding `header.main-header` and related elements
- Adjusted padding-top values from the original values since we now have only one header
- The CSS selectors use high specificity and !important flags to override any inline or dynamically added styles
- The solution works on both direct page loads (F5) and during navigation between pages

### How It Works
The solution uses Angular's `::ng-deep` to inject styles that apply at the application root level. This approach:
1. Targets the highest level components (app-root, body)
2. Uses multiple selectors to catch all variants of the unwanted header
3. Applies multiple hiding techniques to ensure the header stays hidden
4. Explicitly declares which headers should remain visible with high specificity

### Important Selectors
```css
// Hide unwanted headers
app-root header.main-header,
app-main-layout header.main-header,
.main-header-styles,
.main-header,
.phantasia-header,
div.main-header,
app-root app-main-layout > div > header:not(.site-header),
app-root app-home > header:not(.site-header),
header:not(.site-header):not(.header-container) {
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

// Keep these headers visible
header.site-header,
.site-header,
.header-container,
app-site-header .header-container,
div.header-container,
app-home app-site-header header.site-header {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
```

# Phantasia Project Structure

## Overview
This directory contains all the Phantasia-related components and services for the Prismatic Collections website. The Phantasia project is an interactive 3D music experience with CD cases, disc information, and other interactive elements.

## Directory Structure
【✓】

```
src/app/pages/collections/phantasia/
├── layout/                     - Layout component for Phantasia pages
├── pages/                      - Page components for the Phantasia project
│   ├── phantasia/              - Main Phantasia component (entry point)
│   ├── disc-one/               - Disc One page components
│   ├── disc-two/               - Disc Two page components
│   ├── information/            - Information page components
│   └── pv/                     - PV (promotional video) page components
├── mobile/                     - Mobile-specific components
├── services/                   - Phantasia-specific services
└── phantasia.component.ts      - Root component for the 3D experience
```

## Related Files
The Phantasia project also relies on these files located elsewhere in the codebase:

- `src/app/shared/components/site-header/*` - Shared header component
- `src/app/pages/collections-page/collection-header-global.scss` - Global header styles

## Important Notes
【✓】

1. All Phantasia-related page components should be placed in the appropriate subdirectory under `pages/`
2. The layout component (`PhantasiaLayoutComponent`) is located in the `layout/` directory
3. When adding new routes, always use the `PhantasiaLayoutComponent` as the parent to ensure consistent header and layout
4. Avoid creating additional "phantasia" directories elsewhere in the codebase

## Routing
All Phantasia routes follow these patterns:

- `/phantasia/*` - Standard routes using the PhantasiaLayoutComponent
- `/collections/phantasia` - Direct access to the Phantasia component using the PhantasiaLayoutComponent

See `src/app/app.routes.ts` and `src/routing-summary.md` for more details on the routing configuration. 