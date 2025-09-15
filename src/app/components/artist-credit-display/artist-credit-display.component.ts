import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArtistCreditService, TrackWithCompleteCredits, ArtistContribution, CreditVerification } from '../../services/artist-credit.service';

/**
 * Comprehensive Artist Credit Display Component
 * Shows complete, accurate attribution for all Phantasia 2 contributors
 */
@Component({
  selector: 'app-artist-credit-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artist-credit-container">
      <!-- Current Track Credits -->
      <div class="current-track-credits" *ngIf="currentTrackCredits$ | async as trackCredits">
        <div class="track-header">
          <h2 class="track-title">{{ trackCredits.title }}</h2>
          <span class="track-number">Track {{ trackCredits.trackNumber }}</span>
          <div class="verification-badge"
               [class.verified]="isTrackVerified(trackCredits.id)"
               [class.partial]="isTrackPartiallyVerified(trackCredits.id)"
               [class.needs-work]="needsVerificationWork(trackCredits.id)">
            <span class="verification-icon">
              {{ getVerificationIcon(trackCredits.id) }}
            </span>
            <span class="verification-text">
              {{ getVerificationText(trackCredits.id) }}
            </span>
          </div>
        </div>

        <!-- Main Artist -->
        <div class="main-artist-section">
          <h3>Main Artist</h3>
          <div class="artist-card main-artist">
            <app-artist-contribution-card
              [contribution]="trackCredits.mainArtist"
              [isMainArtist]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Featured Artists -->
        <div class="featured-artists-section" *ngIf="trackCredits.featuredArtists.length > 0">
          <h3>Featured Artists</h3>
          <div class="artist-grid">
            <app-artist-contribution-card
              *ngFor="let artist of trackCredits.featuredArtists"
              [contribution]="artist"
              [showPercentage]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Instrumentalists -->
        <div class="instrumentalists-section" *ngIf="trackCredits.instrumentalists.length > 0">
          <h3>Instrumentalists</h3>
          <div class="artist-grid">
            <app-artist-contribution-card
              *ngFor="let artist of trackCredits.instrumentalists"
              [contribution]="artist"
              [showRole]="true"
              [showPercentage]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Collaborators -->
        <div class="collaborators-section" *ngIf="trackCredits.collaborators.length > 0">
          <h3>Collaborators</h3>
          <div class="artist-grid">
            <app-artist-contribution-card
              *ngFor="let artist of trackCredits.collaborators"
              [contribution]="artist"
              [showPercentage]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Vocalists -->
        <div class="vocalists-section" *ngIf="trackCredits.vocalists.length > 0">
          <h3>Vocalists</h3>
          <div class="artist-grid">
            <app-artist-contribution-card
              *ngFor="let artist of trackCredits.vocalists"
              [contribution]="artist"
              [showVocalType]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Technical Credits -->
        <div class="technical-credits-section" *ngIf="trackCredits.technicalCredits.length > 0">
          <h3>Production & Technical</h3>
          <div class="artist-grid">
            <app-artist-contribution-card
              *ngFor="let artist of trackCredits.technicalCredits"
              [contribution]="artist"
              [showTechnicalRole]="true">
            </app-artist-contribution-card>
          </div>
        </div>

        <!-- Complete Attribution List -->
        <div class="complete-attribution">
          <h3>Complete Attribution</h3>
          <div class="attribution-list">
            <div class="attribution-item" *ngFor="let contribution of trackCredits.allContributions">
              <span class="artist-name">{{ contribution.artistDisplayName }}</span>
              <span class="role-badge" [style.background-color]="contribution.color">
                {{ contribution.role }}
              </span>
              <span class="percentage">{{ contribution.percentageContribution }}%</span>
              <span class="notes" *ngIf="contribution.notes">{{ contribution.notes }}</span>
            </div>
          </div>
        </div>

        <!-- Social Links Section -->
        <div class="social-links-section">
          <h3>Artist Social Links</h3>
          <div class="social-links-grid">
            <div class="artist-social" *ngFor="let contribution of trackCredits.allContributions">
              <span class="artist-name">{{ contribution.artistDisplayName }}</span>
              <div class="social-links">
                <a *ngFor="let link of getSocialLinksArray(contribution.socialLinks)"
                   [href]="link.url"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="social-link"
                   [attr.aria-label]="link.platform + ' for ' + contribution.artistDisplayName">
                  <span class="social-platform">{{ link.platform }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Verification Panel -->
      <div class="verification-panel" *ngIf="showVerificationPanel">
        <h3>Credit Verification Status</h3>
        <div class="verification-summary" *ngIf="verificationReport$ | async as report">
          <div class="verification-stats">
            <div class="stat">
              <span class="stat-number">{{ report.verificationPercentage }}%</span>
              <span class="stat-label">Verified</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ report.fullyVerified }}</span>
              <span class="stat-label">Complete</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ report.partiallyVerified }}</span>
              <span class="stat-label">Partial</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ report.needsWork }}</span>
              <span class="stat-label">Needs Work</span>
            </div>
          </div>
        </div>
      </div>

      <!-- All Artists Overview -->
      <div class="all-artists-overview" *ngIf="showAllArtists">
        <h3>All Phantasia 2 Artists ({{ getAllPhantasia2Artists().length }})</h3>
        <div class="artist-grid">
          <app-artist-contribution-card
            *ngFor="let artist of getAllPhantasia2Artists()"
            [contribution]="artist"
            [showRole]="false"
            [compact]="true">
          </app-artist-contribution-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./artist-credit-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistCreditDisplayComponent implements OnInit, OnDestroy {
  @Input() showVerificationPanel: boolean = false;
  @Input() showAllArtists: boolean = false;
  @Input() trackId?: string;

  currentTrackCredits$: Observable<TrackWithCompleteCredits | null>;
  verificationReport$: Observable<any>;
  verificationStatuses: CreditVerification[] = [];

  private destroy$ = new Subject<void>();

  constructor(private artistCreditService: ArtistCreditService) {
    this.currentTrackCredits$ = this.artistCreditService.currentTrackCredits$;
    this.verificationReport$ = this.artistCreditService.getVerificationReport();
  }

  ngOnInit(): void {
    // Subscribe to verification statuses
    this.artistCreditService.verificationStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(statuses => {
        this.verificationStatuses = statuses;
      });

    // If trackId is provided, update current track
    if (this.trackId) {
      this.artistCreditService.updateCurrentTrack(this.trackId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if track is fully verified
   */
  isTrackVerified(trackId: string): boolean {
    const verification = this.verificationStatuses.find(v => v.trackId === trackId);
    return verification?.fullyVerified || false;
  }

  /**
   * Check if track is partially verified
   */
  isTrackPartiallyVerified(trackId: string): boolean {
    const verification = this.verificationStatuses.find(v => v.trackId === trackId);
    return !verification?.fullyVerified &&
           (verification?.allContributorsIdentified || verification?.rolesAccuratelyAssigned) || false;
  }

  /**
   * Check if track needs verification work
   */
  needsVerificationWork(trackId: string): boolean {
    const verification = this.verificationStatuses.find(v => v.trackId === trackId);
    return !verification?.fullyVerified &&
           !verification?.allContributorsIdentified &&
           !verification?.rolesAccuratelyAssigned || false;
  }

  /**
   * Get verification icon
   */
  getVerificationIcon(trackId: string): string {
    if (this.isTrackVerified(trackId)) return '✓';
    if (this.isTrackPartiallyVerified(trackId)) return '⚠';
    return '⚐';
  }

  /**
   * Get verification text
   */
  getVerificationText(trackId: string): string {
    if (this.isTrackVerified(trackId)) return 'Fully Verified';
    if (this.isTrackPartiallyVerified(trackId)) return 'Partially Verified';
    return 'Needs Verification';
  }

  /**
   * Convert social links object to array for template iteration
   */
  getSocialLinksArray(socialLinks: any): { platform: string; url: string }[] {
    return Object.entries(socialLinks || {})
      .filter(([_, url]) => url)
      .map(([platform, url]) => ({ platform, url: url as string }));
  }

  /**
   * Get all Phantasia 2 artists
   */
  getAllPhantasia2Artists(): ArtistContribution[] {
    return this.artistCreditService.getAllPhantasia2Artists();
  }
}