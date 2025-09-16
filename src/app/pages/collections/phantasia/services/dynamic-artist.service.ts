import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, distinctUntilChanged, debounceTime, shareReplay, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  ArtistCreditService,
  TrackWithCompleteCredits,
  ArtistContribution,
  ProjectType,
  ProjectMetadata,
  TrackWithCompleteCreditsMultiProject
} from '../../../../services/artist-credit.service';
import { CreditVerificationService } from '../../../../services/credit-verification.service';

/**
 * Interface for artist social media links
 */
export interface ArtistSocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  carrd?: string;
  linktr?: string;
  bandcamp?: string;
  reelcrafter?: string;
  twitch?: string;
}

/**
 * Interface for individual artist data
 */
export interface Artist {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly role: string;
  readonly socialLinks: ArtistSocialLinks;
  readonly avatar?: string;
  readonly color?: string;
}

/**
 * Interface for track with timestamp and artist data
 */
export interface TrackWithArtists {
  readonly id: string;
  readonly title: string;
  readonly mainArtist: string;
  readonly startTime: number; // in seconds
  endTime: number; // in seconds - mutable for parsing
  artists: Artist[]; // mutable for parsing
  readonly features: Artist[];
  collaborators: Artist[]; // mutable for parsing
  readonly audioFile?: string; // Path to the OGG audio file
}

/**
 * Interface for timeline segment data
 */
export interface TimelineSegment {
  readonly startTime: number;
  readonly endTime: number;
  readonly track: TrackWithArtists;
}

/**
 * Interface for artist card display data
 */
export interface ArtistCardData {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly role: string;
  readonly socialLinks: ArtistSocialLinks;
  readonly avatar?: string;
  readonly color: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicArtistService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Core observables
  private readonly currentTimeSubject = new BehaviorSubject<number>(0);
  private readonly tracksSubject = new BehaviorSubject<TrackWithArtists[]>([]);
  private readonly currentTrackSubject = new BehaviorSubject<TrackWithArtists | null>(null);

  // Multi-project support
  private readonly currentProjectSubject = new BehaviorSubject<ProjectType>('phantasia1');
  private readonly allProjectTracksSubject = new BehaviorSubject<TrackWithArtists[]>([]);

  // Public observables
  public readonly currentTime$ = this.currentTimeSubject.asObservable();
  public readonly tracks$ = this.tracksSubject.asObservable();
  public readonly currentTrack$ = this.currentTrackSubject.asObservable();

  // Multi-project observables
  public readonly currentProject$ = this.currentProjectSubject.asObservable();
  public readonly allProjectTracks$ = this.allProjectTracksSubject.asObservable();

  // Optimized artist cards observable with caching and performance improvements
  public readonly currentArtists$ = combineLatest([
    this.currentTime$,
    this.tracks$
  ]).pipe(
    debounceTime(25), // Faster response time for better user experience
    map(([time, tracks]) => this.getCurrentArtists(time, tracks)),
    distinctUntilChanged((prev, curr) => this.arraysEqual(prev, curr)),
    shareReplay(1), // Cache for multiple subscribers
    takeUntil(this.destroy$)
  );

  // Performance monitoring
  private performanceMetrics = {
    artistLookups: 0,
    cacheHits: 0,
    lastUpdateTime: 0
  };
  private readonly artistCache = new Map<string, ArtistCardData[]>();
  private readonly maxCacheEntries = 20;

  // Track-to-filename mapping for all 20 Phantasia 2 tracks - CORRECTED REAL FILENAMES
  private readonly phantasia2TrackToFilenameMap: Record<number, string> = {
    1: '1. SpiralFlip - Blinding Dawn feat. eili.ogg',
    2: '2. Ariatec - Hollow Crown.ogg',
    3: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg',
    4: '4. Azali & Aloysius - Lux Nova.ogg',
    5: '5. potatoTeto - Hall of Silent Echoes.ogg',
    6: '6. Artisan - Lirica.ogg',
    7: '7. Mei Naganowa - To Defy The Beankeeper.ogg',
    8: "8. Evin a'k - Trench.ogg", // Right single quotation mark (U+2019)
    9: '9. BilliumMoto - Blooming in the Square.ogg',
    10: '10. Elliot Hsu - Skies in Abberation.ogg',
    11: '11. Yuzuki - song of the nymphs.ogg',
    12: '12. LucaProject - Light Guardian.ogg',
    13: '13. Koway - Enso Antumbra ft. 伍.ogg',
    14: '14. Nstryder - You_re In My Way.ogg',
    15: '15. MoAE. - Remember you.ogg',
    16: '16. dystopian tanuki - Hidden passage.ogg',
    17: '17. Heem - Last Dance feat. woojinee (detune version).ogg',
    18: '18. Bigg Milk - Second Guess.ogg',
    19: '19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg',
    20: '20. Futsuunohito - Beyond the Veil of Light.ogg'
  };

