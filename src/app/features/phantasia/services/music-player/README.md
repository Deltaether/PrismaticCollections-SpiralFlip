# Music Player Services

This directory contains services for managing audio playback and UI sounds in the Phantasia project.

## Services

### AudioService
- **File**: `audio.service.ts`
- **Purpose**: Main service for handling music tracks playback, loading, and management
- **Key Features**:
  - Track management
  - Playback controls (play, pause, next, previous)
  - Volume control
  - Error handling
  - Tracking playback state

### AudioHandlerService
- **File**: `audio-handler.service.ts`
- **Purpose**: Handles lower-level audio operations and error reporting
- **Key Features**:
  - Audio element initialization
  - Event listeners management
  - Error handling and reporting
  - Audio state management

### UISoundService
- **File**: `ui-sound.service.ts`
- **Purpose**: Simplified service for playing UI sound effects
- **Key Features**:
  - Play menu clicks, page turns, success, and error sounds
  - Simple interface without the complexity of full audio track management

## Integration

To use these services in components:

1. Import the required service:
   ```typescript
   import { UISoundService } from '../../../services/music-player/ui-sound.service';
   ```

2. Inject it into your component:
   ```typescript
   constructor(private readonly uiSoundService: UISoundService) {}
   ```

3. Play UI sounds when needed:
   ```typescript
   // For UI interactions
   this.uiSoundService.playUISound('menu-click');
   
   // For form submissions
   if (this.form.valid) {
     this.uiSoundService.playUISound('success');
   } else {
     this.uiSoundService.playUISound('error');
   }
   ```

## File Structure
- `audio.service.ts` - Main audio service for music playback
- `audio-handler.service.ts` - Lower-level audio handling
- `ui-sound.service.ts` - Simplified UI sound effects
- `README.md` - This documentation file 