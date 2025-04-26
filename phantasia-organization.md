# Phantasia Project Organization Documentation

This document explains the organizational structure of the Project Phantasia components.

## 【✓】 Project Reorganization

The Project Phantasia components were reorganized to maintain a clean, organized structure where all Phantasia album-related components are located in the same directory tree.

### Directory Structure

All Phantasia-related components are now organized under:
```
src/app/pages/collections/phantasia/
```

The main structure is as follows:

```
phantasia/
├── pages/
│   ├── collection/     - Collections display page
│   ├── introduction/   - Album introduction page
│   ├── disc-one/       - Disc One page
│   ├── disc-two/       - Disc Two page
│   ├── information/    - Album information page
│   └── pv/             - Promotional video page
├── services/
│   └── music-player/   - Music player service
├── mobile/
│   ├── pages/          - Mobile-specific pages
│   └── components/     - Mobile-specific components
└── phantasia-project/  - Other Phantasia-specific components
```

### Reorganization Process

The reorganization was performed using the `organize_phantasia_components.sh` script, which:

1. Identified Phantasia components located outside the main folder
2. Created backups of all moved components for safety
3. Moved components from `src/app/pages/` to `src/app/pages/collections/phantasia/pages/`
4. Handled potential conflicts by renaming existing duplicate components

### Redirects and Route Structure

For backward compatibility, redirects were maintained in `app.routes.ts` to ensure existing URLs continue to work.

## 【✓】 Component Organization Guidelines

To maintain this organization, follow these guidelines:

1. **All Phantasia components must be located under the main Phantasia folder**
   - Place page components in `phantasia/pages/`
   - Place services in `phantasia/services/`
   - Place mobile components in `phantasia/mobile/`

2. **Use proper naming conventions**
   - Use descriptive, specific names for components
   - Follow Angular naming conventions
   - Maintain consistency in file naming

3. **Document component relationships**
   - Use detailed comments in component files
   - Include our standard comment syntax (【✓】 for active methods, 【✗】 for inactive)
   - Reference related components when needed

## Paths and Imports

When importing Phantasia components, use the proper import paths:

```typescript
// Correct import path for Phantasia components
import { IntroductionComponent } from './pages/collections/phantasia/pages/introduction/introduction.component';
```

## Notes for Future Development

- When creating new Phantasia-related components, always place them in the appropriate subfolder
- If further refactoring is needed, consider creating a dedicated Phantasia module
- Document any changes to the organizational structure in this file 