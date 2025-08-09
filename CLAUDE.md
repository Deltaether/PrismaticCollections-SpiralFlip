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

# DEPLOYMENT & SERVER CONFIGURATION

## Live Server Details
- **Production URL**: http://212.227.85.148/
- **Server Location**: VPS with nginx web server
- **Web Root**: `/var/www/phantasia/` (active website files)
- **Server OS**: Ubuntu with nginx/1.24.0
- **Authentication**: Angular-based login system (implemented Aug 2025)

## 🔐 AUTHENTICATION SYSTEM

### Current Implementation (August 2025)
The website now uses **Angular-based authentication** instead of nginx basic auth:

**Access Credentials:**
- **URL**: http://212.227.85.148/
- **Username**: `phantasia_dev`
- **Password**: `i1Si1SbOEkgK`

### Authentication Architecture
- **Service**: `src/app/services/auth.service.ts` - Handles login/logout and session management
- **Component**: `src/app/components/login/login.component.ts` - Login UI with credentials displayed
- **Guard**: Main app component (`app.component.ts`) shows login screen until authenticated
- **Storage**: Uses localStorage to persist authentication state
- **UI**: Beautiful login screen with gradient background and credential display

### Authentication Features
- ✅ Login form with username/password validation
- ✅ Credential information displayed on login screen
- ✅ Session persistence with localStorage
- ✅ Logout functionality with header button
- ✅ Authentication status indicator when logged in
- ✅ Automatic redirect protection for all routes

## Server Configuration

### nginx Configuration
- **Config Location**: `/etc/nginx/sites-available/default`
- **No authentication** - nginx serves files directly without basic auth
- **Angular Routing Support**: `try_files $uri $uri/ /index.html;` for SPA routing
- **Static Assets**: Proper caching headers for js/css/images/audio/3D files
- **Status**: nginx authentication REMOVED (Aug 2025) in favor of Angular auth

### File Structure on Server
```
/var/www/phantasia/               # Active website (nginx serves from here)
├── index.html                   # Main Angular entry point with auth
├── main-*.js                    # Angular application bundle
├── chunk-*.js                   # Lazy-loaded components
├── styles-*.css                 # Compiled SCSS styles
├── assets/                      # Static assets
│   ├── 3d/                     # 3D models (.glb files)
│   ├── audio/                  # Music files (.mp3)
│   └── graphic/                # Images and graphics
└── (other Angular build files)

/root/Projects/ProjectPhantasia/  # REMOVED (Aug 2025) - was duplicate
/root/browser/                   # REMOVED (Aug 2025) - was duplicate
```

### Deployment Process
1. **Build**: `pnpm run build` - Creates `dist/phantasia/` with all files
2. **Package**: `tar -czf phantasia-auth.tar.gz -C dist/phantasia .` (~600MB)
3. **Upload**: SSH upload to server as `/root/phantasia-auth.tar.gz`
4. **Deploy**: Extract to `/var/www/phantasia/` and set permissions
5. **Permissions**: `chown -R www-data:www-data /var/www/phantasia && chmod -R 755`

### SSH Access
- **Scripts**: `ssh_login.sh` (with sshpass) - configured and in .gitignore
- **Credentials**: Stored in `remote_ssh/remote` file
- **Connection**: `ssh -p 22 root@212.227.85.148` 
- **Automated Scripts**: Multiple deployment scripts available (Python-based)

## Development to Production Workflow

### Local Development
```bash
pnpm install                    # Install dependencies
pnpm start                     # Dev server on localhost:4300
pnpm run build                 # Production build
```

### Deployment to Live Server
```bash
# Automated deployment (recommended)
python3 quick_deploy.py        # Fast deployment script
# OR manual steps:
tar -czf phantasia-auth.tar.gz -C dist/phantasia .
scp phantasia-auth.tar.gz root@212.227.85.148:~/ 
ssh root@212.227.85.148 "cd /var/www/phantasia && tar -xzf ~/phantasia-auth.tar.gz"
```

### Authentication Testing
1. Visit http://212.227.85.148/
2. Should see login screen with credentials displayed
3. Enter: `phantasia_dev` / `i1Si1SbOEkgK`
4. Should access full Phantasia website
5. Logout button in top-right when authenticated

## Critical Implementation Details

### Authentication Security
- **Client-side only**: Authentication is handled in Angular, not server-side
- **Purpose**: For testing access control, not production security
- **Persistence**: localStorage maintains session across browser sessions
- **Bypass**: Technical users could bypass by manipulating localStorage
- **Suitable for**: Development/testing scenarios, not production security

### Performance Considerations
- **Bundle Size**: ~600MB deployment (includes 3D models, audio, graphics)
- **Lazy Loading**: Angular routes use lazy loading for performance
- **Static Caching**: nginx configured with 1-year cache for static assets
- **3D Assets**: Large .glb files in assets/3d/ directory

### Known Issues & Solutions
- **nginx 500 errors**: Fixed by removing nginx authentication, using Angular auth instead
- **File permissions**: Must set `www-data:www-data` ownership on server files
- **Deployment size**: Large due to 3D assets and audio files (~1GB total)
- **Redirect loops**: Avoided with proper nginx try_files configuration

## Troubleshooting Guide

### Authentication Issues
- **Can't access site**: Check if login screen appears at http://212.227.85.148/
- **Login fails**: Verify exact credentials: `phantasia_dev` / `i1Si1SbOEkgK`
- **Lost session**: Clear localStorage or use logout button and re-login

### Deployment Issues  
- **nginx 500 errors**: Check file permissions and nginx config
- **Upload failures**: Use Python deployment scripts, not manual scp
- **Large file issues**: 600MB deployment may timeout, use background deployment

### Development Issues
- **Build failures**: Ensure all imports are correct after auth system addition
- **Missing dependencies**: Run `pnpm install` after pulling changes
- **Port conflicts**: Use `ng serve --port 4300` as configured

This comprehensive documentation covers all critical aspects of the project's current state, authentication system, server configuration, and deployment processes as of August 2025.