  // Track-to-filename mapping for all 15 Phantasia 1 tracks - REAL FILENAMES
  private readonly phantasia1TrackToFilenameMap: Record<number, string> = {
    1: '01. SpiralFlip - Phantasia ft. Eili.ogg',
    2: '02. Bigg Milk - First Steps.ogg',
    3: '03. Heem - Altar of the Sword.ogg',
    4: '04. futsuunohito - A Voyage on the Winds of Change.ogg',
    5: '05. Prower - Rohkeutta Etsiä.ogg',
    6: '06. AZALI & Seycara  - Ivory Flowers.ogg',
    7: '07. Qyubey - Outer Bygone Ruins.ogg',
    8: '08. Luscinia - Spiral Into the Abyss!.ogg',
    9: '09. Gardens & sleepy - Wandering Breeze.ogg',
    10: '10. はがね - Mystic Nebula.ogg',
    11: '11. LucaProject - Iris.ogg',
    12: '12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg',
    13: '13. satella - The Traveller.ogg',
    14: '14. dystopian tanuki - Childhood memories.ogg'
  };

  constructor(
    private readonly http: HttpClient,
    private readonly artistCreditService: ArtistCreditService,
    private readonly creditVerificationService: CreditVerificationService
  ) {
    this.initializeService();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clear caches for memory management
    this.artistCache.clear();
    this.artistColorCache.clear();

    console.log('[DynamicArtistService] Performance metrics:', {
      totalLookups: this.performanceMetrics.artistLookups,
      cacheHits: this.performanceMetrics.cacheHits,
      cacheHitRate: this.performanceMetrics.cacheHits / Math.max(1, this.performanceMetrics.artistLookups)
    });
  }

  /**
   * Cache management with LRU eviction
   */
  private setCacheWithEviction(key: string, artists: ArtistCardData[]): void {
    // Evict oldest entries if cache is full
    if (this.artistCache.size >= this.maxCacheEntries) {
      const firstKey = this.artistCache.keys().next().value;
      if (firstKey !== undefined) {
        this.artistCache.delete(firstKey);
      }
    }

    this.artistCache.set(key, artists);
  }

  /**
   * Get performance metrics for monitoring
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      cacheSize: this.artistCache.size,
      colorCacheSize: this.artistColorCache.size,
      cacheHitRate: this.performanceMetrics.cacheHits / Math.max(1, this.performanceMetrics.artistLookups)
    };
  }

  /**
   * Get track filename based on current project
   */
  private getTrackFilename(trackNumber: number): string {
    const currentProject = this.currentProjectSubject.value;

    if (currentProject === 'phantasia1') {
      return this.phantasia1TrackToFilenameMap[trackNumber] || `${trackNumber.toString().padStart(2, '0')}. Unknown Track.ogg`;
    } else {
      return this.phantasia2TrackToFilenameMap[trackNumber] || `${trackNumber}. Unknown Track.ogg`;
    }
  }

  /**
   * Initialize the service with track data
   */
  private initializeService(): void {
    // Load data for the current project (defaults to Phantasia 1)
    this.loadProjectData(this.currentProjectSubject.value);
  }

  /**
   * Load track data from timestamps
   */
  private loadTrackData(): void {
    const tracksData = this.createTracksFromTimestamps();
    this.tracksSubject.next(tracksData);
  }

  /**
   * Load data for specific project
   */
  private loadProjectData(projectId: ProjectType): void {
    if (projectId === 'phantasia2') {
      // Use existing Phantasia 2 data
      this.loadTrackData();
    } else if (projectId === 'phantasia1') {
      // Load Phantasia 1 data
      const phantasia1Tracks = this.createPhantasia1TracksFromData();
      this.tracksSubject.next(phantasia1Tracks);
    }
  }

  /**
   * Update current playback time
   */
  updateCurrentTime(timeInSeconds: number): void {
    this.currentTimeSubject.next(timeInSeconds);

    // Update current track based on time
    const tracks = this.tracksSubject.value;
    const currentTrack = this.findTrackByTime(timeInSeconds, tracks);
    if (currentTrack !== this.currentTrackSubject.value) {
      this.currentTrackSubject.next(currentTrack);

      // Update comprehensive credit service with current track
      if (currentTrack) {
        this.artistCreditService.updateCurrentTrack(currentTrack.id);
      }
    }
  }

  /**
   * Get comprehensive credits for current track
   */
  getCurrentTrackCompleteCredits(): Observable<TrackWithCompleteCredits | null> {
    return this.artistCreditService.currentTrackCredits$;
  }

