import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ArtistCreditService, ArtistContribution } from '../../services/artist-credit.service';
import { AudioService, AudioState } from '../../pages/collections/phantasia/services/audio.service';
import { CurrentlyPlayingArtistsService } from './currently-playing-artists.service';
import { DynamicArtistService, TrackWithArtists } from '../../pages/collections/phantasia/services/dynamic-artist.service';
import { MusicStateManagerService, ArtistFilteringState } from '../../services/music-state-manager.service';
import { ArtistCardComponent } from './artist-card/artist-card.component';

/**
 * Interface for artist card with unique identifier
 */
export interface ArtistCardData {
  readonly id: string; // Unique identifier for card system
  readonly artist: ArtistContribution;
  readonly isCurrentlyPlaying: boolean;
  readonly participationLevel: 'main' | 'featured' | 'collaboration' | 'additional';
  readonly displayPriority: number; // Higher number = higher priority display
}

/**
 * Dynamic Artist Cards Component
 * 
 * Displays artist cards that update in real-time based on currently playing tracks.
 * Matches the reference design with proper card layout, avatars, and social links.
 * Includes comprehensive identifier system for all 31 Phantasia 2 artists.
 * 
 * Features:
 * - Real-time updates based on playing track
 * - Unique identifier system for each artist card
 * - Responsive grid layout with animations
 * - Social media integration
 * - Role-based display priority
 * - Fallback to showcase mode when no track is playing
 */
