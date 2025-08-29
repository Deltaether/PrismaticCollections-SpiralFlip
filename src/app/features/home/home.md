# Home Component

## Overview
The Home component serves as the landing page for the Prismatic Collections application. It includes the site header, hero section, featured projects, about section, news updates, and call-to-action sections.

## Related Files
- `src/app/pages/home/home.component.ts` - Main home component logic
- `src/app/pages/home/home.component.html` - Home page template structure
- `src/app/pages/home/home.component.scss` - Styling with animated background
- `src/app/shared/components/site-header/site-header.component.ts` - Navigation header
- `src/app/pages/collections-page/collection-header-global.scss` - Header global styles
- `src/assets/images/featured/prism-unreadable.svg` - PS1-style unrecognized disc image

## Visual Features

### Animated Triangles Background 【✓】
- **Ultra Dense Waterfall Effect**: 50 individual triangles with staggered animation delays (0.4s to 10.9s)
- **Base-to-Peak Filling**: Triangles fill from bottom (base) upward to the peak using CSS clip-path
- **Optimal Color Transition**: Color changes at 37% of animation (below "Explore Prisms" text) from violet to Prismatic orange
- **Pure Color Transition**: Clean violet (#8b5cf6) to pure Prismatic Collections orange transition
- **Darker Grey Unfilled Areas**: Unfilled portions show as darker grey (rgba(160, 160, 160, 0.9)) for better contrast
- **Dual Animation System**: 
  - `triangleMove`: Controls vertical position (translateY)
  - `triangleFill`: Controls fill progression and color (clip-path + background + filter)
- **CSS Clip-Path Technology**: Uses polygon() clip-path for precise geometric filling
- **Fill Progression**: 0% = base line only → 37% = color change → 50% = half filled → 100% = completely filled
- **Variable Sizes**: Triangles range from 51px to 77px width, 48px to 69px height for maximum variety
- **Random Positioning**: Non-aligned lateral positioning (4.2%, 14.7%, 24.1%, etc.) for organic waterfall effect
- **Hardware Accelerated**: Pure CSS animations using clip-path, background-color and transform

### Color Scheme
- **Main Background**: Gradient mix of dark greys (#1a1a1a to #2a2a2a)
- **Triangles More Visible**: Reduced section opacity to better show animated triangles
- **Less Opaque Sections** (Full Width):
  - About/CTA: rgba(26, 40, 50, 0.4) to rgba(30, 44, 54, 0.45) - Full viewport width
  - News items: rgba(30, 44, 54, 0.35) to rgba(34, 48, 58, 0.35)
  - Card content: rgba(30, 44, 54, 0.45) to rgba(26, 40, 50, 0.4)
- **Reduced Backdrop Filters**: Lower blur values (3px-5px) for triangle visibility
- **Full Width Sections**: About and CTA sections now span full viewport width

## Header Integration
- Site header properly positioned with fixed positioning
- Header container margin issue resolved - removed max-width constraints
- Logo positioned 50px from left edge (increased margin for better aesthetics)
- Navigation right-aligned with 50px spacing and 50px right margin
- Gallery button subtitle updated to "Library"
- Z-index layering: Background (0) → Content (1) → Header (900)

## Critical Bootstrap Fix 【✓】
The application now properly bootstraps from `AppComponent` instead of `PhantasiaComponent` in `main.ts`. This ensures:
- Proper routing functionality
- Scroll behavior works correctly (no global scroll prevention)
- PhantasiaComponent only loads on its specific route
- All global event listeners are route-specific

## Performance Notes
- Background animations use CSS transforms and gradients for hardware acceleration
- No JavaScript animations - purely CSS for better performance
- Multiple animation layers for rich visual effect without heavy computation
- Background elements have `pointer-events: none` to avoid interaction issues

## Navigation Updates
- "Experience" → "Circles" 
- "3D Experience" → "Socials"
- "Collection" → "Gallery"

## Developer Notes
- **50 Individual HTML Elements**: Each triangle is a separate div for precise control (increased from 36)
- **CSS Clip-Path Triangles**: Using CSS clip-path polygon() for precise geometric shapes
- **Ultra Dense Waterfall Timing**: Animation delays from 0.4s to 10.9s create ultra-dense cascading effect
- **Base-to-Peak Fill**: ::before creates darker grey background, ::after fills from base upward
- **Optimal Color Transition**: Color changes at 37% of animation for aesthetic positioning below hero text
- **Pure Color Transition**: Direct violet to Prismatic Collections orange transition without color mixing
- **Clip-Path Animation**: polygon() keyframes control exact fill progression from base to peak
- **Variable Sizes**: 59px-77px width, 48px-69px height for maximum variety and organic effect
- **Random Positioning**: Non-aligned positioning (4.2%, 6.5%, 11.2%, etc.) for natural organic waterfall
- **Performance**: CSS-only animations with clip-path, background and transform for hardware acceleration
- **Featured Projects**: Streamlined to 2 cards - Project Phantasia CD Album (main) and mysterious "???" CD Unreadable card
- **PlayStation 1 Aesthetic**: CD Unreadable card features authentic PS1-style SVG disc image with:
  - Custom `prism-unreadable.svg` with realistic disc gradient, scratches, and PS1 error symbols
  - PS1-style scanlines overlay and subtle static noise animation
  - Monospace font (Courier New) for authentic retro feel
  - Updated description: "CD UNREADABLE - This disc appears to be corrupted ./restoration in progress..."
  - Centered grid layout for 2-card display
- **Simplified Navigation**: Single "Explore Prisms" button replaces dual button layout

## Troubleshooting
- If triangles don't appear: Check CSS animation support and z-index values
- If background interferes with content: Verify z-index layering and pointer-events settings
- If performance issues: Reduce number of animation layers or simplify gradients
- Header positioning: Ensure no max-width or margin constraints in container

## Features
- Hero section with call-to-action buttons
- Featured projects grid
- About section
- Latest news updates
- Version selection interface

## Integration Notes
- Uses the SiteHeaderComponent for navigation
- Provides navigation to collections and 3D experience
- Mobile-responsive design
- Dark theme consistent with the application

## Recent Fixes
- **Major Bootstrap Fix**: Fixed main.ts to bootstrap AppComponent instead of PhantasiaComponent
  - This was the root cause of the scrolling issue - PhantasiaComponent's wheel event listener was preventing all scrolling
  - Changed from bootstrapping PhantasiaComponent to proper AppComponent with router-outlet
- **Header Visibility**: Added dark background theme to site header for better visibility and readability
- **Critical Scroll Fix**: Fixed global overflow:hidden preventing page scrolling
  - Added body.home-page-active class management in component lifecycle
  - Override global styles.scss overflow:hidden with direct DOM style manipulation
  - Applied triple-layer override: ::ng-deep CSS + body class + direct style setting
  - Fixed scrollbar positioning with body padding-top to prevent navbar overlap
- **Top Padding**: Added proper padding-top (90px) to account for fixed header

## Technical Notes
- The application now properly uses AppComponent as the root with router-outlet
- PhantasiaComponent is only loaded when navigating to Phantasia routes
- Uses the correct app.config.ts instead of phantasia.config.ts
- The component overrides global CSS reset that prevents scrolling
- Uses ::ng-deep to apply styles at the app root level
- Header has z-index 900 to stay above other content
- Responsive design with mobile breakpoints

## Developer Notes
- **Critical**: Always bootstrap AppComponent in main.ts, not individual page components
- **Scroll Fix Implementation**: Home component uses triple-layer approach to override global overflow:hidden:
  1. Component SCSS with ::ng-deep and body.home-page-active class selectors
  2. Global styles.scss overrides for body.home-page-active
  3. Direct DOM manipulation in ngOnInit/ngOnDestroy using Renderer2
- If scrolling issues occur on other pages, check for global overflow:hidden styles in:
  - `src/styles.scss` (main global styles)
  - `src/app/styles/base/_reset.scss`
  - Component-specific SCSS files
- The PhantasiaComponent has global wheel event listeners that should only be active on Phantasia routes
- **Scroll Management**: Component cleans up scroll overrides in ngOnDestroy to prevent leakage to other pages

The site header dark theme should be consistent across all pages for optimal user experience. 