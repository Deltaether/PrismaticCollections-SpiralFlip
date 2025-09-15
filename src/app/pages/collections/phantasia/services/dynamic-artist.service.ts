import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, distinctUntilChanged, debounceTime, shareReplay, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ArtistCreditService, TrackWithCompleteCredits, ArtistContribution } from '../../../../services/artist-credit.service';
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

  // Public observables
  public readonly currentTime$ = this.currentTimeSubject.asObservable();
  public readonly tracks$ = this.tracksSubject.asObservable();
  public readonly currentTrack$ = this.currentTrackSubject.asObservable();

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
  private readonly trackToFilenameMap: Record<number, string> = {
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
   * Initialize the service with track data
   */
  private initializeService(): void {
    this.loadTrackData();
  }

  /**
   * Load track data from timestamps
   */
  private loadTrackData(): void {
    const tracksData = this.createTracksFromTimestamps();
    this.tracksSubject.next(tracksData);
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
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9'
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
          audioFile: this.trackToFilenameMap[index + 1]
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

      // Track 17: Heem - Last Dance (feat. Woojinee)
      'Heem': {
        linktr: 'https://linktr.ee/heeem'
      },
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
      }
    };

    return socialLinksMap[artistName] || {};
  }
}