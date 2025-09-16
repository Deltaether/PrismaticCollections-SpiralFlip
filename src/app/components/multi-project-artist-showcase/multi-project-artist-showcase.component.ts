import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import {
  ArtistCreditService,
  ArtistContribution,
  ProjectType,
  ProjectMetadata
} from '../../services/artist-credit.service';
import { DynamicArtistService } from '../../pages/collections/phantasia/services/dynamic-artist.service';

/**
 * Filter types for artist display
 */
type ArtistFilter = 'all' | 'phantasia1' | 'phantasia2' | 'cross-project' | 'unique-p1' | 'unique-p2';

/**
 * Sort options for artists
 */
type SortOption = 'name' | 'project' | 'role' | 'contributions';

/**
 * Multi-Project Artist Showcase Component
 * Displays artists from both Phantasia projects with advanced filtering
 */
@Component({
  selector: 'app-multi-project-artist-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artist-showcase-container">
      <!-- Header Section -->
      <div class="showcase-header">
        <h2 class="showcase-title">Artist Collective</h2>
        <p class="showcase-subtitle">
          Discover the {{ totalArtists() }} talented artists across both Phantasia projects
        </p>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-section">
          <h3 class="filter-title">Filter Artists</h3>
          <div class="filter-buttons">
            <button
              *ngFor="let filter of filterOptions"
              class="filter-btn"
              [class.active]="currentFilter() === filter.value"
              (click)="setFilter(filter.value)"
            >
              <span class="filter-label">{{ filter.label }}</span>
              <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
            </button>
          </div>
        </div>

        <div class="sort-section">
          <h3 class="sort-title">Sort By</h3>
          <select
            class="sort-select"
            [value]="currentSort()"
            (change)="setSort($event.target.value as SortOption)"
          >
            <option value="name">Artist Name</option>
            <option value="project">Project</option>
            <option value="role">Primary Role</option>
            <option value="contributions">Contributions</option>
          </select>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <span class="stat-value">{{ phantasia1Count() }}</span>
          <span class="stat-label">Phantasia 1 Artists</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ phantasia2Count() }}</span>
          <span class="stat-label">Phantasia 2 Artists</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ crossProjectCount() }}</span>
          <span class="stat-label">Cross-Project Artists</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalArtists() }}</span>
          <span class="stat-label">Total Unique Artists</span>
        </div>
      </div>

      <!-- Artist Grid -->
      <div class="artist-grid">
        <div
          *ngFor="let artist of displayedArtists(); trackBy: trackByArtist"
          class="artist-card"
          [style.--artist-color]="artist.color"
        >
          <!-- Artist Avatar -->
          <div class="artist-avatar">
            <img
              [src]="artist.avatar || '/assets/images/artists/default-avatar.png'"
              [alt]="artist.artistDisplayName"
              class="avatar-image"
              (error)="onAvatarError($event)"
            />
            <div class="avatar-overlay">
              <span class="artist-role">{{ artist.role }}</span>
            </div>
          </div>

          <!-- Artist Info -->
          <div class="artist-info">
            <h3 class="artist-name">{{ artist.artistDisplayName }}</h3>
            <p class="artist-bio">{{ artist.bio || getArtistData(artist.artistName)?.bio || 'Electronic music artist' }}</p>

            <!-- Project Badges -->
            <div class="project-badges">
              <span
                *ngIf="isInProject(artist.artistName, 'phantasia1')"
                class="project-badge phantasia1"
              >
                P1
              </span>
              <span
                *ngIf="isInProject(artist.artistName, 'phantasia2')"
                class="project-badge phantasia2"
              >
                P2
              </span>
            </div>

            <!-- Contribution Summary -->
            <div class="contribution-summary">
              <span class="contribution-count">
                {{ getArtistContributionCount(artist.artistName) }}
                {{ getArtistContributionCount(artist.artistName) === 1 ? 'Track' : 'Tracks' }}
              </span>
            </div>
          </div>

          <!-- Social Links -->
          <div class="social-links">
            <a
              *ngIf="artist.socialLinks.youtube"
              [href]="artist.socialLinks.youtube"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link youtube"
              title="YouTube"
            >
              <span class="social-icon">▶</span>
            </a>
            <a
              *ngIf="artist.socialLinks.twitter"
              [href]="artist.socialLinks.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link twitter"
              title="Twitter"
            >
              <span class="social-icon">𝕏</span>
            </a>
            <a
              *ngIf="artist.socialLinks.website"
              [href]="artist.socialLinks.website"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link website"
              title="Website"
            >
              <span class="social-icon">🌐</span>
            </a>
            <a
              *ngIf="artist.socialLinks.carrd"
              [href]="artist.socialLinks.carrd"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link carrd"
              title="Carrd"
            >
              <span class="social-icon">📋</span>
            </a>
            <a
              *ngIf="artist.socialLinks.linktr"
              [href]="artist.socialLinks.linktr"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link linktree"
              title="Linktree"
            >
              <span class="social-icon">🔗</span>
            </a>
          </div>

          <!-- Cross-Project Indicator -->
          @if (isCrossProjectArtist(artist.artistName)) {
            <div class="cross-project-indicator">
              <span class="indicator-text">Cross-Project</span>
            </div>
          }
        </div>
      </div>

      <!-- Load More / Pagination -->
      @if (hasMoreArtists()) {
        <div class="load-more-section">
          <button class="load-more-btn" (click)="loadMoreArtists()">
            Load More Artists
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./multi-project-artist-showcase.component.scss']
})
export class MultiProjectArtistShowcaseComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Component state signals
  protected readonly currentFilter = signal<ArtistFilter>('all');
  protected readonly currentSort = signal<SortOption>('name');
  protected readonly allArtists = signal<ArtistContribution[]>([]);
  protected readonly phantasia1Artists = signal<ArtistContribution[]>([]);
  protected readonly phantasia2Artists = signal<ArtistContribution[]>([]);
  protected readonly crossProjectArtists = signal<ArtistContribution[]>([]);
  protected readonly displayLimit = signal<number>(12);

  // Filter options
  protected readonly filterOptions = [
    { value: 'all' as ArtistFilter, label: 'All Artists' },
    { value: 'phantasia1' as ArtistFilter, label: 'Phantasia 1' },
    { value: 'phantasia2' as ArtistFilter, label: 'Phantasia 2' },
    { value: 'cross-project' as ArtistFilter, label: 'Cross-Project' },
    { value: 'unique-p1' as ArtistFilter, label: 'Unique to P1' },
    { value: 'unique-p2' as ArtistFilter, label: 'Unique to P2' }
  ];

  // Computed values
  protected readonly filteredArtists = computed(() => {
    const artists = this.allArtists();
    const filter = this.currentFilter();

    switch (filter) {
      case 'phantasia1':
        return this.phantasia1Artists();
      case 'phantasia2':
        return this.phantasia2Artists();
      case 'cross-project':
        return this.crossProjectArtists();
      case 'unique-p1':
        return this.getUniqueP1Artists();
      case 'unique-p2':
        return this.getUniqueP2Artists();
      default:
        return artists;
    }
  });

  protected readonly sortedArtists = computed(() => {
    const artists = [...this.filteredArtists()];
    const sort = this.currentSort();

    return artists.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.artistDisplayName.localeCompare(b.artistDisplayName);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'contributions':
          return this.getArtistContributionCount(b.artistName) - this.getArtistContributionCount(a.artistName);
        default:
          return a.artistDisplayName.localeCompare(b.artistDisplayName);
      }
    });
  });

  protected readonly displayedArtists = computed(() => {
    return this.sortedArtists().slice(0, this.displayLimit());
  });

  protected readonly hasMoreArtists = computed(() => {
    return this.displayLimit() < this.sortedArtists().length;
  });

  // Stats computed values
  protected readonly phantasia1Count = computed(() => this.phantasia1Artists().length);
  protected readonly phantasia2Count = computed(() => this.phantasia2Artists().length);
  protected readonly crossProjectCount = computed(() => this.crossProjectArtists().length);
  protected readonly totalArtists = computed(() => this.allArtists().length);

  constructor(
    private readonly artistCreditService: ArtistCreditService,
    private readonly dynamicArtistService: DynamicArtistService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize component data
   */
  private initializeComponent(): void {
    // Load all artist data
    this.loadArtistData();
  }

  /**
   * Load artist data from services
   */
  private loadArtistData(): void {
    const allArtists = this.artistCreditService.getAllArtistsAllProjects();
    const phantasia1Artists = this.artistCreditService.getProjectArtists('phantasia1');
    const phantasia2Artists = this.artistCreditService.getProjectArtists('phantasia2');
    const crossProjectArtists = this.artistCreditService.getCrossProjectArtists();

    this.allArtists.set(allArtists);
    this.phantasia1Artists.set(phantasia1Artists);
    this.phantasia2Artists.set(phantasia2Artists);
    this.crossProjectArtists.set(crossProjectArtists);
  }

  /**
   * Set current filter
   */
  protected setFilter(filter: ArtistFilter): void {
    this.currentFilter.set(filter);
    this.displayLimit.set(12); // Reset display limit
  }

  /**
   * Set current sort option
   */
  protected setSort(sort: SortOption): void {
    this.currentSort.set(sort);
  }

  /**
   * Get filter count for display
   */
  protected getFilterCount(filter: ArtistFilter): number {
    switch (filter) {
      case 'all':
        return this.allArtists().length;
      case 'phantasia1':
        return this.phantasia1Artists().length;
      case 'phantasia2':
        return this.phantasia2Artists().length;
      case 'cross-project':
        return this.crossProjectArtists().length;
      case 'unique-p1':
        return this.getUniqueP1Artists().length;
      case 'unique-p2':
        return this.getUniqueP2Artists().length;
      default:
        return 0;
    }
  }

  /**
   * Get artists unique to Phantasia 1
   */
  private getUniqueP1Artists(): ArtistContribution[] {
    const p1Artists = this.phantasia1Artists();
    const crossProject = this.crossProjectArtists();
    const crossProjectNames = new Set(crossProject.map(a => a.artistName));

    return p1Artists.filter(artist => !crossProjectNames.has(artist.artistName));
  }

  /**
   * Get artists unique to Phantasia 2
   */
  private getUniqueP2Artists(): ArtistContribution[] {
    const p2Artists = this.phantasia2Artists();
    const crossProject = this.crossProjectArtists();
    const crossProjectNames = new Set(crossProject.map(a => a.artistName));

    return p2Artists.filter(artist => !crossProjectNames.has(artist.artistName));
  }

  /**
   * Check if artist is in specific project
   */
  protected isInProject(artistName: string, projectId: ProjectType): boolean {
    const projectArtists = projectId === 'phantasia1'
      ? this.phantasia1Artists()
      : this.phantasia2Artists();

    return projectArtists.some(artist => artist.artistName === artistName);
  }

  /**
   * Check if artist appears in both projects
   */
  protected isCrossProjectArtist(artistName: string): boolean {
    return this.crossProjectArtists().some(artist => artist.artistName === artistName);
  }

  /**
   * Get artist contribution count across all projects
   */
  protected getArtistContributionCount(artistName: string): number {
    const p1Tracks = this.artistCreditService.getProjectTracks('phantasia1');
    const p2Tracks = this.artistCreditService.getProjectTracks('phantasia2');

    let count = 0;

    [...p1Tracks, ...p2Tracks].forEach(track => {
      if (track.allContributions.some(contrib => contrib.artistName === artistName)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Get artist data from service
   */
  protected getArtistData(artistName: string): any {
    return this.artistCreditService.getArtistData(artistName);
  }

  /**
   * Load more artists
   */
  protected loadMoreArtists(): void {
    this.displayLimit.update(current => current + 12);
  }

  /**
   * Track by function for artist cards
   */
  protected trackByArtist(index: number, artist: ArtistContribution): string {
    return artist.artistName + artist.id;
  }

  /**
   * Handle avatar image errors
   */
  protected onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/artists/default-avatar.png';
  }
}