  /**
   * Get all Phantasia 2 artists with complete information
   */
  getAllPhantasia2ArtistsComplete(): ArtistContribution[] {
    return this.artistCreditService.getAllPhantasia2Artists();
  }

  /**
   * Get verification status for current implementation
   */
  getVerificationStatus(): Observable<any> {
    return this.creditVerificationService.getDetailedVerificationReport();
  }

  /**
   * Check if current track credits are verified
   */
  isCurrentTrackVerified(): Observable<boolean> {
    return combineLatest([
      this.currentTrack$,
      this.creditVerificationService.trackVerifications$
    ]).pipe(
      map(([currentTrack, verifications]) => {
        if (!currentTrack) return false;
        const verification = verifications.find(v => v.trackId === currentTrack.id);
        return verification?.fullyVerified || false;
      })
    );
  }

  // ====== MULTI-PROJECT SUPPORT METHODS ======

  /**
   * Switch between projects and load corresponding tracks
   */
  setCurrentProject(projectId: ProjectType): void {
    this.currentProjectSubject.next(projectId);

    // Update artist credit service
    this.artistCreditService.setCurrentProject(projectId);

    // Load tracks for the selected project
    this.loadProjectData(projectId);
  }

  /**
   * Get current project metadata
   */
  getCurrentProjectMetadata(): Observable<ProjectMetadata | null> {
    return combineLatest([
      this.currentProject$,
      this.artistCreditService.projectMetadata$
    ]).pipe(
      map(([currentProject, projects]) =>
        projects.find(p => p.id === currentProject) || null
      )
    );
  }

  /**
   * Get all artists across all projects
   */
  getAllArtistsAllProjects(): ArtistContribution[] {
    return this.artistCreditService.getAllArtistsAllProjects();
  }

  /**
   * Get artists that appear in both projects
   */
  getCrossProjectArtists(): ArtistContribution[] {
    return this.artistCreditService.getCrossProjectArtists();
  }

  /**
   * Get artists for specific project
   */
  getProjectArtists(projectId: ProjectType): ArtistContribution[] {
    return this.artistCreditService.getProjectArtists(projectId);
  }

  /**
   * Get project comparison data
   */
  getProjectComparison(): Observable<{
    phantasia1: { artists: number; tracks: number; metadata: ProjectMetadata | null };
    phantasia2: { artists: number; tracks: number; metadata: ProjectMetadata | null };
    crossProjectArtists: number;
    totalUniqueArtists: number;
  }> {
    return this.artistCreditService.projectMetadata$.pipe(
      map(projects => {
        const phantasia1Artists = this.getProjectArtists('phantasia1');
        const phantasia2Artists = this.getProjectArtists('phantasia2');
        const crossProjectArtists = this.getCrossProjectArtists();

        const phantasia1Metadata = projects.find(p => p.id === 'phantasia1') || null;
        const phantasia2Metadata = projects.find(p => p.id === 'phantasia2') || null;

        const allUniqueArtists = new Set([
          ...phantasia1Artists.map(a => a.artistName),
          ...phantasia2Artists.map(a => a.artistName)
        ]);

        return {
          phantasia1: {
            artists: phantasia1Artists.length,
            tracks: phantasia1Metadata?.totalTracks || 0,
            metadata: phantasia1Metadata
          },
          phantasia2: {
            artists: phantasia2Artists.length,
            tracks: phantasia2Metadata?.totalTracks || 0,
            metadata: phantasia2Metadata
          },
          crossProjectArtists: crossProjectArtists.length,
          totalUniqueArtists: allUniqueArtists.size
        };
      })
    );
  }

  /**
   * Optimized artist retrieval with caching and performance tracking
   */
  private getCurrentArtists(time: number, tracks: TrackWithArtists[]): ArtistCardData[] {
    this.performanceMetrics.artistLookups++;
    this.performanceMetrics.lastUpdateTime = Date.now();

    const currentTrack = this.findTrackByTime(time, tracks);
    if (!currentTrack) {
      return [];
    }

    // Check cache first
    const cacheKey = `${currentTrack.id}-${time.toFixed(0)}`;
    const cachedArtists = this.artistCache.get(cacheKey);
    if (cachedArtists) {
      this.performanceMetrics.cacheHits++;
      return cachedArtists;
    }

    // Create artists array with minimal allocations
    const artists: ArtistCardData[] = this.buildArtistArray(currentTrack);

    // Cache with LRU eviction
    this.setCacheWithEviction(cacheKey, artists);

    return artists;
  }

