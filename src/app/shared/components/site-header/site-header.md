# Site Header Component

## Overview
The Site Header component provides navigation between different views and collections in the Prismatic Collections application.

## Related Files
- `src/app/shared/components/site-header/site-header.component.ts` - Main header component
- `src/app/pages/collections-page/collection-header-global.scss` - Global styles for the header
- `src/app/pages/collections/phantasia/phantasia.component.ts` - Usage in Phantasia component (inline template)
- `src/app/pages/collections/phantasia/layout/layout.component.html` - Usage in layout component

## Navigation Structure
- **Home** - Landing Page
- **Circles** - Socials (formerly "Experience" - "3D Experience")
- **Gallery** - Album Info (formerly "Collection")

## Integration Notes
- The site header should be included in both mobile and desktop views
- The header requires the RouterModule to be imported for navigation to work
- The header detects active routes based on the current URL using the isActiveRoute method
- When adding the header to a component that uses an inline template (`template: ` vs `templateUrl: `), make sure to add it to the template string in the TypeScript file, not just the HTML file

## Layout & Styling
- Logo positioned aesthetically to the left with 25px padding
- Navigation items right-aligned with 35px spacing
- Dark theme background with light blue text (#e0f7ff)
- Logo height optimized to 55px for better proportion
- Responsive design hides navigation on mobile devices

## Debugging Notes
- If the header is not displaying, check that:
  1. SiteHeaderComponent is properly imported in the component's import array
  2. The <app-site-header> tag is added to the component's template
  3. If the component uses an inline template, ensure the header is added there
  4. There are no CSS issues causing the header to be hidden (check z-index values)
  5. The component's selector 'app-site-header' is correctly used

## Recent Changes
- Updated navigation text: "Experience" → "Circles", "3D Experience" → "Socials"
- Renamed "Collection" to "Gallery"
- **Fixed header container margin issue**: Removed max-width and auto margins that were causing 310.484px margin
- Improved logo positioning and header layout for better aesthetics
- Logo properly positioned 25px from left, navigation right-aligned with proper spacing
- Fixed header not showing in phantasia component by adding it to the inline template
- Important: PhantasiaComponent uses an inline template string, not the HTML file

## Developer Notes
Site Header component should be used in all main pages to ensure consistent navigation. 