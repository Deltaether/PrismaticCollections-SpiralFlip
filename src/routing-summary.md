# ProjectPhantasia Routing Summary

## Application Bootstrap Process

The application bootstrap process begins in `src/main.ts`, which:
- Imports the necessary components and configuration
- Bootstraps the `PhantasiaComponent` as the main application component
- Includes providers for animations and scroll helper services

```typescript
// src/main.ts
bootstrapApplication(PhantasiaComponent, updatedConfig)
  .catch((err) => console.error(err));
```

## Routing Configuration

The project now uses a consolidated routing configuration with a per-page layout approach:

### Consolidated Routes (`app.routes.ts`)

The application routes have been organized by sections and use per-page layouts:

- **Main Routes** (using direct component loading):
  - `/` and `/home` - Home component (includes its own header)
  - `/collections` - New collections component
  - `/test-home` - Test home component

- **Phantasia Routes** (using PhantasiaLayoutComponent):
  - `/phantasia` - Redirects to `/phantasia/phantasia`
  - `/phantasia/phantasia` - Phantasia component
  - `/phantasia/collections` - Collection component
  - `/phantasia/disc-one` - Disc One component
  - `/phantasia/disc-two` - Disc Two component
  - `/phantasia/information` - Information component
  - `/phantasia/pv` - PV component

- **Direct Access Routes**:
  - `/collections/phantasia` - Phantasia component
  - `/disc-1` - Disc One component
  - `/disc-2` - Disc Two component
  - `/pv` - PV component
  - `/information` - Information component

- **Mobile Routes**:
  - `/mobile` - Mobile view component with nested routes:
    - `front` outlet: MobileHomeComponent
    - `right` outlet: MobileMusicComponent
    - `back` outlet: MobileAboutComponent
    - `left` outlet: MobileContactComponent
    - `top` outlet: MobileCreditsComponent

- **Legacy Redirects** for backward compatibility:
  - `/introduction` → `/phantasia/phantasia`
  - `/collection` → `/phantasia/collections`
  - `/disc-one` → `/phantasia/disc-one`
  - `/disc-two` → `/phantasia/disc-two`

## Important Changes

- Moved from global app-wide layouts to section-specific layouts
- PhantasiaLayoutComponent is now located in `src/app/pages/collections/phantasia/layout/`
- Removed the global layout structure for a more targeted per-page approach
- Each section manages its own header and layout needs directly
- This resolves navigation errors and provides better organization

## PhantasiaComponent Structure

The `PhantasiaComponent` is a complex component that:
- Conditionally displays content based on the current route
- Handles loading states, disclaimer acknowledgment, and version selection
- Adapts to mobile/desktop views
- Controls the 3D experience of the application

## Related Files

- `src/main.ts` - Application bootstrap
- `src/app/app.routes.ts` - Consolidated application routes
- `src/app/pages/collections/phantasia/phantasia.config.ts` - Phantasia application configuration
- `src/app/pages/collections/phantasia/phantasia.component.ts` - Main Phantasia component
- `src/app/pages/collections/phantasia/layout/layout.component.ts` - Layout for Phantasia pages 