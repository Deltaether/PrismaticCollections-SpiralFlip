import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, distinctUntilChanged, debounceTime, shareReplay } from 'rxjs/operators';
import { DynamicArtistService, TrackWithArtists } from '../pages/collections/phantasia/services/dynamic-artist.service';
import { AudioService, AudioState } from '../pages/collections/phantasia/services/audio.service';
import { ArtistCreditService, TrackWithCompleteCredits, ArtistContribution } from './artist-credit.service';

/**
 * Interface for unified music state
 */
export interface MusicState {
  readonly isPlaying: boolean;
  readonly currentTrack: TrackWithArtists | null;
  readonly currentTrackCredits: TrackWithCompleteCredits | null;
  readonly currentTime: number;
  readonly duration: number;
  readonly volume: number;
  readonly trackProgress: number; // 0-1
  readonly playbackMode: 'phantasia2' | 'legacy' | 'idle';
}

/**
 * Interface for artist filtering state
 */
export interface ArtistFilteringState {
  readonly mode: 'no-music' | 'music-playing';
  readonly currentArtists: ArtistContribution[];
  readonly allArtists: ArtistContribution[];
  readonly displayTitle: string;
  readonly displaySubtitle: string;
}

/**
 * Centralized Music State Manager Service
 *
 * Unifies all music-related state management across the application.
 * Provides a single source of truth for:
 * - Current playing track
 * - Artist filtering states
 * - Music player communication
 * - Dynamic artist updates
 *
 * This service coordinates between:
 * - DynamicArtistService (Phantasia 2 tracks)
 * - AudioService (legacy audio)
 * - ArtistCreditService (artist data)
 * - Music Player Component
 * - Dynamic Artist Cards Component
 */
