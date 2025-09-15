import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ArtistCreditService, ArtistContribution } from '../../services/artist-credit.service';
import { AudioService, AudioState } from '../../pages/collections/phantasia/services/audio.service';
import { DynamicArtistService, TrackWithArtists } from '../../pages/collections/phantasia/services/dynamic-artist.service';

/**
 * Interface for currently playing artist data with enhanced metadata
 */
export interface CurrentlyPlayingArtist extends ArtistContribution {
  readonly isMainArtist: boolean;
  readonly isFeaturedArtist: boolean;
  readonly playingContext: {
    trackId: string;
    trackTitle: string;
    startTime: number;
    currentTime: number;
  };
}

/**
 * Currently Playing Artists Service
 * 
 * Tracks which artists are currently playing based on the active track.
 * Provides real-time updates for the dynamic artist cards system.
 * Handles track timing and artist contribution mapping.
 * 
 * Features:
 * - Real-time artist detection based on current track
 * - Track timing awareness for multi-track albums
 * - Priority sorting (main artists, featured artists, collaborators)
 * - Debounced updates to prevent excessive re-renders
 * - Error handling for missing track data
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentlyPlayingArtistsService {
  private readonly currentlyPlayingArtistsSubject = new BehaviorSubject<ArtistContribution[]>([]);
  private readonly trackArtistCacheMap = new Map<string, ArtistContribution[]>();
  
  // Public observables
  readonly currentlyPlayingArtists$ = this.currentlyPlayingArtistsSubject.asObservable();
  
  // Enhanced observable with playing context
  readonly currentlyPlayingArtistsWithContext$: Observable<CurrentlyPlayingArtist[]> = 
    combineLatest([
      this.audioService.audioState$,
      this.currentlyPlayingArtists$
    ]).pipe(
      map(([audioState, artists]) => this.enhanceArtistsWithContext(audioState, artists)),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev.map(a => a.id)) === JSON.stringify(curr.map(a => a.id))
      ),
      debounceTime(100) // Prevent excessive updates
    );

  constructor(
    private artistCreditService: ArtistCreditService,
    private audioService: AudioService,
    private dynamicArtistService: DynamicArtistService
  ) {
    this.initializeService();
  }

  /**
   * Initialize the service and setup audio state monitoring
   */
  private initializeService(): void {
    // Pre-populate cache with all track artist data
    this.populateTrackArtistCache();

    // Primary: Monitor DynamicArtistService for current track changes (Phantasia 2)
    this.dynamicArtistService.currentTrack$.pipe(
      distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
      debounceTime(50)
    ).subscribe(currentTrack => {
      this.updateCurrentlyPlayingArtistsFromDynamicService(currentTrack);
    });

    // Fallback: Monitor legacy audio state changes for other sections
    this.audioService.audioState$.pipe(
      distinctUntilChanged((prev, curr) =>
        prev.currentTrack === curr.currentTrack &&
        prev.isPlaying === curr.isPlaying
      ),
      debounceTime(50)
    ).subscribe(audioState => {
      // Only use legacy service if dynamic service isn't providing a track
      this.dynamicArtistService.currentTrack$.pipe(
        map(dynamicTrack => dynamicTrack === null)
      ).subscribe(noDynamicTrack => {
        if (noDynamicTrack) {
          this.updateCurrentlyPlayingArtists(audioState);
        }
      });
    });
  }

  /**
   * Pre-populate cache with all track artist data for performance
   */
  private populateTrackArtistCache(): void {
    try {
      // Get all tracks with credits from the artist credit service
      this.artistCreditService.tracksWithCredits$.subscribe(tracks => {
        tracks.forEach(track => {
          const sortedArtists = this.sortArtistsByPriority(track.allContributions);
          this.trackArtistCacheMap.set(track.id, sortedArtists);
          
          // Also cache by track number for alternative lookup
          this.trackArtistCacheMap.set(track.trackNumber.toString(), sortedArtists);
          
          // Cache by audio file name for direct audio mapping
          if (track.audioFile) {
            const audioKey = this.extractAudioKey(track.audioFile);
            this.trackArtistCacheMap.set(audioKey, sortedArtists);
          }
        });
      });
    } catch (error) {
      console.error('[CurrentlyPlayingArtistsService] Error populating cache:', error);
    }
  }

  /**
   * Update currently playing artists from DynamicArtistService (primary method)
   */
  private updateCurrentlyPlayingArtistsFromDynamicService(currentTrack: TrackWithArtists | null): void {
    if (!currentTrack) {
      this.currentlyPlayingArtistsSubject.next([]);
      return;
    }

    // Get artists for the current track
    const artists = this.getArtistsForTrack(currentTrack.id);

    if (artists.length > 0) {
      this.currentlyPlayingArtistsSubject.next(artists);
      console.log(`[CurrentlyPlayingArtistsService] Updated artists for track "${currentTrack.title}":`,
                  artists.map(a => a.artistDisplayName));
    } else {
      // Try to get artists directly from the track data
      const trackArtists = this.getArtistsFromTrackData(currentTrack);
      this.currentlyPlayingArtistsSubject.next(trackArtists);
      console.log(`[CurrentlyPlayingArtistsService] Using direct track data for "${currentTrack.title}":`,
                  trackArtists.map(a => a.artistDisplayName));
    }
  }

  /**
   * Get artists from track data when cache lookup fails
   */
  private getArtistsFromTrackData(track: TrackWithArtists): ArtistContribution[] {
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

    // Add featured artists if available
    if (track.features && track.features.length > 0) {
      track.features.forEach((artist, index) => {
        artists.push({
          id: `${track.id}-featured-${index}`,
          artistName: artist.name,
          artistDisplayName: artist.name,
          role: 'Featured Artist' as any,
          participationType: 'featured' as any,
          percentageContribution: 50,
          color: '#4ECDC4',
          socialLinks: {}
        });
      });
    }

    return this.sortArtistsByPriority(artists);
  }

  /**
   * Update currently playing artists based on audio state (fallback method)
   */
  private updateCurrentlyPlayingArtists(audioState: AudioState): void {
    if (!audioState.isPlaying || !audioState.currentTrack) {
      this.currentlyPlayingArtistsSubject.next([]);
      return;
    }

    const artists = this.getArtistsForTrack(audioState.currentTrack);
    
    if (artists.length > 0) {
      this.currentlyPlayingArtistsSubject.next(artists);
    } else {
      // Fallback: try to map using different keys
      const fallbackArtists = this.tryFallbackArtistLookup(audioState.currentTrack);
      this.currentlyPlayingArtistsSubject.next(fallbackArtists);
    }
  }

  /**
   * Get artists for a specific track with caching
   */
  private getArtistsForTrack(trackId: string): ArtistContribution[] {
    // Direct cache lookup
    const cachedArtists = this.trackArtistCacheMap.get(trackId);
    if (cachedArtists) {
      return cachedArtists;
    }

    // Lookup via artist credit service
    const trackCredits = this.artistCreditService.getTrackCredits(trackId);
    if (trackCredits) {
      const sortedArtists = this.sortArtistsByPriority(trackCredits.allContributions);
      this.trackArtistCacheMap.set(trackId, sortedArtists); // Cache for future use
      return sortedArtists;
    }

    return [];
  }

  /**
   * Try alternative lookup methods when direct track ID fails
   */
  private tryFallbackArtistLookup(trackIdentifier: string): ArtistContribution[] {
    // Try numeric track number
    if (/^\d+$/.test(trackIdentifier)) {
      const artists = this.trackArtistCacheMap.get(trackIdentifier);
      if (artists) return artists;
    }

    // Try extracting track number from string
    const trackNumberMatch = trackIdentifier.match(/\b(\d+)\b/);
    if (trackNumberMatch) {
      const artists = this.trackArtistCacheMap.get(trackNumberMatch[1]);
      if (artists) return artists;
    }

    // Try audio file name mapping
    const audioKey = this.extractAudioKey(trackIdentifier);
    const artists = this.trackArtistCacheMap.get(audioKey);
    if (artists) return artists;

    console.warn(`[CurrentlyPlayingArtistsService] No artists found for track: ${trackIdentifier}`);
    return [];
  }

  /**
   * Sort artists by display priority for consistent ordering
   */
  private sortArtistsByPriority(artists: ArtistContribution[]): ArtistContribution[] {
    return [...artists].sort((a, b) => {
      // Priority order: Main Artist > Featured Artist > Vocalist > Producer > Others
      const priorityMap: Record<string, number> = {
        'Main Artist': 1000,
        'Featured Artist': 900,
        'Vocalist': 800,
        'Producer': 700,
        'Composer': 600,
        'Arranger': 500,
        'Instrumentalist': 400
      };
      
      const aPriority = priorityMap[a.role] || 100;
      const bPriority = priorityMap[b.role] || 100;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Secondary sort by contribution percentage
      if (a.percentageContribution !== b.percentageContribution) {
        return b.percentageContribution - a.percentageContribution;
      }
      
      // Tertiary sort by artist name
      return a.artistDisplayName.localeCompare(b.artistDisplayName);
    });
  }

  /**
   * Enhance artists with playing context information
   */
  private enhanceArtistsWithContext(
    audioState: AudioState, 
    artists: ArtistContribution[]
  ): CurrentlyPlayingArtist[] {
    if (!audioState.currentTrack) return [];
    
    const trackCredits = this.artistCreditService.getTrackCredits(audioState.currentTrack);
    
    return artists.map(artist => ({
      ...artist,
      isMainArtist: artist.role === 'Main Artist',
      isFeaturedArtist: artist.role === 'Featured Artist' || artist.role === 'Vocalist',
      playingContext: {
        trackId: audioState.currentTrack!,
        trackTitle: trackCredits?.title || 'Unknown Track',
        startTime: trackCredits?.startTime || 0,
        currentTime: audioState.currentTime
      }
    }));
  }

  /**
   * Extract key from audio file name for mapping
   */
  private extractAudioKey(audioFile: string): string {
    // Remove file extension and path
    return audioFile.replace(/\.[^/.]+$/, '')
                   .replace(/^.*[\\\/]/, '')
                   .toLowerCase();
  }

  /**
   * Get all artists who have contributed to any track
   */
  getAllContributingArtists(): ArtistContribution[] {
    const allArtists = new Map<string, ArtistContribution>();
    
    this.trackArtistCacheMap.forEach(artists => {
      artists.forEach(artist => {
        if (!allArtists.has(artist.artistName)) {
          allArtists.set(artist.artistName, artist);
        }
      });
    });
    
    return Array.from(allArtists.values())
               .sort((a, b) => a.artistDisplayName.localeCompare(b.artistDisplayName));
  }

  /**
   * Get featured artists for showcase when no track is playing
   */
  getFeaturedArtistsForShowcase(limit = 8): ArtistContribution[] {
    const allArtists = this.getAllContributingArtists();
    
    // Filter and prioritize showcase-worthy artists
    const showcaseArtists = allArtists.filter(artist => {
      return artist.role === 'Main Artist' || 
             artist.role === 'Featured Artist' ||
             artist.role === 'Vocalist' ||
             artist.percentageContribution >= 15;
    });
    
    return this.sortArtistsByPriority(showcaseArtists).slice(0, limit);
  }

  /**
   * Manually set currently playing artists (for testing or manual control)
   */
  setCurrentlyPlayingArtists(artists: ArtistContribution[]): void {
    const sortedArtists = this.sortArtistsByPriority(artists);
    this.currentlyPlayingArtistsSubject.next(sortedArtists);
  }

  /**
   * Clear currently playing artists
   */
  clearCurrentlyPlayingArtists(): void {
    this.currentlyPlayingArtistsSubject.next([]);
  }
}