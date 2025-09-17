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

  // 【✓】 Enhanced subscription management to prevent leaks
  private readonly subscriptions: { [key: string]: any } = {};
  private readonly stateUpdateQueue: Array<() => void> = [];
  private isProcessingQueue = false;

  constructor(
    private dynamicArtistService: DynamicArtistService,
    private audioService: AudioService,
    private artistCreditService: ArtistCreditService
  ) {
    this.initializeService();
  }

  ngOnDestroy(): void {
    try {
      // 【✓】 Enhanced cleanup with subscription tracking
      console.log('[MusicStateManager] Starting cleanup...');

      // Cancel any pending state updates
      this.stateUpdateQueue.length = 0;
      this.isProcessingQueue = false;

      // Explicitly unsubscribe from tracked subscriptions
      Object.keys(this.subscriptions).forEach(key => {
        try {
          if (this.subscriptions[key] && typeof this.subscriptions[key].unsubscribe === 'function') {
            this.subscriptions[key].unsubscribe();
          }
        } catch (error) {
          console.error(`[MusicStateManager] Error unsubscribing from ${key}:`, error);
        }
      });

      // Signal destruction to all subscriptions
      this.destroy$.next();
      this.destroy$.complete();

      console.log('[MusicStateManager] Cleanup completed');
    } catch (error) {
      console.error('[MusicStateManager] Error during cleanup:', error);
    }
  }

  /**
   * 【✓】 Enhanced service initialization with proper subscription management
   */
  private initializeService(): void {
    try {
      console.log('[MusicStateManager] Initializing service...');

      // Initialize with all artists for showcase mode
      this.loadAllArtistsForShowcase();

      // 【✓】 Primary: Monitor DynamicArtistService for Phantasia 2 track changes with error handling
      this.subscriptions['currentTrack'] = this.dynamicArtistService.currentTrack$.pipe(
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (currentTrack) => this.queueStateUpdate(() => this.handleTrackChange(currentTrack, 'phantasia2')),
        error: (error) => console.error('[MusicStateManager] Error in currentTrack subscription:', error)
      });

      // 【✓】 Monitor current time updates with throttling and error handling
      this.subscriptions['currentTime'] = this.dynamicArtistService.currentTime$.pipe(
        debounceTime(50), // Faster response, better throttling
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (currentTime) => this.queueStateUpdate(() => this.updateCurrentTime(currentTime)),
        error: (error) => console.error('[MusicStateManager] Error in currentTime subscription:', error)
      });

      // 【✓】 Fallback: Monitor legacy AudioService with enhanced error handling
      this.subscriptions['audioState'] = this.audioService.audioState$.pipe(
        distinctUntilChanged((prev, curr) =>
          prev.currentTrack === curr.currentTrack &&
          prev.isPlaying === curr.isPlaying
        ),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (audioState) => {
          // Only use if no Phantasia 2 track is active
          const currentMusicState = this.musicStateSubject.value;
          if (!currentMusicState.currentTrack || currentMusicState.playbackMode !== 'phantasia2') {
            this.queueStateUpdate(() => this.handleAudioStateChange(audioState));
          }
        },
        error: (error) => console.error('[MusicStateManager] Error in audioState subscription:', error)
      });

      // 【✓】 Monitor artist credits with error handling
      this.subscriptions['trackCredits'] = this.artistCreditService.currentTrackCredits$.pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (trackCredits) => this.queueStateUpdate(() => this.updateTrackCredits(trackCredits)),
        error: (error) => console.error('[MusicStateManager] Error in trackCredits subscription:', error)
      });

      console.log('[MusicStateManager] Service initialized with enhanced error handling');
    } catch (error) {
      console.error('[MusicStateManager] Error during initialization:', error);
    }
  }

  /**
   * 【✓】 Enhanced track change handling with error recovery
   */
  private handleTrackChange(track: TrackWithArtists | null, mode: 'phantasia2' | 'legacy'): void {
    try {
      const currentState = this.musicStateSubject.value;

      // 【✓】 Prevent unnecessary updates if track hasn't actually changed
      if (track && currentState.currentTrack?.id === track.id) {
        console.log(`[MusicStateManager] Track ${track.id} already active, skipping update`);
        return;
      }

      if (track) {
        // Get complete credits for the track with error handling
        let trackCredits: any = null;
        try {
          trackCredits = this.artistCreditService.getTrackCredits(track.id);
        } catch (error) {
          console.warn(`[MusicStateManager] Could not get credits for track ${track.id}:`, error);
        }

        // Extract artists from track with fallback
        const trackArtists = this.extractArtistsFromTrack(track, trackCredits);

        // 【✓】 Update music state with validation
        const newMusicState: MusicState = {
          ...currentState,
          currentTrack: track,
          currentTrackCredits: trackCredits,
          playbackMode: mode
        };

        // Validate state before updating
        if (this.validateMusicState(newMusicState)) {
          this.musicStateSubject.next(newMusicState);
        } else {
          console.error('[MusicStateManager] Invalid music state, skipping update');
          return;
        }

        // 【✓】 Update artist filtering state with validation
        const allArtists = this.artistFilteringStateSubject.value.allArtists;
        const newFilteringState: ArtistFilteringState = {
          mode: 'music-playing',
          currentArtists: trackArtists,
          allArtists,
          displayTitle: 'Currently Playing Artists',
          displaySubtitle: `Artists for "${track.title}" - ${trackArtists.length} artists are currently featured`
        };

        if (this.validateArtistFilteringState(newFilteringState)) {
          this.artistFilteringStateSubject.next(newFilteringState);
        }

        console.log(`[MusicStateManager] Track changed to: "${track.title}" with ${trackArtists.length} artists`);
      } else {
        // No track playing - switch to no-music mode
        this.switchToNoMusicMode();
      }
    } catch (error) {
      console.error('[MusicStateManager] Error handling track change:', error);
      // Attempt recovery by switching to no-music mode
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
   * 【✓】 Enhanced debug information with comprehensive state tracking
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
        duration: musicState.duration,
        volume: musicState.volume,
        trackProgress: musicState.trackProgress
      },
      filteringState: {
        mode: filteringState.mode,
        currentArtistsCount: filteringState.currentArtists.length,
        allArtistsCount: filteringState.allArtists.length,
        displayTitle: filteringState.displayTitle,
        displaySubtitle: filteringState.displaySubtitle
      },
      subscriptions: {
        activeSubscriptions: Object.keys(this.subscriptions).length,
        subscriptionKeys: Object.keys(this.subscriptions)
      },
      stateQueue: {
        queueLength: this.stateUpdateQueue.length,
        isProcessing: this.isProcessingQueue
      }
    };
  }

  // 【✓】 Enhanced helper methods for state management

  /**
   * Queue state updates to prevent race conditions
   */
  private queueStateUpdate(updateFn: () => void): void {
    this.stateUpdateQueue.push(updateFn);
    this.processStateQueue();
  }

  /**
   * Process queued state updates sequentially
   */
  private async processStateQueue(): Promise<void> {
    if (this.isProcessingQueue || this.stateUpdateQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      while (this.stateUpdateQueue.length > 0) {
        const updateFn = this.stateUpdateQueue.shift();
        if (updateFn) {
          try {
            updateFn();
          } catch (error) {
            console.error('[MusicStateManager] Error processing state update:', error);
          }
          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Validate music state before updating
   */
  private validateMusicState(state: MusicState): boolean {
    try {
      return (
        typeof state.isPlaying === 'boolean' &&
        typeof state.currentTime === 'number' &&
        typeof state.duration === 'number' &&
        typeof state.volume === 'number' &&
        typeof state.trackProgress === 'number' &&
        state.volume >= 0 &&
        state.volume <= 1 &&
        state.trackProgress >= 0 &&
        state.trackProgress <= 1 &&
        state.currentTime >= 0 &&
        state.duration >= 0
      );
    } catch (error) {
      console.error('[MusicStateManager] Error validating music state:', error);
      return false;
    }
  }

  /**
   * Validate artist filtering state before updating
   */
  private validateArtistFilteringState(state: ArtistFilteringState): boolean {
    try {
      return (
        ['no-music', 'music-playing'].includes(state.mode) &&
        Array.isArray(state.currentArtists) &&
        Array.isArray(state.allArtists) &&
        typeof state.displayTitle === 'string' &&
        typeof state.displaySubtitle === 'string'
      );
    } catch (error) {
      console.error('[MusicStateManager] Error validating artist filtering state:', error);
      return false;
    }
  }

  /**
   * Emergency reset method for state corruption
   */
  public emergencyReset(): void {
    console.warn('[MusicStateManager] Performing emergency reset');

    try {
      // Reset to safe default states
      const safeArtists = this.artistCreditService.getAllPhantasia2Artists();

      const safeMusicState: MusicState = {
        isPlaying: false,
        currentTrack: null,
        currentTrackCredits: null,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        trackProgress: 0,
        playbackMode: 'idle'
      };

      const safeFilteringState: ArtistFilteringState = {
        mode: 'no-music',
        currentArtists: [],
        allArtists: safeArtists,
        displayTitle: 'All Phantasia 2 Artists',
        displaySubtitle: `Showcasing ${safeArtists.length} of 31 artists from the album`
      };

      this.musicStateSubject.next(safeMusicState);
      this.artistFilteringStateSubject.next(safeFilteringState);

      // Clear state queue
      this.stateUpdateQueue.length = 0;
      this.isProcessingQueue = false;

      console.log('[MusicStateManager] Emergency reset completed');
    } catch (error) {
      console.error('[MusicStateManager] Error during emergency reset:', error);
    }
  }
}