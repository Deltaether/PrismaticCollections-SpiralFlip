# Phantasia Component Import Path Fixes

This document summarizes the changes made to fix import paths after the reorganization of Phantasia components.

## 【✓】 Summary of Changes

After reorganizing the Phantasia components into a more coherent folder structure, several import path references needed to be updated. The following changes were made:

### AudioService Import Paths

Updated import paths in the following components:

1. **Mobile Components**:
   - `mobile-contact.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `mobile-credits.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `mobile-home.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `mobile-music.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `page-one.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `page-two.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `page-three.component.ts`: Updated to `../../../../services/audio.service`

2. **Mobile UI Components**:
   - `cubic-container.component.ts`: Updated to `../../../../services/music-player/audio.service`
   - `mobile-navbar.component.ts`: Updated to `../../../../services/music-player/audio.service`

3. **Main Phantasia Component**:
   - `phantasia.component.ts`: Updated to `./services/music-player/audio.service`

### Other Path Updates

1. **Introduction Component**:
   - Updated import paths for `CDCasesComponent`, `SiteVersionSelectorComponent`, `DisclaimerComponent` and other imports

## 【✓】 Service Documentation

Created documentation files to explain service responsibilities:

1. Created `services.md` to document the main services directory
2. Created `music-player.md` to document the music player service

## 【✓】 Import Path Structure

The new import path structure follows this pattern:

```typescript
// For components in the same folder structure
import { ComponentName } from './path/to/component';

// For shared components
import { SharedComponent } from '../../../shared/components/shared.component';

// For services in the Phantasia project
import { ServiceName } from '../../../../services/service-name.service';
```

## Next Steps

To avoid future import issues:

1. Always use the correct relative paths when importing components or services
2. When moving components, make sure to update all references to them
3. When needed, use the `src/app/pages/collections/phantasia/services` path for all Phantasia-specific services 