  /**
   * Build artist array with minimal object creation
   */
  private buildArtistArray(track: TrackWithArtists): ArtistCardData[] {
    const artists: ArtistCardData[] = [];

    // Pre-allocate array size for better performance
    const totalArtists = 1 + track.features.length + track.collaborators.length;
    artists.length = totalArtists;
    let index = 0;

    // Add main artist
    artists[index++] = this.createArtistCardData(track.mainArtist, 'Main Artist');

    // Add featured artists
    for (const feature of track.features) {
      artists[index++] = this.createArtistCardData(feature.name, 'Featured Artist', feature.socialLinks);
    }

    // Add collaborators
    for (const collaborator of track.collaborators) {
      artists[index++] = this.createArtistCardData(collaborator.name, 'Collaborator', collaborator.socialLinks);
    }

    // Trim array to actual size if pre-allocation was too large
    artists.length = index;
    return artists;
  }

  /**
   * Find track by time position
   */
  private findTrackByTime(time: number, tracks: TrackWithArtists[]): TrackWithArtists | null {
    return tracks.find(track => time >= track.startTime && time < track.endTime) || null;
  }

  /**
   * Create artist card data
   */
  private createArtistCardData(
    name: string,
    role: string,
    socialLinks: ArtistSocialLinks = {}
  ): ArtistCardData {
    return {
      id: this.generateArtistId(name),
      name,
      displayName: name,
      role,
      socialLinks,
      color: this.generateColorForArtist(name)
    };
  }

  /**
   * Generate artist ID from name
   */
  private generateArtistId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  // Pre-computed color map for better performance
  private readonly artistColorCache = new Map<string, string>();
  private readonly artistColors = [
    '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
    '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'
  ];

  /**
   * Optimized color generation with caching
   */
  private generateColorForArtist(artistName: string): string {
    // Check cache first
    const cachedColor = this.artistColorCache.get(artistName);
    if (cachedColor) {
      return cachedColor;
    }

    // Fast hash algorithm
    let hash = 0;
    for (let i = 0; i < artistName.length; i++) {
      hash = ((hash << 5) - hash + artistName.charCodeAt(i)) & 0xffffffff;
    }

    const color = this.artistColors[Math.abs(hash) % this.artistColors.length];

    // Cache the result
    this.artistColorCache.set(artistName, color);
    return color;
  }

