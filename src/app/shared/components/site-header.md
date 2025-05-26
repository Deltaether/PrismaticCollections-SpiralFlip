# Site Header Component

This file documents the site-header component for the Prismatic Collections website.

## Overview

The site-header component provides the orange header bar with the SVG logo across pages of the Prismatic Collections website. It is included directly in page components rather than in layout components.

## Usage

The site-header component is included directly in the following pages:

- `src/app/pages/home/home.component.html`
- `src/app/pages/collections-page/new-collections.component.html`
- `src/app/pages/collections/phantasia/pages/introduction/introduction.component.html`

Each page component is responsible for importing and including the site-header component.

## Implementation

1. Import the component in the page component TypeScript file:
```typescript
import { SiteHeaderComponent } from '../../../shared/components/site-header/site-header.component';
```

2. Add it to the component imports:
```typescript
@Component({
  // ...
  imports: [CommonModule, RouterModule, SiteHeaderComponent],
  // ...
})
```

3. Include it in the template:
```html
<app-site-header></app-site-header>
```

## Style Notes

- The site-header uses the orange background color (#E37C55) with white text
- The SVG logo is displayed on the left side
- Navigation tabs show the current active page
- We removed the header from layout components to prevent duplicates
- We added the header to individual page components

## Fixes for Header Inconsistencies

1. Unified the header styling across all pages:
   - Ensured consistent orange background (#E37C55)
   - Fixed the CSS in site-header.component.ts
   - Removed any competing header components

2. Fixed component structure:
   - Removed header from layout components
   - Added header directly to page components
   - Eliminated duplicate headers

3. Fixed the Phantasia experience:
   - Removed app-header from phantasia.component.ts
   - Added site-header to introduction.component.html
   - Ensured consistent styling

## Active Development

【✓】 Component is implemented at the page level rather than layout level
【✓】 Used across multiple pages for consistent navigation
【✓】 Maintains orange header styling from the design
【✓】 Fixed inconsistencies between Collections and Phantasia pages

## Future Improvements

- Add mobile menu functionality
- Consider adding animations for tab transitions
- Implement better active state detection based on routes 