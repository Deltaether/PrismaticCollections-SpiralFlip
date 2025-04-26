# Music Player Service Documentation

## Overview
This folder contains the audio service for the Phantasia collection's music player functionality. The service manages audio playback, track management, and audio state across the application.

## Files in this Directory
- `audio.service.ts` - Core audio service that handles audio playback, track management, and state management

## Import References
To import the AudioService in components:
```typescript
import { AudioService } from 'src/app/pages/collections/phantasia/services/music-player/audio.service';
```

## Usage Notes
- The AudioService is used across multiple components in the Phantasia collection
- It's responsible for managing the music player functionality, including play/pause controls, track selection, and audio state
- The service contains extensive error handling for audio-related operations
- Debugging can be enabled via the constructor parameter

## Related Components
The AudioService is used by:
- Mobile components in `src/app/pages/collections/phantasia/mobile/`
- The main Phantasia component
- Music player component

## Developer Notes
- The file contains 509 lines of code and implements comprehensive audio management functionality
- Custom commenting syntax:
  - 【✓】 for active methods
  - 【✗】 for inactive methods
- When extending this service, consider creating separate files for new features rather than expanding the current file 