@Injectable({
  providedIn: 'root'
})
export class MusicStateManagerService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Core state subjects
  private readonly musicStateSubject = new BehaviorSubject<MusicState>({
    isPlaying: false,
    currentTrack: null,
    currentTrackCredits: null,
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    trackProgress: 0,
    playbackMode: 'idle'
  });

  private readonly artistFilteringStateSubject = new BehaviorSubject<ArtistFilteringState>({
    mode: 'no-music',
    currentArtists: [],
    allArtists: [],
    displayTitle: 'All Phantasia 2 Artists',
    displaySubtitle: 'Showcasing 31 of 31 artists from the album'
  });

  // Public observables
  public readonly musicState$ = this.musicStateSubject.asObservable();
  public readonly artistFilteringState$ = this.artistFilteringStateSubject.asObservable();

  // Optimized combined observables
  public readonly currentArtistsForFiltering$: Observable<ArtistContribution[]> =
    this.artistFilteringState$.pipe(
      map(state => state.currentArtists),
      distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)),
      shareReplay(1),
      takeUntil(this.destroy$)
    );

  public readonly displayInfo$ = this.artistFilteringState$.pipe(
    map(state => ({
      title: state.displayTitle,
      subtitle: state.displaySubtitle,
      mode: state.mode
    })),
    distinctUntilChanged((prev, curr) =>
      prev.title === curr.title &&
      prev.subtitle === curr.subtitle &&
      prev.mode === curr.mode
    ),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  constructor(
    private dynamicArtistService: DynamicArtistService,
    private audioService: AudioService,
    private artistCreditService: ArtistCreditService
  ) {
    this.initializeService();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the service and setup state synchronization
   */
  private initializeService(): void {
    // Initialize with all artists for showcase mode
    this.loadAllArtistsForShowcase();

    // Primary: Monitor DynamicArtistService for Phantasia 2 track changes
    this.dynamicArtistService.currentTrack$.pipe(
      distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
      takeUntil(this.destroy$)
    ).subscribe(currentTrack => {
      this.handleTrackChange(currentTrack, 'phantasia2');
    });

    // Monitor current time updates from DynamicArtistService
    this.dynamicArtistService.currentTime$.pipe(
      debounceTime(100), // Throttle for performance
      takeUntil(this.destroy$)
    ).subscribe(currentTime => {
      this.updateCurrentTime(currentTime);
    });

    // Fallback: Monitor legacy AudioService
    this.audioService.audioState$.pipe(
      distinctUntilChanged((prev, curr) =>
        prev.currentTrack === curr.currentTrack &&
        prev.isPlaying === curr.isPlaying
      ),
      takeUntil(this.destroy$)
    ).subscribe(audioState => {
      // Only use if no Phantasia 2 track is active
      const currentMusicState = this.musicStateSubject.value;
      if (!currentMusicState.currentTrack || currentMusicState.playbackMode !== 'phantasia2') {
        this.handleAudioStateChange(audioState);
      }
    });

    // Monitor artist credits for complete track information
    this.artistCreditService.currentTrackCredits$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(trackCredits => {
      this.updateTrackCredits(trackCredits);
    });
  }

  /**
   * Handle track changes from DynamicArtistService
   */
  private handleTrackChange(track: TrackWithArtists | null, mode: 'phantasia2' | 'legacy'): void {
    const currentState = this.musicStateSubject.value;

    if (track) {
      // Get complete credits for the track
      const trackCredits = this.artistCreditService.getTrackCredits(track.id);

      // Extract artists from track
      const trackArtists = this.extractArtistsFromTrack(track, trackCredits);

      // Update music state
      const newMusicState: MusicState = {
        ...currentState,
        currentTrack: track,
        currentTrackCredits: trackCredits,
        playbackMode: mode
      };
      this.musicStateSubject.next(newMusicState);

      // Update artist filtering state to music-playing mode
      const newFilteringState: ArtistFilteringState = {
        mode: 'music-playing',
        currentArtists: trackArtists,
        allArtists: this.artistFilteringStateSubject.value.allArtists,
        displayTitle: 'Currently Playing Artists',
        displaySubtitle: `Artists for "${track.title}" - ${trackArtists.length} artists are currently featured`
      };
      this.artistFilteringStateSubject.next(newFilteringState);

      console.log(`[MusicStateManager] Track changed to: "${track.title}" with ${trackArtists.length} artists`);
    } else {
      // No track playing - switch to no-music mode
      this.switchToNoMusicMode();
    }
  }

  /**
   * Handle legacy audio state changes
   */
  private handleAudioStateChange(audioState: AudioState): void {
    const currentState = this.musicStateSubject.value;

    if (audioState.isPlaying && audioState.currentTrack) {
      // Try to get track info from legacy system
      const trackCredits = this.artistCreditService.getTrackCredits(audioState.currentTrack);

      const newMusicState: MusicState = {
        ...currentState,
        isPlaying: audioState.isPlaying,
        currentTime: audioState.currentTime,
        duration: audioState.duration,
        volume: audioState.volume,
        trackProgress: audioState.duration > 0 ? audioState.currentTime / audioState.duration : 0,
        playbackMode: 'legacy',
        currentTrackCredits: trackCredits
      };
      this.musicStateSubject.next(newMusicState);

      // Update artist filtering if we have track credits
      if (trackCredits) {
        const newFilteringState: ArtistFilteringState = {
          mode: 'music-playing',
          currentArtists: trackCredits.allContributions,
          allArtists: this.artistFilteringStateSubject.value.allArtists,
          displayTitle: 'Currently Playing Artists',
          displaySubtitle: `Artists for "${trackCredits.title}" - ${trackCredits.allContributions.length} artists are currently featured`
        };
        this.artistFilteringStateSubject.next(newFilteringState);
      }
    } else {
      // Not playing - switch to no-music mode
      this.switchToNoMusicMode();
    }
  }

  /**
   * Switch to no-music mode (showcase all artists)
   */
  private switchToNoMusicMode(): void {
    const currentState = this.musicStateSubject.value;
    const allArtists = this.artistFilteringStateSubject.value.allArtists;

    // Update music state
    const newMusicState: MusicState = {
      ...currentState,
      isPlaying: false,
      currentTrack: null,
      currentTrackCredits: null,
      playbackMode: 'idle'
    };
    this.musicStateSubject.next(newMusicState);

    // Update artist filtering state to no-music mode
    const newFilteringState: ArtistFilteringState = {
      mode: 'no-music',
      currentArtists: [],
      allArtists,
      displayTitle: 'All Phantasia 2 Artists',
      displaySubtitle: `Showcasing ${allArtists.length} of 31 artists from the album`
    };
    this.artistFilteringStateSubject.next(newFilteringState);

    console.log('[MusicStateManager] Switched to no-music mode - showing all artists');
  }

  /**
   * Update current playback time
   */
  private updateCurrentTime(currentTime: number): void {
    const currentState = this.musicStateSubject.value;

    const newMusicState: MusicState = {
      ...currentState,
      currentTime,
      trackProgress: currentState.duration > 0 ? currentTime / currentState.duration : 0
    };
    this.musicStateSubject.next(newMusicState);
  }

  /**
   * Update track credits information
   */
  private updateTrackCredits(trackCredits: TrackWithCompleteCredits | null): void {
    const currentState = this.musicStateSubject.value;

    const newMusicState: MusicState = {
      ...currentState,
      currentTrackCredits: trackCredits
    };
    this.musicStateSubject.next(newMusicState);

    // Update artist filtering if track credits are available
    if (trackCredits && currentState.currentTrack) {
      const currentFilteringState = this.artistFilteringStateSubject.value;

      const newFilteringState: ArtistFilteringState = {
        ...currentFilteringState,
        currentArtists: trackCredits.allContributions,
        displaySubtitle: `Artists for "${trackCredits.title}" - ${trackCredits.allContributions.length} artists are currently featured`
      };
      this.artistFilteringStateSubject.next(newFilteringState);
    }
  }

  /**
   * Extract artists from track and credits
   */
  private extractArtistsFromTrack(
    track: TrackWithArtists,
    trackCredits: TrackWithCompleteCredits | null
  ): ArtistContribution[] {
    if (trackCredits) {
      // Use complete credits if available
      return trackCredits.allContributions;
    }

    // Fallback: create artists from track data
    const artists: ArtistContribution[] = [];

    // Add main artist
    if (track.mainArtist) {
      artists.push({
        id: `${track.id}-main`,
        artistName: track.mainArtist,
        artistDisplayName: track.mainArtist,
        role: 'Main Artist' as any,
        participationType: 'primary' as any,
        percentageContribution: 100,
        color: '#FF6B6B',
        socialLinks: {}
      });
    }

    // Add featured artists
    track.features?.forEach((feature, index) => {
      artists.push({
        id: `${track.id}-featured-${index}`,
        artistName: feature.name,
        artistDisplayName: feature.displayName || feature.name,
        role: 'Featured Artist' as any,
        participationType: 'featured' as any,
        percentageContribution: 50,
        color: '#ffffff',
        socialLinks: feature.socialLinks
      });
    });

    // Add collaborators
    track.collaborators?.forEach((collaborator, index) => {
      artists.push({
        id: `${track.id}-collab-${index}`,
        artistName: collaborator.name,
        artistDisplayName: collaborator.displayName || collaborator.name,
        role: collaborator.role as any || 'Collaborator' as any,
        participationType: 'collaboration' as any,
        percentageContribution: 25,
        color: '#45B7D1',
        socialLinks: collaborator.socialLinks
      });
    });

    return artists;
  }

  /**
   * Load all artists for showcase mode
   */
  private loadAllArtistsForShowcase(): void {
    const allArtists = this.artistCreditService.getAllPhantasia2Artists();

    const currentFilteringState = this.artistFilteringStateSubject.value;
    const newFilteringState: ArtistFilteringState = {
      ...currentFilteringState,
      allArtists,
      displaySubtitle: `Showcasing ${allArtists.length} of 31 artists from the album`
    };
    this.artistFilteringStateSubject.next(newFilteringState);
  }

  /**
   * Public API: Force switch to no-music mode
   */
  public forceNoMusicMode(): void {
    this.switchToNoMusicMode();
  }

  /**
   * Public API: Get current music state
   */
  public getCurrentMusicState(): MusicState {
    return this.musicStateSubject.value;
  }

  /**
   * Public API: Get current artist filtering state
   */
  public getCurrentArtistFilteringState(): ArtistFilteringState {
    return this.artistFilteringStateSubject.value;
  }

  /**
   * Public API: Manually set playing state
   */
  public setPlayingState(isPlaying: boolean): void {
    const currentState = this.musicStateSubject.value;

    const newMusicState: MusicState = {
      ...currentState,
      isPlaying
    };
    this.musicStateSubject.next(newMusicState);
  }

  /**
   * Public API: Update volume
   */
  public updateVolume(volume: number): void {
    const currentState = this.musicStateSubject.value;

    const newMusicState: MusicState = {
      ...currentState,
      volume
    };
    this.musicStateSubject.next(newMusicState);
  }

  /**
   * Public API: Update duration
   */
  public updateDuration(duration: number): void {
    const currentState = this.musicStateSubject.value;

    const newMusicState: MusicState = {
      ...currentState,
      duration,
      trackProgress: currentState.currentTime > 0 ? currentState.currentTime / duration : 0
    };
    this.musicStateSubject.next(newMusicState);
  }

  /**
   * Optimized array comparison for performance
   */
  private compareArtistArrays(prev: ArtistContribution[], curr: ArtistContribution[]): boolean {
    if (prev.length !== curr.length) return false;

    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id !== curr[i].id) return false;
    }
    return true;
  }

  /**
   * Get debug information for troubleshooting
   */
  public getDebugInfo(): any {
    const musicState = this.musicStateSubject.value;
    const filteringState = this.artistFilteringStateSubject.value;

    return {
      musicState: {
        playbackMode: musicState.playbackMode,
        isPlaying: musicState.isPlaying,
        currentTrackId: musicState.currentTrack?.id,
        currentTrackTitle: musicState.currentTrack?.title,
        currentTime: musicState.currentTime,
        duration: musicState.duration
      },
      filteringState: {
        mode: filteringState.mode,
        currentArtistsCount: filteringState.currentArtists.length,
        allArtistsCount: filteringState.allArtists.length,
        displayTitle: filteringState.displayTitle
      }
    };
  }
}