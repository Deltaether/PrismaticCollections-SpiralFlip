import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistContribution } from '../../services/artist-credit.service';

/**
 * Individual Artist Contribution Card Component
 * Displays detailed information about an artist's specific contribution
 */
@Component({
  selector: 'app-artist-contribution-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artist-contribution-card"
         [class.main-artist]="isMainArtist"
         [class.featured]="contribution.participationType === 'Featured'"
         [class.collaboration]="contribution.participationType === 'Collaboration'"
         [class.additional]="contribution.participationType === 'Additional'"
         [class.technical]="contribution.participationType === 'Technical'"
         [class.compact]="compact"
         [style.border-left-color]="contribution.color">

      <!-- Artist Avatar -->
      <div class="artist-avatar" *ngIf="contribution.avatar">
        <img [src]="contribution.avatar"
             [alt]="contribution.artistDisplayName + ' avatar'"
             [title]="contribution.artistDisplayName"
             loading="lazy"
             (error)="onImageError($event)">
        <div class="avatar-fallback" *ngIf="!contribution.avatar || imageError">
          {{ getInitials(contribution.artistDisplayName) }}
        </div>
      </div>

      <!-- Artist Information -->
      <div class="artist-info">
        <div class="artist-name">
          {{ contribution.artistDisplayName }}
        </div>

        <!-- Role Information -->
        <div class="role-info">
          <span class="role-badge"
                [style.background-color]="contribution.color"
                [style.color]="getContrastColor(contribution.color)">
            {{ contribution.role }}
          </span>

          <!-- Additional Role Details -->
          <span class="instrument" *ngIf="showRole && contribution.instrument">
            {{ contribution.instrument }}
          </span>

          <span class="vocal-type" *ngIf="showVocalType && contribution.vocalType">
            {{ contribution.vocalType }}
          </span>

          <span class="synth-voice" *ngIf="contribution.synthesizerVoice">
            Synth: {{ contribution.synthesizerVoice }}
          </span>

          <span class="technical-role" *ngIf="showTechnicalRole && contribution.technicalRole">
            {{ contribution.technicalRole }}
          </span>
        </div>

        <!-- Participation Type -->
        <div class="participation-type">
          <span class="participation-badge" [class]="'type-' + contribution.participationType.toLowerCase()">
            {{ contribution.participationType }}
          </span>
        </div>

        <!-- Contribution Percentage -->
        <div class="contribution-percentage" *ngIf="showPercentage && contribution.percentageContribution > 0">
          <div class="percentage-bar">
            <div class="percentage-fill"
                 [style.width.%]="contribution.percentageContribution"
                 [style.background-color]="contribution.color">
            </div>
          </div>
          <span class="percentage-text">{{ contribution.percentageContribution }}%</span>
        </div>

        <!-- Notes -->
        <div class="contribution-notes" *ngIf="contribution.notes && !compact">
          <span class="notes-text">{{ contribution.notes }}</span>
        </div>

        <!-- Social Links -->
        <div class="social-links" *ngIf="!compact && hasSocialLinks()">
          <a *ngFor="let link of getSocialLinksArray()"
             [href]="link.url"
             target="_blank"
             rel="noopener noreferrer"
             class="social-link"
             [class]="'social-' + link.platform"
             [attr.aria-label]="link.platform + ' for ' + contribution.artistDisplayName"
             [title]="link.platform">
            <span class="social-icon">{{ getSocialIcon(link.platform) }}</span>
          </a>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions" *ngIf="!compact">
        <button class="action-button"
                [attr.aria-label]="'View more about ' + contribution.artistDisplayName"
                (click)="viewArtistDetails()">
          <span class="action-icon">ℹ</span>
        </button>

        <button class="action-button social-expand"
                *ngIf="hasSocialLinks()"
                [attr.aria-label]="'View social links for ' + contribution.artistDisplayName"
                (click)="toggleSocialLinks()">
          <span class="action-icon">🔗</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./artist-contribution-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistContributionCardComponent {
  @Input() contribution!: ArtistContribution;
  @Input() isMainArtist: boolean = false;
  @Input() showRole: boolean = true;
  @Input() showPercentage: boolean = false;
  @Input() showVocalType: boolean = false;
  @Input() showTechnicalRole: boolean = false;
  @Input() compact: boolean = false;

  imageError: boolean = false;
  socialLinksExpanded: boolean = false;

  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    this.imageError = true;
    event.target.style.display = 'none';
  }

  /**
   * Get initials for avatar fallback
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /**
   * Get contrast color for text readability
   */
  getContrastColor(backgroundColor: string): string {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }

  /**
   * Check if artist has social links
   */
  hasSocialLinks(): boolean {
    return Object.values(this.contribution.socialLinks || {}).some(link => link);
  }

  /**
   * Get social links as array for iteration
   */
  getSocialLinksArray(): { platform: string; url: string }[] {
    return Object.entries(this.contribution.socialLinks || {})
      .filter(([_, url]) => url)
      .map(([platform, url]) => ({ platform, url: url as string }));
  }

  /**
   * Get icon for social platform
   */
  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      youtube: '▶',
      twitter: '🐦',
      instagram: '📷',
      website: '🌐',
      carrd: '🏠',
      linktr: '🔗',
      bandcamp: '🎵',
      reelcrafter: '🎬',
      twitch: '📺'
    };
    return icons[platform] || '🔗';
  }

  /**
   * View artist details (emit event or navigate)
   */
  viewArtistDetails(): void {
    // Implementation for viewing artist details
    console.log('View details for:', this.contribution.artistDisplayName);
  }

  /**
   * Toggle social links expansion
   */
  toggleSocialLinks(): void {
    this.socialLinksExpanded = !this.socialLinksExpanded;
  }
}