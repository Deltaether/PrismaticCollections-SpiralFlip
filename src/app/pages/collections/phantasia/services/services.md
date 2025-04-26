# Phantasia Services

This folder contains services used by the Phantasia album components.

## Files in this folder

| File | Description |
|------|-------------|
| `audio.service.ts` | Service for handling audio playback throughout the Phantasia experience |

## Audio Service

The `AudioService` provides centralized audio playback functionality for the Phantasia album experience. It manages:

- Track selection based on current section
- Play/pause functionality
- Volume control
- Progress tracking
- Audio state observables for components to subscribe to

### Usage

Import the service in your component:

```typescript
import { AudioService } from '../../../../services/audio.service';

@Component({...})
export class YourComponent {
  constructor(private audioService: AudioService) {}
  
  // Access audio state
  ngOnInit() {
    this.audioService.audioState$.subscribe(state => {
      // Handle audio state changes
    });
  }
  
  // Play track for current section
  playMusic() {
    this.audioService.setTrackForSection('disc-1');
  }
}
```

## Related Files

- All page components in `src/app/pages/collections/phantasia/pages/` that use audio
- Mobile components in `src/app/pages/collections/phantasia/mobile/`

## Development Notes

- When adding new sections, update the `initializeTracksMap()` method in the `AudioService`
- Ensure audio files are properly placed in `assets/audio/`
- Audio state is managed through a BehaviorSubject for reactive updates 