  /**
   * Optimized array equality check
   */
  private arraysEqual(a: ArtistCardData[], b: ArtistCardData[]): boolean {
    if (a.length !== b.length) return false;

    // Fast loop without array methods for better performance
    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i]?.id) return false;
    }
    return true;
  }

  /**
   * Create tracks from timestamp data with improved parsing
   */
  private createTracksFromTimestamps(): TrackWithArtists[] {
    const timestampData = `0:00 SpiralFlip feat. eili: Blinding Dawn
2:48 Ariatec: Hollow Crown
5:44 MB feat. Iku Hoshifuri: 暁の姫
8:38 Azali & Aloysius: Lux Nova
11:44 potatoTeto: Hall of Silent Echoes
14:52 Artisan: Lirica
17:53 Mei Naganowa: To Defy The Beankeeper
20:45 Evin a'k: Trench
23:29 BilliumMoto: Blooming in the Square
26:37 Elliot Hsu: Skies in Abberation
29:52 Yuzuki: song of the nymphs
32:42 LucaProject: Light Guardian
35:48 Koway ft. 伍: Enso Antumbra
38:57 Nstryder: You're In My Way
42:05 MoAE.: Remember you
45:09 dystopian tanuki: Hidden passage
48:22 Heem feat. woojinee: Last Dance (detune version)
51:25 Bigg Milk: Second Guess
54:15 Gardens & Sad Keyboard Guy ft. eili: Fractured Light
57:04 Futsuunohito: Beyond the Veil of Light`;

    const tracks: TrackWithArtists[] = [];
    const lines = timestampData.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/(\d+):(\d+)\s+(.+?):\s+(.+)/);
      if (match) {
        const [, minutes, seconds, artist, title] = match;
        const startTime = parseInt(minutes) * 60 + parseInt(seconds);
        const nextLine = lines[index + 1];
        let endTime = 60 * 60; // Default 1 hour

        if (nextLine) {
          const nextMatch = nextLine.match(/(\d+):(\d+)/);
          if (nextMatch) {
            endTime = parseInt(nextMatch[1]) * 60 + parseInt(nextMatch[2]);
          }
        }

        // Parse features and collaborators with comprehensive patterns
        const features: Artist[] = [];
        const collaborators: Artist[] = [];

        // Enhanced parsing for specific tracks with additional contributors
        const trackNumber = index + 1;

        // Handle different featured artist patterns: feat., ft.
        const featPattern = /(.+?)\s+(?:feat\.|ft\.)\s+(.+)/;
        const featMatch = artist.match(featPattern);

        if (featMatch) {
          const [, mainArtist, featuredArtist] = featMatch;
          features.push({
            id: this.generateArtistId(featuredArtist),
            name: featuredArtist,
            displayName: featuredArtist,
            role: 'Featured Artist',
            socialLinks: this.getSocialLinksForArtist(featuredArtist)
          });
        }

        // Handle collaborations with & symbol
        const collabPattern = /(.+?)\s+&\s+(.+)/;
        const collabMatch = artist.match(collabPattern);

        if (collabMatch && !featMatch) {
          const [, artist1, artist2] = collabMatch;
          collaborators.push({
            id: this.generateArtistId(artist2),
            name: artist2,
            displayName: artist2,
            role: 'Collaborator',
            socialLinks: this.getSocialLinksForArtist(artist2)
          });
        }

        // Add specific track contributors based on timestamps data
        switch (trackNumber) {
          case 3: // MB - 暁の姫 (feat. Iku Hoshifuri) - Add instrumentalists
            collaborators.push(
              { id: 'justin-thornburgh', name: 'Justin Thornburgh', displayName: 'Justin Thornburgh', role: 'Accordion', socialLinks: this.getSocialLinksForArtist('Justin Thornburgh') },
              { id: 'v1ris', name: 'v1ris', displayName: 'v1ris', role: 'Violin', socialLinks: this.getSocialLinksForArtist('v1ris') },
              { id: 'rita-kamishiro', name: 'Rita Kamishiro', displayName: 'Rita Kamishiro', role: 'Viola', socialLinks: this.getSocialLinksForArtist('Rita Kamishiro') },
              { id: 'marcus-ho', name: 'Marcus Ho', displayName: 'Marcus Ho', role: 'Cello', socialLinks: this.getSocialLinksForArtist('Marcus Ho') }
            );
            break;

          case 7: // Mei Naganowa - To Defy The Beankeeper - Add vocal synthesizers info
            collaborators.push(
              { id: 'anri-arcane', name: 'Anri Arcane', displayName: 'Anri Arcane', role: 'Vocals (Synthesizer V)', socialLinks: {} },
              { id: 'hxvoc', name: 'HXVOC', displayName: 'HXVOC', role: 'Vocals (Synthesizer V)', socialLinks: {} },
              { id: 'miyamai-moca', name: 'Miyamai Moca', displayName: 'Miyamai Moca', role: 'Vocals (Synthesizer V)', socialLinks: {} },
              { id: 'ninezero', name: 'Ninezero', displayName: 'Ninezero', role: 'Vocals (Synthesizer V)', socialLinks: {} }
            );
            break;

          case 11: // Yuzuki - song of the nymphs - Add vocal synthesizer
            collaborators.push(
              { id: 'hanakuma-chifuyu', name: 'Hanakuma Chifuyu', displayName: 'Hanakuma Chifuyu', role: 'Vocals (Synthesizer V)', socialLinks: {} }
            );
            break;

          case 17: // Heem - Last Dance (feat. Woojinee) - Add violin performer
            if (!features.some(f => f.name.toLowerCase() === 'woojinee')) {
              features.push({
                id: this.generateArtistId('woojinee'),
                name: 'woojinee',
                displayName: 'Woojinee',
                role: 'Violin',
                socialLinks: this.getSocialLinksForArtist('woojinee')
              });
            }
            break;

          case 19: // Gardens & Sad Keyboard Guy - Fractured Light (feat. eili) - Add both main artists
            if (!collaborators.some(c => c.name === 'Sad Keyboard Guy')) {
              collaborators.push({
                id: this.generateArtistId('Sad Keyboard Guy'),
                name: 'Sad Keyboard Guy',
                displayName: 'Sad Keyboard Guy',
                role: 'Main Artist',
                socialLinks: this.getSocialLinksForArtist('Sad Keyboard Guy')
              });
            }
            break;

          case 20: // Futsuunohito - Beyond the Veil of Light - Add voice actor
            collaborators.push({
              id: this.generateArtistId('shishishiena'),
              name: 'shishishiena',
              displayName: 'shishishiena',
              role: 'Voice Actor',
              socialLinks: this.getSocialLinksForArtist('shishishiena')
            });
            break;
        }

        // Clean main artist name
        let cleanMainArtist = artist.replace(/\s+(?:feat\.|ft\.)\s+.+/, '');

        // Special handling for track 1 to show featured artist in main field
        let displayMainArtist = cleanMainArtist;
        if (index === 0 && features.length > 0) {
          displayMainArtist = `${cleanMainArtist} (feat. ${features[0].name})`;
        }

        tracks.push({
          id: (index + 1).toString(),
          title,
          mainArtist: displayMainArtist,
          startTime,
          endTime,
          artists: [],
          features,
          collaborators,
          audioFile: this.getTrackFilename(index + 1)
        });
      }
    });

    return tracks;
  }

  /**
   * Get social links for specific artists - Complete Phantasia 2 database
   */
  private getSocialLinksForArtist(artistName: string): ArtistSocialLinks {
    const socialLinksMap: Record<string, ArtistSocialLinks> = {
      // Track 1: SpiralFlip - Blinding Dawn (feat. eili)
      'SpiralFlip': {
        youtube: 'https://www.youtube.com/@SpiralFlip',
        carrd: 'https://spiralflip.carrd.co/'
      },
      'eili': {
        youtube: 'https://www.youtube.com/@EiliYT',
        twitter: 'https://x.com/frenlize'
      },

      // Track 2: Ariatec - Hollow Crown
      'Ariatec': {
        youtube: 'https://www.youtube.com/@musicbyariatec',
        reelcrafter: 'https://play.reelcrafter.com/KLSound/port'
      },

      // Track 3: MB - 暁の姫 (feat. Iku Hoshifuri)
      'MB': {
        youtube: 'https://www.youtube.com/@MBMichael',
        twitter: 'https://x.com/MBgov1133'
      },
      'Iku Hoshifuri': {
        youtube: 'https://www.youtube.com/@IkuHoshifuri',
        linktr: 'https://lit.link/en/ikuhoshifuri'
      },
      'Justin Thornburgh': {
        twitter: 'https://x.com/JustinThornbur7'
      },
      'v1ris': {
        website: 'https://v1ris.com/',
        youtube: 'https://www.youtube.com/@v1ris_music'
      },
      'Rita Kamishiro': {
        youtube: 'https://www.youtube.com/@RitaKamishiro',
        carrd: 'https://ritakamishiro.carrd.co/'
      },
      'Marcus Ho': {
        website: 'https://www.marcushomusic.com/'
      },

      // Track 4: AZALI & Aloysius - Lux Nova
      'AZALI': {
        youtube: 'https://www.youtube.com/@AZALI00013',
        twitter: 'https://x.com/AZALI00013'
      },
      'Aloysius': {
        youtube: 'https://www.youtube.com/@aloysius3264',
        twitter: 'https://x.com/Aloysiu04138577'
      },

      // Track 5: potatoTeto - Hall of Silent Echoes
      'potatoTeto': {
        youtube: 'https://www.youtube.com/@potatoteto',
        website: 'https://www.potatoteto.com/'
      },

      // Track 6: Artisan - Lirica
      'Artisan': {
        youtube: 'https://www.youtube.com/@artisan1233',
        twitter: 'https://x.com/artisan1233'
      },

      // Track 7: Mei Naganowa - To Defy The Beankeeper
      'Mei Naganowa': {
        twitter: 'https://x.com/ReeKDoesDTM'
      },

      // Track 8: Evin a'k - Trench
      "Evin a'k": {
        youtube: 'https://www.youtube.com/@Evin_a_k',
        twitter: 'https://x.com/evin_a_k?lang=en'
      },

      // Track 9: BilliumMoto - Blooming in the Square
      'BilliumMoto': {
        youtube: 'https://www.youtube.com/@BilliumMoto',
        twitter: 'https://x.com/BilliumMoto'
      },

      // Track 10: Elliot Hsu - Skies in Abberation
      'Elliot Hsu': {
        youtube: 'https://www.youtube.com/@ElliotHsu',
        twitter: 'https://x.com/Leigendar'
      },

      // Track 11: Yuzuki - song of the nymphs
      'Yuzuki': {
        youtube: 'https://www.youtube.com/@yuzukimasu',
        linktr: 'https://linktr.ee/yuzukimasu'
      },

      // Track 12: LucaProject - Light Guardian
      'LucaProject': {
        youtube: 'https://www.youtube.com/@lucaproject6108',
        twitter: 'https://x.com/LucaProject6108',
        carrd: 'https://lucaproject.carrd.co/'
      },

      // Track 13: Koway - Enso Antumbra (feat. 伍一)
      'Koway': {
        youtube: 'https://www.youtube.com/@KOWAYmusic',
        instagram: 'https://www.instagram.com/koway_music/',
        twitter: 'https://x.com/kowaymusic'
      },
      '伍一': {
        youtube: 'https://www.youtube.com/@dreamer051',
        twitch: 'https://www.twitch.tv/dreamer051/about'
      },
      '伍': { // Alternative name for same artist
        youtube: 'https://www.youtube.com/@dreamer051',
        twitch: 'https://www.twitch.tv/dreamer051/about'
      },

      // Track 14: Nstryder - You're In My Way!
      'Nstryder': {
        youtube: 'https://www.youtube.com/@nstryder-music',
        bandcamp: 'https://nstryder.bandcamp.com/'
      },

      // Track 15: MoAE:. - Remember you
      'MoAE.': {
        youtube: 'https://www.youtube.com/@moae00',
        website: 'https://moae.jimdosite.com/'
      },

      // Track 16: dystopian tanuki - Hidden passage
      'dystopian tanuki': {
        youtube: 'https://www.youtube.com/@dystopiantanuki',
        twitter: 'https://x.com/DystopianTanuki'
      },

      // Track 17: Heem - Last Dance (feat. Woojinee) - MOVED TO PHANTASIA 1 SECTION
      'woojinee': {
        instagram: 'https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr'
      },
      'Woojinee': { // Alternative capitalization
        instagram: 'https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr'
      },

      // Track 18: Bigg Milk - Second Guess
      'Bigg Milk': {
        youtube: 'https://www.youtube.com/@BiggMilk',
        twitter: 'https://x.com/milk_bigg'
      },

      // Track 19: Gardens & Sad Keyboard Guy - Fractured Light (feat. eili)
      'Gardens': {
        youtube: 'https://www.youtube.com/@gardens5812',
        website: 'https://gardensdtm.com/'
      },
      'Sad Keyboard Guy': {
        youtube: 'https://www.youtube.com/@SadKeyboardGuy',
        carrd: 'https://sadkeyboardguy.carrd.co/'
      },

      // Track 20: Futsuunohito - Beyond the Veil of Light
      'Futsuunohito': {
        youtube: 'https://www.youtube.com/@futsuunohito',
        carrd: 'https://futsuunohito.crd.co/'
      },
      'shishishiena': {
        youtube: 'https://www.youtube.com/@shishishiena',
        website: 'https://www.shishishiena.com/'
      },

      // ====== PHANTASIA PROJECT 1 ARTISTS - SOCIAL LINKS ======
      // Adding complete social links for Phantasia 1 artists

      // Heem - Complete social links (also in Phantasia 2)
      'Heem': {
        twitter: 'https://x.com/h_e_e__m',
        linktr: 'https://linktr.ee/heeem'
      },

      // Prower - Electronic producer from Phantasia 1
      'Prower': {
        twitter: 'https://x.com/prowerrr_'
      },

      // Seycara - Collaborative producer with AZALI
      'Seycara': {
        twitter: 'https://x.com/Seycara',
        youtube: 'https://www.youtube.com/@Seycara'
      },

      // Qyubey - Electronic producer from Phantasia 1
      'Qyubey': {
        twitter: 'https://x.com/QyubeySan',
        youtube: 'https://www.youtube.com/@qyubey_san'
      },

      // Luscinia - Electronic producer from Phantasia 1
      'Luscinia': {
        twitter: 'https://x.com/LusciniaSound',
        youtube: 'https://www.youtube.com/@Luscinia.Nightingale'
      },

      // はがね (Hagane) - Japanese electronic producer
      'はがね': {
        twitter: 'https://x.com/STEEL_PLUS',
        youtube: 'https://www.youtube.com/@steelplus_hagane'
      },
      'Hagane': { // Alternative name mapping
        twitter: 'https://x.com/STEEL_PLUS',
        youtube: 'https://www.youtube.com/@steelplus_hagane'
      },

      // satella - Electronic producer from Phantasia 1
      'satella': {
        twitter: 'https://x.com/satella0w0',
        youtube: 'https://www.youtube.com/@satella0w0'
      },

      // sleepy - Collaborative producer with Gardens
      'sleepy': {
        twitter: 'https://x.com/sleeplessgamign'
      },
      'Sleepless': { // Alternative name mapping for sleepy
        twitter: 'https://x.com/sleeplessgamign'
      },

      // ====== SPECIAL MENTIONS - PRODUCTION TEAM ======
      'PliXoR': {
        twitter: 'https://x.com/plixormusic'
      },
      'NapaL': {
        twitter: 'https://x.com/Ve_Xillum'
      },
      '나팔 NapaL': { // Alternative name mapping
        twitter: 'https://x.com/Ve_Xillum'
      },
      'yy_artwork': {
        twitter: 'https://x.com/yy_artwork'
      },
      'Elegant Sister': {
        twitter: 'https://x.com/ElegantSister'
      },
      'Len': {
        twitter: 'https://x.com/Len_licht'
      },
      'Daph': {
        twitter: 'https://x.com/daphshoo'
      }
    };

    return socialLinksMap[artistName] || {};
  }

  /**
   * Get correct audio filename for Phantasia 1 tracks
   */
  private getPhantasia1AudioFilename(trackNumber: number, artist: string, title: string): string {
    // Map of actual Phantasia 1 filenames based on the real files in assets/audio/Phantasia_1/
    const phantasia1FilenameMap: Record<number, string> = {
      1: '01. SpiralFlip - Phantasia ft. Eili.ogg',
      2: '02. Bigg Milk - First Steps.ogg',
      3: '03. Heem - Altar of the Sword.ogg',
      4: '04. futsuunohito - A Voyage on the Winds of Change.ogg',
      5: '05. Prower - Rohkeutta Etsiä.ogg',
      6: '06. AZALI & Seycara  - Ivory Flowers.ogg', // Note: extra space after Seycara
      7: '07. Qyubey - Outer Bygone Ruins.ogg',
      8: '08. Luscinia - Spiral Into the Abyss!.ogg',
      9: '09. Gardens & sleepy - Wandering Breeze.ogg',
      10: '10. はがね - Mystic Nebula.ogg',
      11: '11. LucaProject - Iris.ogg',
      12: '12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg',
      13: '13. satella - The Traveller.ogg',
      14: '14. dystopian tanuki - Childhood memories.ogg'
    };

    return phantasia1FilenameMap[trackNumber] || `${String(trackNumber).padStart(2, '0')}. ${artist} - ${title}.ogg`;
  }

  /**
   * Create tracks from Phantasia 1 data
   */
  private createPhantasia1TracksFromData(): TrackWithArtists[] {
    const phantasia1TracksData = [
      { time: '0:00', artist: 'SpiralFlip feat. eili', title: 'Phantasia' },
      { time: '3:00', artist: 'Bigg Milk', title: 'First Steps' },
      { time: '6:00', artist: 'Heem', title: 'Altar of the Sword' },
      { time: '9:00', artist: 'futsuunohito', title: 'A Voyage on the Winds of Change' },
      { time: '12:00', artist: 'Prower', title: 'Rohkeutta Etsiä' },
      { time: '15:00', artist: 'AZALI & Seycara', title: 'Ivory Flowers' },
      { time: '18:00', artist: 'Qyubey', title: 'Outer Bygone Ruins' },
      { time: '21:00', artist: 'Luscinia', title: 'Spiral Into the Abyss!' },
      { time: '24:00', artist: 'Gardens & sleepy', title: 'Wandering Breeze' },
      { time: '27:00', artist: 'はがね', title: 'Mystic Nebula' },
      { time: '30:00', artist: 'LucaProject', title: 'Iris' },
      { time: '33:00', artist: 'Mei Naganowa', title: 'Half-Asleep in the Middle of Bumfuck Nowhere' },
      { time: '36:00', artist: 'satella', title: 'The Traveller' },
      { time: '39:00', artist: 'dystopian tanuki', title: 'Childhood memories' }
    ];

    const tracks: TrackWithArtists[] = [];

    phantasia1TracksData.forEach((trackData, index) => {
      const [minutes, seconds] = trackData.time.split(':').map(Number);
      const startTime = minutes * 60 + seconds;
      const nextTrack = phantasia1TracksData[index + 1];
      let endTime = 45 * 60; // Default 45 minutes total

      if (nextTrack) {
        const [nextMinutes, nextSeconds] = nextTrack.time.split(':').map(Number);
        endTime = nextMinutes * 60 + nextSeconds;
      }

      // Parse features and collaborators
      const features: Artist[] = [];
      const collaborators: Artist[] = [];

      // Handle different featured artist patterns
      const featPattern = /(.+?)\s+(?:feat\.|ft\.)\s+(.+)/;
      const featMatch = trackData.artist.match(featPattern);

      if (featMatch) {
        const [, mainArtist, featuredArtist] = featMatch;
        features.push({
          id: this.generateArtistId(featuredArtist),
          name: featuredArtist,
          displayName: featuredArtist,
          role: 'Featured Artist',
          socialLinks: this.getSocialLinksForArtist(featuredArtist)
        });
      }

      // Handle collaborations with & symbol
      const collabPattern = /(.+?)\s+&\s+(.+)/;
      const collabMatch = trackData.artist.match(collabPattern);

      if (collabMatch && !featMatch) {
        const [, artist1, artist2] = collabMatch;
        collaborators.push({
          id: this.generateArtistId(artist2),
          name: artist2,
          displayName: artist2,
          role: 'Collaborator',
          socialLinks: this.getSocialLinksForArtist(artist2)
        });
      }

      // Clean main artist name
      let cleanMainArtist = trackData.artist.replace(/\s+(?:feat\.|ft\.)\s+.+/, '');
      if (collabMatch && !featMatch) {
        cleanMainArtist = collabMatch[1];
      }

      tracks.push({
        id: `p1-${index + 1}`,
        title: trackData.title,
        mainArtist: cleanMainArtist,
        startTime,
        endTime,
        artists: [],
        features,
        collaborators,
        audioFile: this.getPhantasia1AudioFilename(index + 1, trackData.artist, trackData.title)
      });
    });

    return tracks;
  }
}