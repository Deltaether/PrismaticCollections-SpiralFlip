import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate, query, stagger, keyframes } from '@angular/animations';
import { DynamicArtistService, Artist, TrackWithArtists } from '../../services/dynamic-artist.service';
import { AudioService } from '../../tools/music-player/audio.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';

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
  private readonly isDebugMode = true;

  // Input properties
  @Input() showAllArtists = false;
  @Input() maxVisibleCards = 8;
  @Input() enableAnimations = true;

  // Component state
  artistCards: ArtistCardData[] = [];
  currentTrack: TrackWithArtists | null = null;
  isPlaying = false;
  currentTime = 0;
  cardsAnimationTrigger = 0;

  constructor(
    private readonly dynamicArtistService: DynamicArtistService,
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setupArtistTracking();
    this.setupAudioTracking();

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Component initialized');
    }
  }

  /**
   * Setup artist tracking based on current playback
   */
  private setupArtistTracking(): void {
    // Dynamic filtering mode - always use currentArtists$ now
    this.dynamicArtistService.currentArtists$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) =>
          prev.length === curr.length &&
          prev.every((artist, i) => artist.id === curr[i]?.id)
        )
      ).subscribe((currentArtists) => {
        this.updateArtistCards(currentArtists, this.showAllArtists);

        // Force change detection for immediate visual updates during track navigation
        this.cdr.detectChanges();
      });

    // Track current track for context
    this.dynamicArtistService.currentTrack$
      .pipe(takeUntil(this.destroy$))
      .subscribe(track => {
        this.currentTrack = track;
        this.cdr.markForCheck();

        if (this.isDebugMode && track) {
          console.log('[DynamicArtistCardsComponent] Current track:', track.title);
        }
      });
  }

  /**
   * Setup audio playbook tracking with improved synchronization
   */
  private setupAudioTracking(): void {
    // Listen for audio state changes
    this.audioService.getCurrentState()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) =>
          prev.isPlaying === curr.isPlaying &&
          Math.abs((prev as any).currentTime - (curr as any).currentTime) < 0.5
        )
      )
      .subscribe((state: any) => {
        this.isPlaying = state.isPlaying;
        this.currentTime = state.currentTime;
        this.cdr.markForCheck();
      });

    // Listen for current track changes to ensure immediate updates
    this.dynamicArtistService.currentTrack$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => prev?.id === curr?.id)
      )
      .subscribe(track => {
        if (track && track !== this.currentTrack) {
          if (this.isDebugMode) {
            console.log('[DynamicArtistCardsComponent] Track changed:', track.title);
          }
          this.currentTrack = track;
          this.cdr.markForCheck();

          // Force change detection to ensure the UI updates immediately when track changes during playback
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Update artist cards with new data and animations with improved filtering
   */
  private updateArtistCards(
    artists: Artist[],
    showAllMode: boolean = false
  ): void {
    // Skip update if no artists (prevents showing all artists when track changes)
    if (!showAllMode && artists.length === 0) {
      if (this.isDebugMode) {
        console.log('[DynamicArtistCardsComponent] No artists for current track, clearing cards');
      }
      this.clearArtistCards();
      return;
    }

    const currentCardIds = new Set(this.artistCards.map(card => card.id));
    const newArtistIds = new Set(artists.map(artist => artist.id));

    // Create new card data
    const newCards: ArtistCardData[] = [];
    let index = 0;

    // Add current/active artists
    artists.slice(0, this.maxVisibleCards).forEach(artist => {
      const existingCard = this.artistCards.find(card => card.id === artist.id);

      newCards.push({
        ...artist,
        isActive: true,
        animationState: existingCard && existingCard.isActive ? 'visible' : 'enter',
        index: index++
      });
    });

    // Mark leaving cards
    this.artistCards.forEach(card => {
      if (!newCards.find(newCard => newCard.id === card.id)) {
        newCards.push({
          ...card,
          animationState: 'leave'
        });
      }
    });

    this.artistCards = newCards;
    this.cardsAnimationTrigger++; // Trigger container animation

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Updated cards:', {
        total: newCards.length,
        active: newCards.filter(c => c.isActive).length,
        currentTrack: this.currentTrack?.title || 'none'
      });
    }

    this.cdr.markForCheck();

    // Remove leaving cards after animation
    setTimeout(() => {
      this.artistCards = this.artistCards.filter(card => card.animationState !== 'leave');
      this.cdr.markForCheck();
    }, 400); // Match leave animation duration
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
      '--card-opacity': card.isActive ? '1' : '0.6'
    };
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
   * Get count of active artists
   */
  getActiveArtistCount(): number {
    return this.artistCards.filter(card => card.isActive).length;
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
   * Track by function for Angular *ngFor optimization
   */
  trackByArtistId(index: number, card: ArtistCardData): string {
    return card.id;
  }

  /**
   * Clear all artist cards with animation
   */
  private clearArtistCards(): void {
    this.artistCards = this.artistCards.map(card => ({
      ...card,
      animationState: 'leave' as CardAnimationState
    }));
    this.cdr.markForCheck();

    setTimeout(() => {
      this.artistCards = [];
      this.cdr.markForCheck();
    }, 400);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.isDebugMode) {
      console.log('[DynamicArtistCardsComponent] Component destroyed');
    }
  }
}