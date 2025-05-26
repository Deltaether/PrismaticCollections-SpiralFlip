# Main Application Structure

## Overview
This document describes the main application structure and recent critical fixes to the bootstrap configuration.

## Related Files
- `src/main.ts` - Application bootstrap entry point
- `src/app/app.component.ts` - Root application component
- `src/app/app.config.ts` - Main application configuration
- `src/app/app.routes.ts` - Application routing configuration

## Application Architecture
The application uses Angular's standalone components architecture with proper routing.

### Proper Bootstrap Flow:
1. `main.ts` bootstraps `AppComponent`
2. `AppComponent` contains a `<router-outlet>` 
3. Router loads appropriate components based on URL
4. Home page (/) loads `HomeComponent`
5. Phantasia routes load `PhantasiaComponent` within layout

## Critical Fix - Bootstrap Issue
### Problem:
The application was incorrectly bootstrapping `PhantasiaComponent` directly in `main.ts`, which caused:
- PhantasiaComponent to always be loaded regardless of route
- Global wheel event listeners (`@HostListener('wheel')`) to prevent scrolling on all pages
- Scrolling was completely disabled throughout the application

### Solution:
Changed `main.ts` to bootstrap `AppComponent` instead:
```typescript
// Before (WRONG):
import { PhantasiaComponent } from './app/pages/collections/phantasia/phantasia.component';
bootstrapApplication(PhantasiaComponent, updatedConfig)

// After (CORRECT):
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, updatedConfig)
```

## Configuration
- Uses `app.config.ts` for main application configuration
- Includes routing, HTTP client, animations, and scroll helper service
- Router tracing enabled for debugging

## Developer Guidelines
- **ALWAYS bootstrap AppComponent, never individual page components**
- Use router-outlet for navigation between pages
- Components with global event listeners should check route conditions
- Test scrolling functionality when making changes to bootstrap or global services

## Route Structure
- `/` → HomeComponent (landing page)
- `/phantasia/*` → PhantasiaLayoutComponent → PhantasiaComponent
- `/collections` → NewCollectionsComponent
- `/mobile` → MobileViewComponent

This structure ensures proper component lifecycle and prevents interference between page-specific functionality. 