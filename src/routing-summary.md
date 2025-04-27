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

The project now uses a consolidated routing configuration in a single file:

### Consolidated Routes (`app.routes.ts`)

The application routes have been unified and organized by layout components:

- **Main Layout Routes**:
  - `/` and `/home` - Home component
  - `/scroll-demo` - Scroll demo component
  - `/collections` - New collections component
  - `/test-home` - Test home component

- **Phantasia Layout Routes**:
  - `/phantasia` - Redirects to `/phantasia/introduction`
  - `/phantasia/introduction` - Introduction component
  - `/phantasia/collections` - Collection component
  - `/phantasia/disc-one` - Disc One component
  - `/phantasia/disc-two` - Disc Two component
  - `/phantasia/information` - Information component
  - `/phantasia/pv` - PV component

- **Direct Access Routes**:
  - `/collections/phantasia` - Introduction component
  - `/disc-1` - Disc One component
  - `/disc-2` - Disc Two component
  - `/pv` - PV component
  - `/information` - Information component

- **Mobile Layout Routes** with named outlets:
  - `/mobile` - Mobile view component with nested routes:
    - `front` outlet: MobileHomeComponent
    - `right` outlet: MobileMusicComponent
    - `back` outlet: MobileAboutComponent
    - `left` outlet: MobileContactComponent
    - `top` outlet: MobileCreditsComponent

- **Legacy Redirects** for backward compatibility:
  - `/introduction` → `/phantasia/introduction`
  - `/collection` → `/phantasia/collections`
  - `/disc-one` → `/phantasia/disc-one`
  - `/disc-two` → `/phantasia/disc-two`

## Important Changes

- The previously separate routing configurations have been consolidated into a single file
- Both `phantasia.routes.ts` and `app.routes.ts` were merged to eliminate conflicts
- The `phantasia.config.ts` file now references the consolidated routes from `app.routes.ts`
- This resolves navigation errors related to routes like `/collections` that were causing conflicts

## PhantasiaComponent Structure

The `PhantasiaComponent` is a complex component that:
- Conditionally displays content based on the current route
- Handles loading states, disclaimer acknowledgment, and version selection
- Adapts to mobile/desktop views
- Controls the 3D experience of the application

## Related Files

- `src/main.ts` - Application bootstrap
- `src/app/app.routes.ts` - Consolidated application routes
- `src/app/pages/collections/phantasia/phantasia.config.ts` - Phantasia application configuration (now using consolidated routes)
- `src/app/pages/collections/phantasia/phantasia.component.ts` - Main Phantasia component 