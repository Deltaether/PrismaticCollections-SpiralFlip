import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { ComprehensiveArtistService, SocialsArtist, ArtistFilter } from '../../services/comprehensive-artist.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, map, shareReplay } from 'rxjs/operators';

/**
 * Display modes for artist cards
 */
export type ArtistDisplayMode = 'all' | 'main' | 'featured' | 'cross-project' | 'phantasia1' | 'phantasia2';

/**
 * Animation states for artist cards
 */
export type CardAnimationState = 'enter' | 'leave' | 'visible' | 'hidden';

/**
 * Interface for card display data with animation state
 */
interface ArtistCardData extends SocialsArtist {
  animationState: CardAnimationState;
  index: number;
}

/**
 * Socials Artist Cards Component
 *
 * Professional artist cards component designed specifically for the socials page.
 * Features all artists from both Phantasia projects with comprehensive filtering,
 * beautiful animations, and complete social media integration.
 */
@Component({
  selector: 'app-socials-artist-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './socials-artist-cards.component.html',
  styleUrls: ['./socials-artist-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Main container animation for staggered entry
    trigger('cardsContainer', [
      transition('* => *', [
        query('.artist-card', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger(80, [
            animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ], { optional: true })
      ])
    ]),

    // Individual card animations
    trigger('cardAnimation', [
      state('enter', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0px)'
      })),

      state('visible', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0px)'
      })),

      state('leave', style({
        opacity: 0,
        transform: 'translateY(-20px) scale(0.95)',
        filter: 'blur(2px)'
      })),

      state('hidden', style({
        opacity: 0.3,
        transform: 'translateY(0) scale(0.98)',
        filter: 'blur(1px)'
      })),

      transition('* => enter', [
        style({ opacity: 0, transform: 'translateY(40px) scale(0.8)', filter: 'blur(4px)' }),
        animate('700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ]),

      transition('* => visible', [
        animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),

      transition('* => leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 1, 1)')
      ]),

      transition('* => hidden', [
        animate('250ms cubic-bezier(0.4, 0.0, 0.6, 1)')
      ])
    ]),

    // Project badge animation
    trigger('projectBadge', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),

      state('hide', style({
        opacity: 0,
        transform: 'translateY(-10px) scale(0.8)'
      })),

      transition('hide => show', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),

      transition('show => hide', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)')
      ])
    ]),

    // Social links animation
    trigger('socialLinksAnimation', [
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),

      state('hide', style({
        opacity: 0,
        transform: 'translateY(10px)'
      })),

      transition('hide => show', [
        query('.social-link', [
          style({ opacity: 0, transform: 'translateY(10px) scale(0.8)' }),
          stagger(40, [
            animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ], { optional: true })
      ]),

      transition('show => hide', [
        animate('200ms cubic-bezier(0.4, 0.0, 1, 1)')
      ])
    ])
  ]
})
export class SocialsArtistCardsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly cardUpdateSubject = new BehaviorSubject<ArtistCardData[]>([]);

  // Input properties
  @Input() displayMode: ArtistDisplayMode = 'all';
  @Input() maxVisibleCards = 24;
  @Input() enableAnimations = true;
  @Input() showFilters = true;
  @Input() compactMode = false;

  // Reactive component state using signals
  private readonly artistsSignal = signal<SocialsArtist[]>([]);
  private readonly currentFilterSignal = signal<ArtistFilter>({ project: 'all' });
  private readonly cardsAnimationTriggerSignal = signal<number>(0);

  // Computed properties for optimal template binding
  artists = computed(() => this.artistsSignal());
  currentFilter = computed(() => this.currentFilterSignal());
  cardsAnimationTrigger = computed(() => this.cardsAnimationTriggerSignal());

  // Optimized observables with shareReplay for multiple template subscriptions
  readonly optimizedArtistCards$: Observable<ArtistCardData[]> = this.cardUpdateSubject.pipe(
    distinctUntilChanged((prev, curr) => this.compareCardArrays(prev, curr)),
    debounceTime(16), // 60fps animation timing
    map(cards => {
      console.log('[SocialsArtistCardsComponent] optimizedArtistCards$ emitting:', cards.length, 'cards');
      return cards;
    }),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  // Available filters
  readonly availableRoles$: Observable<string[]> = this.comprehensiveArtistService.getAvailableRoles();
  readonly projectStatistics$ = this.comprehensiveArtistService.getProjectStatistics();

  constructor(
    private readonly comprehensiveArtistService: ComprehensiveArtistService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupArtistTracking();
    console.log('[SocialsArtistCardsComponent] Component initialized');
  }

  /**
   * Setup optimized artist tracking with reactive patterns
   */
  private setupArtistTracking(): void {
    // Get artists based on display mode
    this.getArtistsForDisplayMode()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)),
        debounceTime(50) // Debounce for smooth updates
      )
      .subscribe((artists) => {
        this.artistsSignal.set(artists);
        this.updateOptimizedArtistCards(artists);
        this.cdr.markForCheck();

        console.log(`[SocialsArtistCardsComponent] Artists updated: ${artists.length} artists in ${this.displayMode} mode`);
      });
  }

  /**
   * Get artists observable based on display mode
   */
  private getArtistsForDisplayMode(): Observable<SocialsArtist[]> {
    switch (this.displayMode) {
      case 'main':
        return this.comprehensiveArtistService.getMainArtists();
      case 'featured':
        return this.comprehensiveArtistService.getFeaturedArtists();
      case 'cross-project':
        return this.comprehensiveArtistService.getCrossProjectArtists();
      case 'phantasia1':
        return this.comprehensiveArtistService.getArtistsByProject('phantasia1');
      case 'phantasia2':
        return this.comprehensiveArtistService.getArtistsByProject('phantasia2');
      case 'all':
      default:
        return this.comprehensiveArtistService.getAllArtists();
    }
  }

  /**
   * Update optimized artist cards with memory-efficient processing
   */
  private updateOptimizedArtistCards(artists: SocialsArtist[]): void {
    console.log('[SocialsArtistCardsComponent] updateOptimizedArtistCards called with artists:', artists.length);

    // Skip update if no artists
    if (artists.length === 0) {
      console.log('[SocialsArtistCardsComponent] No artists, clearing cards');
      this.clearOptimizedArtistCards();
      return;
    }

    // Limit to max visible cards
    const limitedArtists = artists.slice(0, this.maxVisibleCards);
    const newCards = this.createOptimizedCardData(limitedArtists);
    console.log('[SocialsArtistCardsComponent] Created cards:', newCards.length, 'from artists:', limitedArtists.length);

    this.cardUpdateSubject.next(newCards);
    this.cardsAnimationTriggerSignal.update(val => val + 1);

    this.cdr.markForCheck();
  }

  /**
   * Create optimized card data with minimal object creation
   */
  private createOptimizedCardData(artists: SocialsArtist[]): ArtistCardData[] {
    return artists.map((artist, index) => ({
      ...artist,
      animationState: 'enter' as CardAnimationState,
      index
    }));
  }

  /**
   * Get social media icon for platform
   */
  getSocialIcon(platform: string): string {
    const iconMap: Record<string, string> = {
      youtube: 'smart_display',
      twitter: 'alternate_email',
      instagram: 'photo_camera',
      website: 'language',
      carrd: 'badge',
      linktr: 'link',
      bandcamp: 'library_music',
      reelcrafter: 'play_circle',
      twitch: 'videocam'
    };

    return iconMap[platform] || 'link';
  }

  /**
   * Get social media platform display name
   */
  getSocialPlatformName(platform: string): string {
    const nameMap: Record<string, string> = {
      youtube: 'YouTube',
      twitter: 'Twitter/X',
      instagram: 'Instagram',
      website: 'Website',
      carrd: 'Carrd',
      linktr: 'Linktree',
      bandcamp: 'Bandcamp',
      reelcrafter: 'ReelCrafter',
      twitch: 'Twitch'
    };

    return nameMap[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
  }

  /**
   * Get CSS custom properties for artist card
   */
  getCardStyle(card: ArtistCardData): any {
    return {
      '--artist-color': card.color || '#6c757d',
      '--card-index': card.index.toString()
    };
  }

  /**
   * Handle social link click
   */
  onSocialLinkClick(url: string, platform: string, artistName: string): void {
    console.log('[SocialsArtistCardsComponent] Opening social link:', { url, platform, artistName });
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generate artist initials for avatar fallback
   */
  getArtistInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Check if artist has social links
   */
  hasSocialLinks(artist: SocialsArtist): boolean {
    return Object.values(artist.socialLinks).some(link => link && link.length > 0);
  }

  /**
   * Get visible social links for an artist
   */
  getVisibleSocialLinks(artist: SocialsArtist): Array<{ platform: string; url: string }> {
    return Object.entries(artist.socialLinks)
      .filter(([, url]) => url && url.length > 0)
      .map(([platform, url]) => ({ platform, url }));
  }

  /**
   * Get project badges for artist
   */
  getProjectBadges(artist: SocialsArtist): Array<{ id: string; name: string; color: string }> {
    return artist.projects.map(project => ({
      id: project,
      name: project === 'phantasia1' ? 'P1' : 'P2',
      color: project === 'phantasia1' ? '#FF6B6B' : '#6C5CE7'
    }));
  }

  /**
   * Get role display text
   */
  getRoleDisplay(artist: SocialsArtist): string {
    if (artist.isMainArtist && artist.isFeatured) {
      return 'Main & Featured Artist';
    } else if (artist.isMainArtist) {
      return 'Main Artist';
    } else if (artist.isFeatured) {
      return 'Featured Artist';
    }
    return artist.role;
  }

  /**
   * Handle filter change
   */
  onFilterChange(filter: ArtistFilter): void {
    this.currentFilterSignal.set(filter);
    this.comprehensiveArtistService.setFilter(filter);
    this.cdr.markForCheck();
  }

  /**
   * Handle display mode change
   */
  onDisplayModeChange(mode: ArtistDisplayMode): void {
    if (mode !== this.displayMode) {
      this.displayMode = mode;
      this.setupArtistTracking(); // Re-setup with new mode
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle avatar image loading errors
   */
  onAvatarError(event: any, artistName: string): void {
    console.warn(`Avatar image failed to load for ${artistName}, using initials fallback`);
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';

    // Show initials fallback
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add('avatar-fallback');
    }
  }

  /**
   * Optimized track by function for Angular *ngFor
   */
  trackByArtistId(index: number, card: ArtistCardData): string {
    return `${card.id}-${card.animationState}`;
  }

  /**
   * Clear optimized artist cards
   */
  private clearOptimizedArtistCards(): void {
    this.cardUpdateSubject.next([]);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    // Complete observables
    this.destroy$.next();
    this.destroy$.complete();
    this.cardUpdateSubject.complete();

    console.log('[SocialsArtistCardsComponent] Component destroyed');
  }

  /**
   * Optimized array comparison for better performance
   */
  private compareArtistArrays(prev: SocialsArtist[], curr: SocialsArtist[]): boolean {
    if (prev.length !== curr.length) return false;

    // Fast ID-based comparison
    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id !== curr[i].id) return false;
    }
    return true;
  }

  /**
   * Optimized card array comparison
   */
  private compareCardArrays(prev: ArtistCardData[], curr: ArtistCardData[]): boolean {
    if (prev.length !== curr.length) return false;

    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id !== curr[i].id || prev[i].animationState !== curr[i].animationState) {
        return false;
      }
    }
    return true;
  }
}