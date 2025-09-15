import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ArtistCreditService, ArtistContribution } from '../../services/artist-credit.service';
import { AudioService, AudioState } from '../../pages/collections/phantasia/services/audio.service';
import { CurrentlyPlayingArtistsService } from './currently-playing-artists.service';
import { DynamicArtistService, TrackWithArtists } from '../../pages/collections/phantasia/services/dynamic-artist.service';
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
  @Input() displayMode: 'currently-playing' | 'showcase' | 'all' = 'currently-playing';

  /**
   * Component state signals
   */
  readonly artistCards = signal<ArtistCardData[]>([]);
  readonly currentlyPlayingArtists = signal<ArtistCardData[]>([]);
  readonly showcaseArtists = signal<ArtistCardData[]>([]);
  readonly isLoading = signal(true);
  readonly currentTrack = signal<string | null>(null);
  readonly totalArtistsCount = signal(0);

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
    private dynamicArtistService: DynamicArtistService
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
   * Initialize all artist cards with proper identifiers
   */
  private initializeArtistCards(): void {
    try {
      const allArtists = this.artistCreditService.getAllPhantasia2Artists();
      this.totalArtistsCount.set(allArtists.length);

      // Create showcase artists (featured selection when not playing)
      const showcaseSelection = this.createShowcaseSelection(allArtists);
      this.showcaseArtists.set(showcaseSelection);

      // Set initial display based on display mode
      if (this.displayMode === 'showcase' || this.displayMode === 'all') {
        this.artistCards.set(this.displayMode === 'all' ? 
          this.createAllArtistCards(allArtists) : showcaseSelection);
      }

      this.isLoading.set(false);
    } catch (error) {
      console.error('[DynamicArtistCards] Error initializing artist cards:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Setup real-time updates based on audio state
   */
  private setupRealtimeUpdates(): void {
    // PRIMARY: Listen to DynamicArtistService for current track changes (Phantasia 2)
    this.dynamicArtistService.currentTrack$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(currentTrack => {
      console.log('[DynamicArtistCards] Current track changed:', currentTrack?.title, 'by', currentTrack?.mainArtist);

      if (currentTrack) {
        this.currentTrack.set(currentTrack.id);

        if (this.displayMode === 'currently-playing') {
          // Update cards immediately based on track change
          this.updateCardsForCurrentTrack(currentTrack);
        }
      } else {
        this.currentTrack.set(null);
        if (this.displayMode === 'currently-playing') {
          // Fall back to showcase mode when no track is playing
          this.artistCards.set(this.showcaseArtists().slice(0, this.maxVisibleCards));
        }
      }
    });

    // SECONDARY: Listen to CurrentlyPlayingArtistsService for artist updates
    this.currentlyPlayingService.currentlyPlayingArtists$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(playingArtists => {
      console.log('[DynamicArtistCards] Currently playing artists changed:', playingArtists.map(a => a.artistDisplayName));

      if (this.displayMode === 'currently-playing' && playingArtists.length > 0) {
        const playingCards = playingArtists.map(artist => this.createArtistCard(artist, true));
        this.currentlyPlayingArtists.set(playingCards);
        this.artistCards.set(playingCards.slice(0, this.maxVisibleCards));

        console.log('[DynamicArtistCards] Updated artist cards for currently playing artists:',
                    playingCards.map(c => c.artist.artistDisplayName));
      } else if (this.displayMode === 'currently-playing' && playingArtists.length === 0) {
        // Fall back to showcase mode when no artists are playing
        this.artistCards.set(this.showcaseArtists().slice(0, this.maxVisibleCards));
      }
    });

    // FALLBACK: Legacy audio service for non-Phantasia 2 pages
    this.audioService.audioState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(audioState => {
      // Only use if DynamicArtistService isn't providing a track
      if (!this.currentTrack()) {
        this.currentTrack.set(audioState.currentTrack);

        if (this.displayMode === 'currently-playing') {
          if (audioState.isPlaying && audioState.currentTrack) {
            // Use legacy system - will be picked up by CurrentlyPlayingArtistsService
            console.log('[DynamicArtistCards] Using legacy audio state for track:', audioState.currentTrack);
          } else {
            // Fall back to showcase mode
            this.artistCards.set(this.showcaseArtists().slice(0, this.maxVisibleCards));
          }
        }
      }
    });
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
        color: '#4ECDC4',
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
   * Track by function for ngFor optimization
   */
  trackByCardId(index: number, card: ArtistCardData): string {
    return card.id;
  }

  /**
   * Get current display title
   */
  get displayTitle(): string {
    const currentTrack = this.currentTrack();
    const playingArtists = this.currentlyPlayingArtists();
    
    if (currentTrack && playingArtists.length > 0) {
      return 'Currently Playing Artists';
    }
    
    return this.showAllArtists ? 'All Phantasia 2 Artists' : 'Featured Artists';
  }

  /**
   * Get subtitle based on current state
   */
  get displaySubtitle(): string {
    const currentTrack = this.currentTrack();
    const playingArtists = this.currentlyPlayingArtists();
    const totalCards = this.artistCards().length;
    
    if (currentTrack && playingArtists.length > 0) {
      return `Artists change dynamically with the music. ${playingArtists.length} artists are currently featured.`;
    }
    
    return `Showcasing ${totalCards} of ${this.totalArtistsCount()} artists from the album.`;
  }
}