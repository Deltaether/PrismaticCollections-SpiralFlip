# Site Header Component

## Overview
【✓】
The `SiteHeaderComponent` is the primary navigation header used throughout the Prismatic Collections website. It provides consistent navigation links and styling across all pages of the application.

## Implementation
【✓】
The component is implemented as a standalone Angular component with its own styling:

```typescript
@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent {
  // Component implementation
}
```

## Usage
【✓】
To use the site header in a component or layout, import and include it in the template:

```typescript
// In your component.ts file
import { SiteHeaderComponent } from '../../../../shared/components/site-header/site-header.component';

@Component({
  // ...
  imports: [RouterOutlet, SiteHeaderComponent],
  // ...
})
```

```html
<!-- In your component.html file -->
<app-site-header></app-site-header>
```

## Styling
【✓】
The site header uses a combination of:

1. **Component-specific styles**: `site-header.component.scss`
2. **Global header styles**: `collection-header-global.scss` 

Key style characteristics:
- Dark background (#111111)
- Teal accent colors for active elements
- Fixed positioning
- Responsive design for various screen sizes

## Integration with Layouts
【✓】
The site header is integrated into layouts in the following ways:

1. **PhantasiaLayoutComponent**: Directly imports and includes the site-header
2. **HomeComponent**: Directly imports and includes the site-header

This approach ensures consistent header appearance and behavior across the entire application.

## Important Notes
【✓】
1. **Single Source of Truth**: Only use this component for headers throughout the application
2. **Do Not Duplicate**: Do not create alternative header implementations
3. **Styling Classes**: The component relies on the `phantasia-collection-page` class for proper styling
4. **Style Imports**: Make sure the global collection header styles are available

## Related Files
【✓】
- `src/app/shared/components/site-header/site-header.component.ts`
- `src/app/shared/components/site-header/site-header.component.html`
- `src/app/shared/components/site-header/site-header.component.scss`
- `src/app/pages/collections-page/collection-header-global.scss`
- `src/app/pages/collections/phantasia/layout/layout.component.ts` 