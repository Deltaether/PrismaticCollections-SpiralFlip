# Prismatic Collections Architecture

## Application Structure
【✓】
The Prismatic Collections website is organized into the following main directories:

```
src/
├── app/                        - Main application code
│   ├── components/             - Global/shared UI components
│   ├── pages/                  - Page components
│   │   ├── home/               - Home page
│   │   ├── collections-page/   - Collections overview
│   │   └── collections/        - Individual collections
│   │       └── phantasia/      - Phantasia project (main feature)
│   ├── shared/                 - Shared utilities and components
│   │   └── components/
│   │       └── site-header/    - Global site header
│   ├── services/               - Application services
│   └── tools/                  - Helper utilities
├── assets/                     - Static assets
└── styles/                     - Global styles
```

## Key Components

### Layout Components
【✓】
Each major section of the application has its own layout component that provides the structure for pages within that section:

- **PhantasiaLayoutComponent** (`src/app/pages/collections/phantasia/layout/layout.component.ts`)
  - Used for all Phantasia-related pages
  - Includes site header, content area, and footer
  - Sets up routes for Phantasia child components

### Header Components
【✓】
- **SiteHeaderComponent** (`src/app/shared/components/site-header/site-header.component.ts`)
  - Provides global navigation
  - Used consistently across all pages
  - Styled with `collection-header-global.scss`

## Routing Strategy
【✓】
The application uses a section-based routing approach:

1. **Main Routes**:
   - `/` and `/home` - Home component
   - `/collections` - Collections overview

2. **Phantasia Routes**:
   - `/phantasia/*` - Routes using PhantasiaLayoutComponent
   - `/collections/phantasia` - Direct access to Phantasia
   - `/disc-1`, `/disc-2`, etc. - Direct access to specific sections

3. **Mobile Routes**:
   - `/mobile` - Mobile-specific interface with named outlets

See `src/routing-summary.md` for detailed routing configuration.

## Styling Approach
【✓】
The application uses a combination of:

1. **Global Styles**: Base styles in `src/styles.scss`
2. **Component-Specific Styles**: Each component has its own `.scss` file
3. **Shared Style Files**: 
   - `collection-header-global.scss` - Consistent header styling

## Development Guidelines
【✓】
1. **Component Organization**:
   - Place components in appropriate directories based on their usage
   - Keep layout components close to the pages they serve
   - Use standalone Angular components with explicit imports

2. **Routing**:
   - Add new routes to the appropriate section in `app.routes.ts`
   - Follow the established pattern for each section
   - Use lazy loading with `loadComponent()` for better performance

3. **Headers**:
   - Always use the shared `SiteHeaderComponent` for headers
   - Don't create duplicate header implementations

4. **Documentation**:
   - Each major section should have a README.md file
   - Use our custom syntax (【✓】 for active methods, 【✗】 for inactive methods)
   - Keep documentation updated when making structural changes

## Related Documentation
【✓】
- `src/routing-summary.md` - Detailed routing information
- `src/app/pages/collections/phantasia/LAYOUT.md` - Phantasia layout architecture
- `src/app/pages/collections/phantasia/REORGANIZATION.md` - Recent restructuring changes 