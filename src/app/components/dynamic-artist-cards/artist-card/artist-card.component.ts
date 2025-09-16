import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ArtistCardData } from '../dynamic-artist-cards.component';

/**
 * Individual Artist Card Component
 * 
 * Displays a single artist card matching the reference design.
 * Features:
 * - Circular avatar with artist initials fallback
 * - Artist name and role badge
 * - Currently playing indicator
 * - Social media links (YouTube, Twitter/X)
 * - Hover animations and interactive elements
 * - Responsive design for all screen sizes
 * 
 * Layout matches the reference image:
 * - Dark card background with rounded corners
 * - Circular avatar at top
 * - Artist name below avatar
 * - Role label (MAIN ARTIST, FEATURED ARTIST, etc.)
 * - Currently Playing status dot
 * - Social links at bottom
 */
@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardHover', [
      state('default', style({ transform: 'translateY(0) scale(1)' })),
      state('hovered', style({ transform: 'translateY(-4px) scale(1.02)' })),
      transition('default <=> hovered', animate('200ms ease-out'))
    ]),
    trigger('playingIndicator', [
      state('playing', style({ 
        opacity: 1, 
        transform: 'scale(1)',
        background: '#4ECDC4'
      })),
      state('not-playing', style({ 
        opacity: 0.3, 
        transform: 'scale(0.8)',
        background: '#666'
      })),
      transition('playing <=> not-playing', animate('300ms ease-out'))
    ])
  ]
})
export class ArtistCardComponent {
  @Input({ required: true }) cardData!: ArtistCardData;
  @Input() enableAnimations = true;

  // Component state
  readonly isHovered = signal(false);
  readonly avatarError = signal(false);

  // Computed properties
  readonly artistInitials = computed(() => {
    const name = this.cardData?.artist?.artistDisplayName || '';
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    
    // Take first letter of first and last word for better representation
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  });

  readonly roleDisplayText = computed(() => {
    if (!this.cardData?.artist?.role) return '';
    
    const role = this.cardData.artist.role;
    
    // Convert role to display format matching reference design
    switch (role) {
      case 'Main Artist': return 'MAIN ARTIST';
      case 'Featured Artist': return 'FEATURED ARTIST';
      case 'Vocalist': return 'VOCALIST';
      case 'Producer': return 'PRODUCER';
      case 'Composer': return 'COMPOSER';
      case 'Arranger': return 'ARRANGER';
      case 'Instrumentalist': return 'INSTRUMENTALIST';
      case 'Violin': return 'VIOLIN';
      case 'Viola': return 'VIOLA';
      case 'Cello': return 'CELLO';
      case 'Accordion': return 'ACCORDION';
      case 'Piano': return 'PIANO';
      case 'Keyboard': return 'KEYBOARD';
      case 'Guitar': return 'GUITAR';
      case 'Bass': return 'BASS';
      case 'Drums': return 'DRUMS';
      case 'Electronic Producer': return 'ELECTRONIC PRODUCER';
      case 'Sound Designer': return 'SOUND DESIGNER';
      case 'Synthesizer V Operator': return 'SYNTHESIZER V';
      case 'Voice Actor': return 'VOICE ACTOR';
      default: return role.toUpperCase();
    }
  });

  readonly participationLevelClass = computed(() => {
    return `participation-${this.cardData?.participationLevel || 'additional'}`;
  });

  readonly cardThemeColor = computed(() => {
    return this.cardData?.artist?.color || '#ffffff'; // White fallback instead of cyan
  });

  // Social links helpers
  get hasYoutube(): boolean {
    return !!this.cardData?.artist?.socialLinks?.youtube;
  }

  get hasTwitter(): boolean {
    return !!this.cardData?.artist?.socialLinks?.twitter;
  }

  get youtubeUrl(): string {
    return this.cardData?.artist?.socialLinks?.youtube || '';
  }

  get twitterUrl(): string {
    return this.cardData?.artist?.socialLinks?.twitter || '';
  }

  get artistName(): string {
    return this.cardData?.artist?.artistDisplayName || 'Unknown Artist';
  }

  get avatarUrl(): string {
    return this.cardData?.artist?.avatar || '';
  }

  get isCurrentlyPlaying(): boolean {
    return this.cardData?.isCurrentlyPlaying || false;
  }

  // Event handlers
  onMouseEnter(): void {
    if (this.enableAnimations) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave(): void {
    if (this.enableAnimations) {
      this.isHovered.set(false);
    }
  }

  onAvatarError(): void {
    this.avatarError.set(true);
  }

  onSocialLinkClick(platform: 'youtube' | 'twitter', event: Event): void {
    event.stopPropagation();
    
    let url = '';
    if (platform === 'youtube') {
      url = this.youtubeUrl;
    } else if (platform === 'twitter') {
      url = this.twitterUrl;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onCardClick(): void {
    // Could be extended for detailed artist view
    console.log('Artist card clicked:', this.cardData?.artist?.artistDisplayName);
  }

  // Animation state getters
  get hoverState(): string {
    return this.isHovered() ? 'hovered' : 'default';
  }

  get playingIndicatorState(): string {
    return this.isCurrentlyPlaying ? 'playing' : 'not-playing';
  }
}