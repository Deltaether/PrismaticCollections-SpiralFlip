# Phantasia Layout Architecture

## Overview
【✓】
The Phantasia application now uses a per-page layout approach instead of a global app-wide layout. This architectural decision allows for more specific and targeted layouts for different sections of the application.

## Layout Organization

The layout components are now organized in a way that keeps them closer to the pages they serve:

```
src/app/pages/collections/phantasia/
├── layout/                      - Layout for Phantasia pages
│   ├── layout.component.ts      - Component definition
│   ├── layout.component.html    - Template
│   ├── layout.component.scss    - Styles
│   └── README.md                - Documentation
└── pages/                       - Page components
    ├── phantasia/               - Main Phantasia component
    ├── disc-one/                - Disc One page
    └── ...                      - Other pages
```

## Key Benefits

1. **Improved Organization**: Layout components are co-located with the pages they serve
2. **Better Encapsulation**: Layouts can be more specific to their section of the application
3. **Simpler Maintenance**: Changes to a section's layout don't affect other sections
4. **Reduced Dependencies**: Layouts only depend on components they actually need

## Routing Structure

The routes are now organized to directly use the PhantasiaLayoutComponent for all Phantasia-related routes:

```typescript
// Phantasia Layout routes
{
  path: 'phantasia',
  loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
  children: [
    // Child routes...
  ]
}
```

## Header Integration

The site-header component is used consistently across all pages, but is now imported directly by the specific layout components that need it, rather than being part of a global app layout.

## Guidelines for Developers

1. **Adding New Pages**: When adding new pages to the Phantasia section, add them as children of the PhantasiaLayoutComponent in the routing configuration
2. **Creating New Sections**: If creating an entirely new section, consider creating a dedicated layout component for that section
3. **Component Reuse**: Reuse shared components like site-header across different layouts
4. **Consistent Styling**: Use global styles like collection-header-global.scss for consistent appearance

## Related Files

- `src/app/app.routes.ts` - Main routing configuration
- `src/app/shared/components/site-header/site-header.component.ts` - Shared header component
- `src/app/pages/collections-page/collection-header-global.scss` - Global header styles 