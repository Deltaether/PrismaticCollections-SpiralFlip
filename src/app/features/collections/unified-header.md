# Header Implementation for Prismatic Collections

This file documents the header implementation across the Prismatic Collections website, particularly focusing on the Collections page.

## Overview

The Collections page has been moved from `pages/collections/phantasia/collection` to `src/app/pages/collections-page` as it's an independent page unrelated to the Phantasia project. For header implementation, we're using the orange header with SVG logo through the SiteHeaderComponent.

## Current Implementation

1. Using the SiteHeaderComponent:
   - Each page component includes its own instance of `<app-site-header>` when needed
   - The orange header with SVG logo is managed at the page level
   - Layout components do not include header components

2. Modified navigation paths:
   - Collections page now accessible via `/collections` route
   - Updated all navigation links to point to the correct routes

3. Removed duplicate headers:
   - Removed app-header from layout components
   - Each page is responsible for including its own header when needed

## Bug Fixes After Relocation

After moving the files, we needed to:

1. Fix header duplication issues:
   - Removed HeaderComponent from layout components
   - Kept only the SiteHeaderComponent used in specific pages

2. Update stylesheet references:
   - Changed import path in global styles.scss
   - Ensure collection-header-global.scss is properly referenced from the new location

## Related Files

### Components
- `src/app/shared/components/site-header/site-header.component.ts` - Orange header component
- `src/app/pages/home/home.component.html` - Uses site-header

### Layouts
- `src/app/layout/main-layout/main-layout.component.html` - No header (managed by pages)
- `src/app/layout/phantasia-layout/phantasia-layout.component.html` - No header (managed by pages)

### Pages
- `src/app/pages/collections-page/new-collections.component.html` - Collections page content
- `src/app/pages/collections-page/collection-header-global.scss` - Relocated stylesheet

## Routing

The collections page is now accessible via:
- Direct route: `/collections` 
- Previously was at: `/phantasia/collections`

## Active Development

【✓】 Site header component implemented at page level
【✓】 Navigation routes correctly configured
【✓】 Collections page properly relocated
【✓】 File references updated to match new structure
【✓】 Duplicate headers removed from layout components

## Known Issues

- Mobile menu functionality needs to be implemented
- Content may need additional style adjustments for consistency

## Future Work

- Consider refactoring styles to use more shared SCSS variables
- Evaluate performance of lazy-loaded components
- Add animations for page transitions
- Implement responsive menu for mobile devices 