# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development
- `npm start` or `ng serve` - Start development server on port 4300
- `ng serve --port 4300` - Explicitly set port (configured in angular.json)
- **PACKAGE MANAGER NOTE**: instead of using npm, use pnpm

### Building
- `npm run build` or `ng build` - Build for production
- `ng build --watch --configuration development` - Build in watch mode for development

### Testing
- `npm test` or `ng test` - Run unit tests with Karma
- Tests use Jasmine framework with Karma test runner

### Angular CLI
- `ng generate component component-name` - Generate new component
- `ng generate --help` - See all available schematics

## Project Architecture

### Core Structure
This is a Prismatic Collections website featuring an Angular 20 application with a complex 3D interactive experience called "Phantasia". The project uses:

- **Angular 20** with standalone components and explicit imports
- **Three.js** for 3D graphics and WebGL rendering
- **GSAP** for animations
- **Howler.js** for audio management
- **Matter.js** for physics simulations
- **SCSS** for styling with component-specific style files

### Key Application Areas

#### 1. Main Application (`src/app/`)
- **Routes**: Consolidated routing in `app.routes.ts` with lazy loading
- **Components**: Global shared components in `components/`
- **Pages**: Main page components in `pages/`
- **Services**: Application-wide services for device detection
- **Shared**: Reusable components and utilities

#### 2. Phantasia Project (`src/app/pages/collections/phantasia/`)
The main feature - a complex 3D interactive experience with:
- **Layout Component**: `layout/layout.component.ts` - Provides consistent layout for all Phantasia pages
- **Pages**: Individual sections (disc-one, disc-two, information, pv, phantasia)
- **Mobile View**: Mobile interface with named outlets at `mobile/`
- **Services**: Audio management and navigation services
- **3D Integration**: Uses tools system for 3D functionality

#### 3. Tools System (`src/app/tools/`)
Sophisticated 3D visualization tools:
- **CD Cases**: Complex Three.js component with multiple services for animations, scene management, materials
- **Music Player**: Audio playback with UI controls
- **Right Side Menu**: Configurable menu system
- **Debug Menu**: Development tools for 3D debugging

### Routing Strategy
The application uses a section-based routing approach:
- Main routes: `/`, `/home`, `/collections`
- Phantasia routes: `/phantasia/*` with child routes
- Direct access: `/disc-1`, `/disc-2`, `/pv`, `/information`, `/collections/phantasia`
- Mobile interface: `/mobile` with named outlets (front, right, back, left, top)

### Component Architecture
- **Standalone Components**: All components use Angular 19 standalone pattern
- **Layout Pattern**: PhantasiaLayoutComponent wraps all Phantasia pages
- **Service Injection**: Heavy use of dependency injection for modular 3D services
- **Change Detection**: OnPush strategy used in performance-critical 3D components

### Styling Approach
- **Global Styles**: `src/styles.scss` with SCSS architecture
- **Component Styles**: Each component has its own `.scss` file
- **Shared Styles**: `collection-header-global.scss` for consistent headers
- **Style Structure**: Organized in `styles/` with base, components, layout, themes, utilities

### 3D Graphics System
The CD Cases component demonstrates complex Three.js integration:
- **Multiple Renderers**: WebGL, CSS2D, CSS3D renderers
- **Service Architecture**: Separate services for animations, events, materials, scene management
- **Performance**: Uses change detection strategies and zone optimization
- **Debug Tools**: Built-in debug menu for 3D development

## Development Guidelines

### Adding New Components
1. Use `ng generate component` to create new components
2. Follow the standalone component pattern with explicit imports
3. Place components in appropriate directories based on usage scope
4. Use the established service injection patterns for 3D functionality

### Working with Routing
1. Add new routes to `app.routes.ts` following the established patterns
2. Use lazy loading with `loadComponent()` for better performance
3. For Phantasia-related pages, use the PhantasiaLayoutComponent wrapper
4. Consider mobile routing requirements with named outlets

### 3D Development
1. Follow the service-based architecture in the CD Cases component
2. Use the debug menu for development and testing
3. Consider performance implications with change detection strategies
4. Leverage existing services for common 3D operations

### Styling
1. Always use SCSS, never plain CSS
2. Follow the established component-specific styling pattern
3. Use shared style files for consistency across sections
4. Maintain the existing style architecture in `styles/`

### Audio Integration
1. Use the existing AudioService in the Phantasia services
2. Follow the established patterns for Howler.js integration
3. Consider mobile compatibility for audio features

## Important Notes

### Recent Code Cleanup (2025-07-31)
- **Obsolete code moved to OBSOLETE_CODE folder** - Including duplicate mobile-view components and unused phantasia root files
- **Active routing uses only:** `src/app/app.routes.ts` - All other route configurations are obsolete
- **Mobile interface location:** `src/app/pages/collections/phantasia/mobile/` - Old mobile-view folder was duplicate

### Project Structure Status
- **Clean active codebase** - All obsolete duplicates removed
- **Single source of truth** - No duplicate components or services
- **Simplified imports** - Import paths point to active components only

## Architecture Files
- `CODEBASE_ANALYSIS.md` - Recent analysis of active vs obsolete code
- `src/ARCHITECTURE.md` - Detailed architecture documentation
- `src/routing-summary.md` - Comprehensive routing information
- `src/app/pages/collections/phantasia/LAYOUT.md` - Phantasia layout architecture
- `src/app/pages/collections/phantasia/REORGANIZATION.md` - Recent structural changes