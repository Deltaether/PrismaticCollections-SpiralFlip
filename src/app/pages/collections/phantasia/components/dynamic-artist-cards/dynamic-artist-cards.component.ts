import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { DynamicArtistService, Artist, TrackWithArtists } from '../../services/dynamic-artist.service';
import { AudioService } from '../../tools/music-player/audio.service';
import { PerformanceMonitorService } from '../../services/performance-monitor.service';
import { Subject, combineLatest, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, map, startWith, shareReplay } from 'rxjs/operators';

/**
 * Animation states for artist cards
 */
export type CardAnimationState = 'enter' | 'leave' | 'visible' | 'hidden';

/**
 * Interface for card display data
 */
interface ArtistCardData extends Artist {
  isActive: boolean;
  animationState: CardAnimationState;
  index: number;
}

/**
 * Dynamic Artist Cards Component
 *
 * This component displays artist cards that dynamically filter based on the current
 * music playback position. It provides smooth animations for artist card transitions
 * and integrates with the Phantasia 2 audio service for real-time synchronization.
 */
@Component({
  selector: 'app-dynamic-artist-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dynamic-artist-cards.component.html',
  styleUrls: ['./dynamic-artist-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Main container animation for staggered entry
    trigger('cardsContainer', [
      transition('* => *', [
        query('.artist-card', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.9)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
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
        animate('600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
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

    // Glow effect for active cards
    trigger('activeGlow', [
      state('active', style({
        boxShadow: '0 0 30px rgba({{color}}, 0.4), 0 0 60px rgba({{color}}, 0.2)',
        borderColor: 'rgba({{color}}, 0.6)'
      }), { params: { color: '108, 117, 125' } }),

      state('inactive', style({
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      })),

      transition('inactive => active', [
        animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),

      transition('active => inactive', [
        animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)')
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
          stagger(50, [
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
export class DynamicArtistCardsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false; // Disabled for production performance
  private readonly animationTimeouts = new Set<number>(); // Track timeouts for cleanup
  private readonly cardUpdateSubject = new BehaviorSubject<ArtistCardData[]>([]);

  // Input properties
  @Input() showAllArtists = false;
  @Input() maxVisibleCards = 8;
  @Input() enableAnimations = true;
  @Input() displayMode: 'showcase' | 'currently-playing' | 'all' = 'showcase';

  // Reactive component state using signals for optimal performance
  private readonly currentArtistsSignal = signal<Artist[]>([]);
  private readonly currentTrackSignal = signal<TrackWithArtists | null>(null);
  private readonly isPlayingSignal = signal<boolean>(false);
  private readonly currentTimeSignal = signal<number>(0);
  private readonly cardsAnimationTriggerSignal = signal<number>(0);

  // Computed properties for optimal template binding
  artistCards = computed(() => this.createOptimizedCardData(this.currentArtistsSignal()));
  currentTrack = computed(() => this.currentTrackSignal());
  isPlaying = computed(() => this.isPlayingSignal());
  currentTime = computed(() => this.currentTimeSignal());
  cardsAnimationTrigger = computed(() => this.cardsAnimationTriggerSignal());

  // Optimized observables with shareReplay for multiple template subscriptions
  readonly optimizedArtistCards$: Observable<ArtistCardData[]> = this.cardUpdateSubject.pipe(
    distinctUntilChanged((prev, curr) => this.compareCardArrays(prev, curr)),
    debounceTime(16), // 60fps animation timing
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  constructor(
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef,
    private readonly performanceMonitor: PerformanceMonitorService
  ) {}

  ngOnInit(): void {
    // Start performance monitoring in debug mode
    if (this.isDebugMode) {
      this.performanceMonitor.startMonitoring();
    }

    this.setupArtistTracking();
    this.setupAudioTracking();

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Component initialized with performance monitoring');
      // Log metrics every 5 seconds in debug mode
      setInterval(() => this.performanceMonitor.logMetrics(), 5000);
    }
  }

  /**
   * Setup optimized artist tracking with reactive patterns
   */
  private setupArtistTracking(): void {
    // Primary artist tracking with optimized distinctUntilChanged
    this.dynamicArtistService.currentArtists$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)),
        debounceTime(16) // 60fps debounce for smooth animations
      ).subscribe((currentArtists) => {
        this.currentArtistsSignal.set(currentArtists);
        this.updateOptimizedArtistCards(currentArtists);

        // Only mark for check instead of forcing detection
        this.cdr.markForCheck();

        if (this.isDebugMode && currentArtists.length > 0) {
          console.log('[DynamicArtistCardsComponent] Artists updated:', currentArtists.length);
        }
      });

    // Track current track with signal updates
    this.dynamicArtistService.currentTrack$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id)
      )
      .subscribe(track => {
        this.currentTrackSignal.set(track);
        this.cdr.markForCheck();

        if (this.isDebugMode && track) {
          console.log('[DynamicArtistCardsComponent] Track changed:', track.title);
        }
      });
  }

  /**
   * Setup optimized audio tracking with signal-based state management
   */
  private setupAudioTracking(): void {
    // Optimized audio state tracking with reduced frequency
    this.audioService.getCurrentState()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) =>
          prev.isPlaying === curr.isPlaying &&
          Math.abs((prev as any).currentTime - (curr as any).currentTime) < 1.0 // Increased threshold
        ),
        debounceTime(100) // Reduce audio state update frequency
      )
      .subscribe((state: any) => {
        this.isPlayingSignal.set(state.isPlaying);
        this.currentTimeSignal.set(state.currentTime);
        this.cdr.markForCheck();
      });
  }

  /**
   * Optimized card update with memory-efficient processing
   */
  private updateOptimizedArtistCards(artists: Artist[]): void {
    const renderTimer = this.performanceMonitor.createRenderTimer();
    renderTimer.start();

    // Skip update if no artists and not in show-all mode
    if (!this.showAllArtists && artists.length === 0) {
      this.clearOptimizedArtistCards();
      renderTimer.end();
      return;
    }

    const newCards = this.createOptimizedCardData(artists);
    this.cardUpdateSubject.next(newCards);
    this.cardsAnimationTriggerSignal.update(val => val + 1);

    // Schedule cleanup of leaving cards with tracked timeout
    if (this.enableAnimations) {
      const timeoutId = window.setTimeout(() => {
        this.animationTimeouts.delete(timeoutId);
        const filteredCards = newCards.filter(card => card.animationState !== 'leave');
        this.cardUpdateSubject.next(filteredCards);
        this.cdr.markForCheck();

        // Record memory usage periodically
        this.performanceMonitor.recordMemoryUsage();
      }, 400);

      this.animationTimeouts.add(timeoutId);
    }

    this.cdr.markForCheck();
    renderTimer.end();

    // Update cache size metrics
    this.performanceMonitor.updateCacheSize(newCards.length);
  }

  /**
   * Create optimized card data with minimal object creation
   */
  private createOptimizedCardData(artists: Artist[]): ArtistCardData[] {
    const currentCards = this.cardUpdateSubject.value;
    const newCards: ArtistCardData[] = [];
    const existingCardMap = new Map(currentCards.map(card => [card.id, card]));

    // Process active artists
    artists.slice(0, this.maxVisibleCards).forEach((artist, index) => {
      const existingCard = existingCardMap.get(artist.id);

      newCards.push({
        ...artist,
        isActive: true,
        animationState: existingCard?.isActive ? 'visible' : 'enter',
        index
      });
    });

    // Mark leaving cards
    currentCards.forEach(card => {
      if (!newCards.some(newCard => newCard.id === card.id)) {
        newCards.push({ ...card, animationState: 'leave' });
      }
    });

    return newCards;
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
   * Optimized CSS custom properties with caching
   */
  private readonly styleCache = new Map<string, any>();

  getCardStyle(card: ArtistCardData): any {
    const cacheKey = `${card.id}-${card.isActive}-${card.color}`;
    const cached = this.styleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const style = {
      '--artist-color': card.color || '#6c757d',
      '--card-opacity': card.isActive ? '1' : '0.6'
    };

    // Limit cache size
    if (this.styleCache.size > 50) {
      const firstKey = this.styleCache.keys().next().value;
      if (firstKey !== undefined) {
        this.styleCache.delete(firstKey);
      }
    }

    this.styleCache.set(cacheKey, style);
    return style;
  }

  /**
   * Handle social link click
   */
  onSocialLinkClick(url: string, platform: string, artistName: string): void {
    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Opening social link:', { url, platform, artistName });
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generate artist initials for avatar
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
  hasSocialLinks(artist: Artist): boolean {
    return Object.keys(artist.socialLinks).length > 0;
  }

  /**
   * Get visible social links for an artist
   */
  getVisibleSocialLinks(artist: Artist): Array<{ platform: string; url: string }> {
    return Object.entries(artist.socialLinks)
      .filter(([, url]) => url && url.length > 0)
      .map(([platform, url]) => ({ platform, url }));
  }

  /**
   * Get performance metrics for external monitoring
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getPerformanceSummary();
  }

  /**
   * Check if performance is optimal
   */
  isPerformanceOptimal() {
    return this.performanceMonitor.isPerformanceOptimal();
  }

  /**
   * Enable debug mode for performance monitoring
   */
  enableDebugMode(): void {
    (this as any).isDebugMode = true;
    this.performanceMonitor.startMonitoring();
  }

  /**
   * Format time in MM:SS or HH:MM:SS format with NaN handling
   */
  formatTime(seconds: number): string {
    // Handle NaN, undefined, or invalid values
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Optimized track by function for Angular *ngFor with state tracking
   */
  trackByArtistId(index: number, card: ArtistCardData): string {
    return `${card.id}-${card.animationState}-${card.isActive}`;
  }

  /**
   * Optimized card clearing with timeout tracking
   */
  private clearOptimizedArtistCards(): void {
    const currentCards = this.cardUpdateSubject.value;
    const leavingCards = currentCards.map(card => ({
      ...card,
      animationState: 'leave' as CardAnimationState
    }));

    this.cardUpdateSubject.next(leavingCards);
    this.cdr.markForCheck();

    if (this.enableAnimations) {
      const timeoutId = window.setTimeout(() => {
        this.animationTimeouts.delete(timeoutId);
        this.cardUpdateSubject.next([]);
        this.cdr.markForCheck();
      }, 400);

      this.animationTimeouts.add(timeoutId);
    } else {
      this.cardUpdateSubject.next([]);
    }
  }

  ngOnDestroy(): void {
    // Stop performance monitoring and log final metrics
    if (this.isDebugMode) {
      this.performanceMonitor.stopMonitoring();
      console.log('[DynamicArtistCardsComponent] Final performance summary:',
                  this.performanceMonitor.getPerformanceSummary());
    }

    // Clear all animation timeouts to prevent memory leaks
    this.animationTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.animationTimeouts.clear();

    // Complete observables
    this.destroy$.next();
    this.destroy$.complete();
    this.cardUpdateSubject.complete();

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Component destroyed, all timeouts cleared');
    }
  }

  /**
   * Optimized array comparison for better performance
   */
  private compareArtistArrays(prev: Artist[], curr: Artist[]): boolean {
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

  /**
   * Handle current track change for dynamic artist updates
   */
  handleCurrentTrackChange(track: TrackWithArtists | null): void {
    this.currentTrackSignal.set(track);
    this.cdr.markForCheck();

    if (this.isDebugMode && track) {
      console.log('[DynamicArtistCardsComponent] Track changed via handler:', track.title);
    }
  }

  /**
   * Handle currently playing artists change
   */
  handleCurrentlyPlayingArtistsChange(artists: Artist[]): void {
    this.currentArtistsSignal.set(artists);
    this.updateOptimizedArtistCards(artists);
    this.cdr.markForCheck();

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Currently playing artists changed via handler:', artists.length);
    }
  }

  /**
   * Handle legacy audio state changes for backward compatibility
   */
  handleLegacyAudioState(audioState: any): void {
    if (audioState) {
      this.isPlayingSignal.set(audioState.isPlaying || false);
      this.currentTimeSignal.set(audioState.currentTime || 0);

      if (audioState.currentTrack) {
        this.currentTrackSignal.set(audioState.currentTrack);
      }

      this.cdr.markForCheck();

      if (this.isDebugMode) {
        console.log('[DynamicArtistCardsComponent] Legacy audio state updated via handler');
      }
    }
  }
}