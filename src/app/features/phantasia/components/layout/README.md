# Phantasia Layout Component

## Overview
The `PhantasiaLayoutComponent` is responsible for the layout structure of the Phantasia project pages within the Prismatic Collections website. It provides a consistent structure with header, content area, and footer.

## File Structure
- **layout.component.ts** - Component definition and logic
- **layout.component.html** - Template with layout structure
- **layout.component.scss** - Styling for the layout

## Key Features
- Consistent site header (using SiteHeaderComponent)
- Content area with appropriate spacing for fixed header
- Standardized footer with navigation links
- Responsive design for various screen sizes

## Header Integration
The component imports and uses the shared `SiteHeaderComponent` to maintain a consistent header across the entire website. The header features:
- Dark background color (#111111)
- Teal accent colors for active elements
- Fixed positioning

## Style Integration
The component applies the `phantasia-collection-page` class to enable the styles from `collection-header-global.scss` to be applied, ensuring consistency with other collection pages.

## Routing Configuration
The PhantasiaLayoutComponent is used in the following route configurations:

1. Standard Phantasia routes:
   - `/phantasia/phantasia`
   - `/phantasia/collections`
   - `/phantasia/disc-one`
   - `/phantasia/disc-two`
   - `/phantasia/information`
   - `/phantasia/pv`

2. Direct access routes (for backward compatibility):
   - `/collections/phantasia`
   - `/disc-1`
   - `/disc-2`
   - `/pv`
   - `/information`

All these routes now use the PhantasiaLayoutComponent to ensure consistent header and layout.

## Special Component Handling
The PhantasiaComponent includes logic to detect whether it's being rendered within the PhantasiaLayoutComponent or directly. It uses the URL pattern to determine this and conditionally renders its own header only when not inside the PhantasiaLayout.

## Related Files
- `src/app/shared/components/site-header/site-header.component.ts` - The shared header component
- `src/app/pages/collections-page/collection-header-global.scss` - Global header styles
- `src/app/app.routes.ts` - Routing configuration for all Phantasia routes

## Notes for Developers
- The layout component is now located within the collections/phantasia directory for better organization
- Per-page layout approach is used rather than a global app-wide layout
- The header is fixed, so the content area has additional top padding to prevent overlap
- If changing header height, update the `$header-height` variable in the SCSS file
- The class `phantasia-collection-page` is crucial for ensuring style consistency
- When creating new Phantasia-related pages, make sure they're added as children of the PhantasiaLayoutComponent in the routing configuration 