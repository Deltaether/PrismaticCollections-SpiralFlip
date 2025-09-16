import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ArtistCreditService,
  ArtistContribution,
  ProjectType
} from '../../services/artist-credit.service';

/**
 * Artist relationship data structure
 */
interface ArtistRelationship {
  artist: ArtistContribution;
  phantasia1Tracks: string[];
  phantasia2Tracks: string[];
  totalContributions: number;
  primaryRole: string;
  evolutionNotes?: string;
}

/**
 * Cross-Project Artist Relationships Component
 * Visualizes artist connections and evolution between Phantasia projects
 */
@Component({
  selector: 'app-cross-project-relationships',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relationships-container">
      <!-- Header -->
      <div class="relationships-header">
        <h2 class="header-title">Cross-Project Artist Journey</h2>
        <p class="header-subtitle">
          Discover how {{ crossProjectArtists().length }} artists evolved between
          Phantasia Project 1 and Project 2
        </p>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats">
        <div class="stat-card featured">
          <span class="stat-value">{{ crossProjectArtists().length }}</span>
          <span class="stat-label">Cross-Project Artists</span>
          <span class="stat-description">Artists who contributed to both projects</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ uniqueToP1().length }}</span>
          <span class="stat-label">Unique to P1</span>
          <span class="stat-description">Artists exclusive to Phantasia 1</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ uniqueToP2().length }}</span>
          <span class="stat-label">Unique to P2</span>
          <span class="stat-description">Artists exclusive to Phantasia 2</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ continuityPercentage() }}%</span>
          <span class="stat-label">Artist Continuity</span>
          <span class="stat-description">Percentage of P1 artists in P2</span>
        </div>
      </div>

      <!-- Artist Journey Timeline -->
      <div class="journey-section">
        <h3 class="section-title">Artist Evolution Journey</h3>
        <div class="journey-timeline">
          <div
            *ngFor="let relationship of artistRelationships(); trackBy: trackByArtist"
            class="journey-item"
            [style.--artist-color]="relationship.artist.color"
          >
            <!-- Artist Header -->
            <div class="artist-header">
              <div class="artist-avatar">
                <img
                  [src]="relationship.artist.avatar || '/assets/images/artists/default-avatar.png'"
                  [alt]="relationship.artist.artistDisplayName"
                  class="avatar-image"
                  (error)="onAvatarError($event)"
                />
              </div>
              <div class="artist-basic-info">
                <h4 class="artist-name">{{ relationship.artist.artistDisplayName }}</h4>
                <span class="artist-role">{{ relationship.primaryRole }}</span>
              </div>
              <div class="contribution-badge">
                <span class="contribution-count">{{ relationship.totalContributions }}</span>
                <span class="contribution-label">Total Tracks</span>
              </div>
            </div>

            <!-- Project Contributions -->
            <div class="project-contributions">
              <!-- Phantasia 1 -->
              <div class="project-column phantasia1">
                <div class="project-header">
                  <span class="project-title">Phantasia 1</span>
                  <span class="track-count">{{ relationship.phantasia1Tracks.length }} tracks</span>
                </div>
                <div class="track-list">
                  <div
                    *ngFor="let track of relationship.phantasia1Tracks"
                    class="track-item"
                  >
                    {{ track }}
                  </div>
                </div>
              </div>

              <!-- Connection Arrow -->
              <div class="connection-arrow">
                <div class="arrow-line"></div>
                <div class="arrow-head">→</div>
              </div>

              <!-- Phantasia 2 -->
              <div class="project-column phantasia2">
                <div class="project-header">
                  <span class="project-title">Phantasia 2</span>
                  <span class="track-count">{{ relationship.phantasia2Tracks.length }} tracks</span>
                </div>
                <div class="track-list">
                  <div
                    *ngFor="let track of relationship.phantasia2Tracks"
                    class="track-item"
                  >
                    {{ track }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Evolution Notes -->
            @if (relationship.evolutionNotes) {
              <div class="evolution-notes">
                <h5 class="notes-title">Artist Evolution</h5>
                <p class="notes-content">{{ relationship.evolutionNotes }}</p>
              </div>
            }

            <!-- Social Links -->
            <div class="social-links">
              <a
                *ngIf="relationship.artist.socialLinks.youtube"
                [href]="relationship.artist.socialLinks.youtube"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link youtube"
                title="YouTube"
              >
                ▶
              </a>
              <a
                *ngIf="relationship.artist.socialLinks.twitter"
                [href]="relationship.artist.socialLinks.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link twitter"
                title="Twitter"
              >
                𝕏
              </a>
              <a
                *ngIf="relationship.artist.socialLinks.website"
                [href]="relationship.artist.socialLinks.website"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link website"
                title="Website"
              >
                🌐
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Comparison Insights -->
      <div class="insights-section">
        <h3 class="section-title">Project Evolution Insights</h3>
        <div class="insights-grid">
          <div class="insight-card">
            <h4 class="insight-title">Collaborative Growth</h4>
            <p class="insight-content">
              {{ crossProjectArtists().length }} artists returned for Phantasia 2,
              showing strong community engagement and project loyalty.
            </p>
          </div>
          <div class="insight-card">
            <h4 class="insight-title">Artistic Diversity</h4>
            <p class="insight-content">
              {{ uniqueToP2().length }} new artists joined in Phantasia 2,
              bringing fresh perspectives and expanding the collective's sound.
            </p>
          </div>
          <div class="insight-card">
            <h4 class="insight-title">Community Foundation</h4>
            <p class="insight-content">
              {{ uniqueToP1().length }} artists from Phantasia 1 helped establish
              the foundation for this incredible musical journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cross-project-relationships.component.scss']
})
export class CrossProjectRelationshipsComponent implements OnInit {
  // Component state
  protected readonly crossProjectArtists = signal<ArtistContribution[]>([]);
  protected readonly phantasia1Artists = signal<ArtistContribution[]>([]);
  protected readonly phantasia2Artists = signal<ArtistContribution[]>([]);