@Component({
  selector: 'app-dynamic-artist-cards',
  standalone: true,
  imports: [
    CommonModule,
    ArtistCardComponent
  ],
  templateUrl: './dynamic-artist-cards.component.html',
  styleUrls: ['./dynamic-artist-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardsContainer', [
      transition(':enter', [
        query('.artist-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardUpdate', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('250ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('modeTransition', [
      state('showcase', style({ opacity: 1, transform: 'translateY(0)' })),
      state('currently-playing', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('showcase => currently-playing', [
        animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('currently-playing => showcase', [
        animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DynamicArtistCardsComponent implements OnInit, OnDestroy {
  /**
   * Configuration inputs
   */
  @Input() showAllArtists = false;
  @Input() maxVisibleCards = 8;
  @Input() enableAnimations = true;

  private _displayMode: 'currently-playing' | 'showcase' | 'all' = 'currently-playing';
  @Input() set displayMode(mode: 'currently-playing' | 'showcase' | 'all') {
    const previousMode = this._displayMode;
    this._displayMode = mode;

    // Handle mode change after initialization
    if (previousMode !== mode && !this.isLoading()) {
      this.handleDisplayModeChange(mode);
    }
  }
  get displayMode(): 'currently-playing' | 'showcase' | 'all' {
    return this._displayMode;
  }

  /**
   * Component state signals
   */
  readonly artistCards = signal<ArtistCardData[]>([]);
  readonly currentlyPlayingArtists = signal<ArtistCardData[]>([]);
  readonly showcaseArtists = signal<ArtistCardData[]>([]);
  readonly isLoading = signal(true);
  readonly currentTrack = signal<string | null>(null);
  readonly totalArtistsCount = signal(0);
  readonly animationState = signal<'showcase' | 'currently-playing'>('showcase');

  /**
   * Artist card identifier mapping
   * Each artist gets a unique, consistent identifier for card management
   */
  private readonly artistCardIds = new Map<string, string>([
    ['SpiralFlip', 'artist-card-spiralflip-001'],
    ['eili', 'artist-card-eili-002'],
    ['Ariatec', 'artist-card-ariatec-003'],
    ['MB', 'artist-card-mbgov-004'],
    ['Iku Hoshifuri', 'artist-card-iku-hoshifuri-005'],
    ['Justin Thornburgh', 'artist-card-justin-thornburgh-006'],
    ['v1ris', 'artist-card-v1ris-007'],
    ['Rita Kamishiro', 'artist-card-rita-kamishiro-008'],
    ['Marcus Ho', 'artist-card-marcus-ho-009'],
    ['AZALI', 'artist-card-azali-010'],
    ['Aloysius', 'artist-card-aloysius-011'],
    ['potatoTeto', 'artist-card-potatoteto-012'],
    ['Artisan', 'artist-card-artisan-013'],
    ['Mei Naganowa', 'artist-card-mei-naganowa-014'],
    ["Evin a'k", 'artist-card-evin-ak-015'],
    ['BilliumMoto', 'artist-card-billiummoto-016'],
    ['Elliot Hsu', 'artist-card-elliot-hsu-017'],
    ['Yuzuki', 'artist-card-yuzuki-018'],
    ['LucaProject', 'artist-card-lucaproject-019'],
    ['Koway', 'artist-card-koway-020'],
    ['伍一', 'artist-card-wuyi-021'],
    ['Nstryder', 'artist-card-nstryder-022'],
    ['MoAE', 'artist-card-moae-023'],
    ['dystopian tanuki', 'artist-card-dystopian-tanuki-024'],
    ['Heem', 'artist-card-heem-025'],
    ['Woojinee', 'artist-card-woojinee-026'],
    ['Bigg Milk', 'artist-card-bigg-milk-027'],
    ['Gardens', 'artist-card-gardens-028'],
    ['Sad Keyboard Guy', 'artist-card-sad-keyboard-guy-029'],
    ['Futsuunohito', 'artist-card-futsuunohito-030'],
    ['shishishiena', 'artist-card-shishishiena-031']
  ]);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private artistCreditService: ArtistCreditService,
    private audioService: AudioService,
    private currentlyPlayingService: CurrentlyPlayingArtistsService,
    private dynamicArtistService: DynamicArtistService,
    private musicStateManager: MusicStateManagerService
  ) {}

  ngOnInit(): void {
    this.initializeArtistCards();
    this.setupRealtimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize all artist cards with proper identifiers using centralized state manager
   */
  private initializeArtistCards(): void {
    try {
      const allArtists = this.artistCreditService.getAllPhantasia2Artists();
      this.totalArtistsCount.set(allArtists.length);

      // Create showcase artists (featured selection when not playing)
      const showcaseSelection = this.createShowcaseSelection(allArtists);
      this.showcaseArtists.set(showcaseSelection);

      // Get initial state from music state manager
      const initialFilteringState = this.musicStateManager.getCurrentArtistFilteringState();
      this.updateCardsFromFilteringState(initialFilteringState);

      this.isLoading.set(false);
    } catch (error) {
      console.error('[DynamicArtistCards] Error initializing artist cards:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Setup real-time updates using centralized music state manager
   */
  private setupRealtimeUpdates(): void {
    // PRIMARY: Listen to centralized music state manager for artist filtering changes
    this.musicStateManager.artistFilteringState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filteringState => {
      console.log('[DynamicArtistCards] Artist filtering state changed:',
                  `Mode: ${filteringState.mode}, Current artists: ${filteringState.currentArtists.length}, All artists: ${filteringState.allArtists.length}`);

      this.updateCardsFromFilteringState(filteringState);
    });

    // SECONDARY: Listen to display info updates
    this.musicStateManager.displayInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(displayInfo => {
      console.log('[DynamicArtistCards] Display info updated:', displayInfo);
    });

    // FALLBACK: Keep legacy subscriptions for compatibility during transition
    if (this.displayMode !== 'currently-playing') {
      // Only use legacy subscriptions when not in currently-playing mode
      this.setupLegacyFallbackUpdates();
    }
  }

  /**
   * Update cards specifically for a current track from DynamicArtistService
   */
  private updateCardsForCurrentTrack(track: TrackWithArtists): void {
    const trackArtists: ArtistContribution[] = [];

    // Add main artist
    trackArtists.push({
      id: `${track.id}-main`,
      artistName: track.mainArtist,
      artistDisplayName: track.mainArtist,
      role: 'Main Artist' as any,
      participationType: 'primary' as any,
      percentageContribution: 100,
      color: '#FF6B6B',
      socialLinks: {}
    });

    // Add featured artists
    track.features.forEach((feature, index) => {
      trackArtists.push({
        id: `${track.id}-featured-${index}`,
        artistName: feature.name,
        artistDisplayName: feature.name,
        role: 'Featured Artist' as any,
        participationType: 'featured' as any,
        percentageContribution: 50,
        color: '#ffffff', // Changed from cyan to white
        socialLinks: feature.socialLinks
      });
    });

    // Add collaborators
    track.collaborators.forEach((collaborator, index) => {
      trackArtists.push({
        id: `${track.id}-collab-${index}`,
        artistName: collaborator.name,
        artistDisplayName: collaborator.name,
        role: collaborator.role as any,
        participationType: 'collaboration' as any,
        percentageContribution: 25,
        color: '#45B7D1',
        socialLinks: collaborator.socialLinks
      });
    });

    // Create artist cards
    const playingCards = trackArtists.map(artist => this.createArtistCard(artist, true));
    this.currentlyPlayingArtists.set(playingCards);
    this.artistCards.set(playingCards.slice(0, this.maxVisibleCards));

    console.log('[DynamicArtistCards] Updated cards for track:', track.title,
                'Artists:', trackArtists.map(a => a.artistDisplayName));
  }

  /**
   * Create artist card with unique identifier
   */
  private createArtistCard(artist: ArtistContribution, isCurrentlyPlaying = false): ArtistCardData {
    const cardId = this.artistCardIds.get(artist.artistName) || 
                  `artist-card-${this.generateSlug(artist.artistName)}`;
    
    return {
      id: cardId,
      artist,
      isCurrentlyPlaying,
      participationLevel: this.determineParticipationLevel(artist),
      displayPriority: this.calculateDisplayPriority(artist, isCurrentlyPlaying)
    };
  }

  /**
   * Create all artist cards for display
   */
  private createAllArtistCards(artists: ArtistContribution[]): ArtistCardData[] {
    return artists.map(artist => this.createArtistCard(artist, false))
                 .sort((a, b) => b.displayPriority - a.displayPriority);
  }

  /**
   * Create curated showcase selection
   */
  private createShowcaseSelection(allArtists: ArtistContribution[]): ArtistCardData[] {
    // Feature main artists, featured artists, and notable collaborators
    const showcaseArtists = allArtists.filter(artist => {
      const role = artist.role;
      return role === 'Main Artist' || 
             role === 'Featured Artist' || 
             role === 'Vocalist' ||
             artist.percentageContribution >= 15; // Significant contributors
    });

    return showcaseArtists.map(artist => this.createArtistCard(artist, false))
                         .sort((a, b) => b.displayPriority - a.displayPriority)
                         .slice(0, Math.max(this.maxVisibleCards, 8));
  }

  /**
   * Determine participation level for styling
   */
  private determineParticipationLevel(artist: ArtistContribution): 'main' | 'featured' | 'collaboration' | 'additional' {
    if (artist.role === 'Main Artist') return 'main';
    if (artist.role === 'Featured Artist' || artist.role === 'Vocalist') return 'featured';
    if (artist.percentageContribution >= 10) return 'collaboration';
    return 'additional';
  }

  /**
   * Calculate display priority for sorting
   */
  private calculateDisplayPriority(artist: ArtistContribution, isCurrentlyPlaying: boolean): number {
    let priority = 0;
    
    // Playing artists get highest priority
    if (isCurrentlyPlaying) priority += 1000;
    
    // Role-based priority
    switch (artist.role) {
      case 'Main Artist': priority += 500; break;
      case 'Featured Artist': priority += 400; break;
      case 'Vocalist': priority += 350; break;
      case 'Producer': priority += 300; break;
      case 'Composer': priority += 250; break;
      default: priority += 100; break;
    }
    
    // Contribution percentage bonus
    priority += artist.percentageContribution;
    
    return priority;
  }

  /**
   * Generate URL-safe slug from artist name
   */
  private generateSlug(name: string): string {
    return name.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
  }

  /**
   * Get card by identifier
   */
  getCardById(cardId: string): ArtistCardData | undefined {
    return this.artistCards().find(card => card.id === cardId);
  }

  /**
   * Handle display mode changes dynamically
   */
  private handleDisplayModeChange(newMode: 'currently-playing' | 'showcase' | 'all'): void {
    console.log('[DynamicArtistCards] Display mode changed to:', newMode);

    if (newMode === 'showcase') {
      // Switch to showcase mode - show curated featured artists
      this.animationState.set('showcase');
      const showcaseCards = this.showcaseArtists();
      this.artistCards.set(showcaseCards);
      console.log('[DynamicArtistCards] Switched to showcase mode - showing', showcaseCards.length, 'featured artists');
    } else if (newMode === 'currently-playing') {
      // Switch to currently-playing mode
      this.animationState.set('currently-playing');
      const currentlyPlaying = this.currentlyPlayingArtists();
      if (currentlyPlaying.length > 0) {
        this.artistCards.set(currentlyPlaying.slice(0, this.maxVisibleCards));
        console.log('[DynamicArtistCards] Switched to currently-playing mode - showing', currentlyPlaying.length, 'artists');
      } else {
        // Fallback to showcase if no currently playing artists
        console.log('[DynamicArtistCards] No currently playing artists - falling back to showcase');
        this.handleDisplayModeChange('showcase');
      }
    } else if (newMode === 'all') {
      // Show all artists
      this.animationState.set('showcase'); // Use showcase animation for 'all' mode
      const allArtists = this.artistCreditService.getAllPhantasia2Artists();
      this.artistCards.set(this.createAllArtistCards(allArtists));
    }
  }

  /**
   * Track by function for ngFor optimization
   */
  /**
   * Update cards from artist filtering state
   */
  private updateCardsFromFilteringState(filteringState: ArtistFilteringState): void {
    if (filteringState.mode === 'music-playing' && filteringState.currentArtists.length > 0) {
      // Music is playing - show current artists
      const playingCards = filteringState.currentArtists.map(artist => this.createArtistCard(artist, true));
      this.currentlyPlayingArtists.set(playingCards);
      this.artistCards.set(playingCards.slice(0, this.maxVisibleCards));
      this.animationState.set('currently-playing');

      // Update current track if available
      const musicState = this.musicStateManager.getCurrentMusicState();
      this.currentTrack.set(musicState.currentTrack?.id || null);

      console.log('[DynamicArtistCards] Updated to music-playing mode with', playingCards.length, 'artists');
    } else {
      // No music playing - show all artists in showcase mode
      const allArtistCards = filteringState.allArtists.map(artist => this.createArtistCard(artist, false));
      this.artistCards.set(allArtistCards.slice(0, this.maxVisibleCards));
      this.showcaseArtists.set(allArtistCards);
      this.currentlyPlayingArtists.set([]);
      this.animationState.set('showcase');
      this.currentTrack.set(null);

      console.log('[DynamicArtistCards] Updated to no-music mode with', allArtistCards.length, 'artists');
    }
  }

  /**
   * Setup legacy fallback updates for compatibility
   */
  private setupLegacyFallbackUpdates(): void {
    // Only used when not in currently-playing mode or during transition
    this.currentlyPlayingService.currentlyPlayingArtists$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(playingArtists => {
      // Only use legacy if music state manager hasn't provided current artists
      const currentFilteringState = this.musicStateManager.getCurrentArtistFilteringState();
      if (currentFilteringState.mode === 'no-music' && playingArtists.length > 0) {
        console.log('[DynamicArtistCards] Using legacy fallback for', playingArtists.length, 'artists');
      }
    });
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByCardId(index: number, card: ArtistCardData): string {
    return card.id;
  }

  /**
   * Get current display title from music state manager
   */
  get displayTitle(): string {
    const displayInfo = this.musicStateManager.getCurrentArtistFilteringState();
    return displayInfo.displayTitle;
  }

  /**
   * Get subtitle from music state manager
   */
  get displaySubtitle(): string {
    const displayInfo = this.musicStateManager.getCurrentArtistFilteringState();
    return displayInfo.displaySubtitle;
  }
}