  // Computed values
  protected readonly uniqueToP1 = computed(() => {
    const p1Artists = this.phantasia1Artists();
    const crossProject = this.crossProjectArtists();
    const crossProjectNames = new Set(crossProject.map(a => a.artistName));
    return p1Artists.filter(artist => !crossProjectNames.has(artist.artistName));
  });

  protected readonly uniqueToP2 = computed(() => {
    const p2Artists = this.phantasia2Artists();
    const crossProject = this.crossProjectArtists();
    const crossProjectNames = new Set(crossProject.map(a => a.artistName));
    return p2Artists.filter(artist => !crossProjectNames.has(artist.artistName));
  });

  protected readonly continuityPercentage = computed(() => {
    const p1Count = this.phantasia1Artists().length;
    const crossCount = this.crossProjectArtists().length;
    return p1Count > 0 ? Math.round((crossCount / p1Count) * 100) : 0;
  });

  protected readonly artistRelationships = computed(() => {
    const crossProjectArtists = this.crossProjectArtists();
    const p1Tracks = this.artistCreditService.getProjectTracks('phantasia1');
    const p2Tracks = this.artistCreditService.getProjectTracks('phantasia2');

    return crossProjectArtists.map(artist => {
      const p1TrackNames = p1Tracks
        .filter(track => track.allContributions.some(contrib => contrib.artistName === artist.artistName))
        .map(track => track.title);

      const p2TrackNames = p2Tracks
        .filter(track => track.allContributions.some(contrib => contrib.artistName === artist.artistName))
        .map(track => track.title);

      const evolutionNotes = this.getArtistEvolutionNotes(artist.artistName);

      return {
        artist,
        phantasia1Tracks: p1TrackNames,
        phantasia2Tracks: p2TrackNames,
        totalContributions: p1TrackNames.length + p2TrackNames.length,
        primaryRole: artist.role,
        evolutionNotes
      } as ArtistRelationship;
    }).sort((a, b) => b.totalContributions - a.totalContributions);
  });

  constructor(
    private readonly artistCreditService: ArtistCreditService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Initialize component data
   */
  private initializeComponent(): void {
    const crossProjectArtists = this.artistCreditService.getCrossProjectArtists();
    const phantasia1Artists = this.artistCreditService.getProjectArtists('phantasia1');
    const phantasia2Artists = this.artistCreditService.getProjectArtists('phantasia2');

    this.crossProjectArtists.set(crossProjectArtists);
    this.phantasia1Artists.set(phantasia1Artists);
    this.phantasia2Artists.set(phantasia2Artists);
  }

  /**
   * Get evolution notes for specific artists
   */
  private getArtistEvolutionNotes(artistName: string): string | undefined {
    const evolutionMap: Record<string, string> = {
      'SpiralFlip': 'Evolved from project curator to main artist, maintaining leadership while exploring new collaborative dynamics with eili.',
      'eili': 'Expanded vocal presence from featured artist to multi-project collaborator, showcasing versatile vocal styles across both projects.',
      'AZALI': 'Progressed from collaborative electronic production to solo artistry, demonstrating growth in experimental sound design.',
      'Bigg Milk': 'Maintained consistent chill electronic aesthetic while exploring deeper emotional themes in musical progression.',
      'dystopian tanuki': 'Continued experimental ambient approach with enhanced technical sophistication and atmospheric depth.',
      'futsuunohito': 'Developed cinematic electronic style with more complex orchestral arrangements and narrative elements.',
      'Gardens': 'Advanced from collaborative ambient work to sophisticated sound design with enhanced atmospheric compositions.',
      'Heem': 'Evolved from straightforward electronic production to intricate melodic compositions with featured collaborations.',
      'LucaProject': 'Maintained melodic electronic focus while expanding production complexity and emotional range.',
      'Mei Naganowa': 'Progressed from electronic production to advanced Synthesizer V work, showcasing technical vocal innovation.'
    };

    return evolutionMap[artistName];
  }

  /**
   * Track by function for artist cards
   */
  protected trackByArtist(index: number, relationship: ArtistRelationship): string {
    return relationship.artist.artistName + relationship.artist.id;
  }

  /**
   * Handle avatar image errors
   */
  protected onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/artists/default-avatar.png';
  }
}