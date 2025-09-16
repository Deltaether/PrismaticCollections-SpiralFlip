import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import {
  ArtistCreditService,
  ProjectType,
  ProjectMetadata
} from '../../services/artist-credit.service';
import { DynamicArtistService } from '../../pages/collections/phantasia/services/dynamic-artist.service';

/**
 * Project Selector Component
 * Enables switching between Phantasia Project 1 & 2 with analytics
 */
@Component({
  selector: 'app-project-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="project-selector-container">
      <div class="project-selector-header">
        <h2 class="selector-title">Phantasia Collection</h2>
        <p class="selector-subtitle">Choose your musical journey</p>
      </div>

      <div class="projects-grid">
        <!-- Phantasia Project 1 -->
        <div
          class="project-card"
          [class.active]="currentProject() === 'phantasia1'"
          (click)="selectProject('phantasia1')"
        >
          <div class="project-header">
            <h3 class="project-title">Phantasia Project 1</h3>
            <span class="project-year">2022</span>
          </div>

          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-value">{{ phantasia1Stats().tracks }}</span>
              <span class="stat-label">Tracks</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ phantasia1Stats().artists }}</span>
              <span class="stat-label">Artists</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">370K+</span>
              <span class="stat-label">Views</span>
            </div>
          </div>

          <p class="project-description">
            The original compilation featuring diverse electronic artists and collaborative creativity.
          </p>

          <div class="project-actions">
            <button
              class="action-btn youtube-btn"
              (click)="openYouTube('phantasia1'); $event.stopPropagation()"
            >
              <span class="btn-icon">▶</span>
              YouTube
            </button>
            <button
              class="action-btn streaming-btn"
              (click)="openStreaming('phantasia1'); $event.stopPropagation()"
            >
              <span class="btn-icon">🎵</span>
              Stream
            </button>
          </div>

          @if (currentProject() === 'phantasia1') {
            <div class="active-indicator">
              <span class="indicator-text">Currently Playing</span>
            </div>
          }
        </div>

        <!-- Phantasia Project 2 -->
        <div
          class="project-card"
          [class.active]="currentProject() === 'phantasia2'"
          (click)="selectProject('phantasia2')"
        >
          <div class="project-header">
            <h3 class="project-title">Phantasia Project 2</h3>
            <span class="project-year">2024</span>
          </div>

          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-value">{{ phantasia2Stats().tracks }}</span>
              <span class="stat-label">Tracks</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ phantasia2Stats().artists }}</span>
              <span class="stat-label">Artists</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">New</span>
              <span class="stat-label">Release</span>
            </div>
          </div>

          <p class="project-description">
            The expanded sequel with orchestral collaborations and enhanced electronic compositions.
          </p>

          @if (currentProject() === 'phantasia2') {
            <div class="active-indicator">
              <span class="indicator-text">Currently Playing</span>
            </div>
          }
        </div>
      </div>

      <!-- Cross-Project Analytics -->
      <div class="analytics-section">
        <h3 class="analytics-title">Collection Overview</h3>
        <div class="analytics-grid">
          <div class="analytics-item">
            <span class="analytics-value">{{ totalUniqueArtists() }}</span>
            <span class="analytics-label">Total Unique Artists</span>
          </div>
          <div class="analytics-item">
            <span class="analytics-value">{{ crossProjectArtists() }}</span>
            <span class="analytics-label">Cross-Project Artists</span>
          </div>
          <div class="analytics-item">
            <span class="analytics-value">{{ totalTracks() }}</span>
            <span class="analytics-label">Total Tracks</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // Reactive signals
  protected readonly currentProject = signal<ProjectType>('phantasia2');
  protected readonly projectComparison = signal<any>({
    phantasia1: { artists: 0, tracks: 0, metadata: null },
    phantasia2: { artists: 0, tracks: 0, metadata: null },
    crossProjectArtists: 0,
    totalUniqueArtists: 0
  });

  // Computed values
  protected readonly phantasia1Stats = computed(() => this.projectComparison().phantasia1);
  protected readonly phantasia2Stats = computed(() => this.projectComparison().phantasia2);
  protected readonly crossProjectArtists = computed(() => this.projectComparison().crossProjectArtists);
  protected readonly totalUniqueArtists = computed(() => this.projectComparison().totalUniqueArtists);
  protected readonly totalTracks = computed(() =>
    this.projectComparison().phantasia1.tracks + this.projectComparison().phantasia2.tracks
  );

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
   * Initialize component with current project and analytics
   */
  private initializeComponent(): void {
    // Subscribe to current project changes
    this.artistCreditService.currentProject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        this.currentProject.set(project);
      });

    // Subscribe to project comparison data
    this.dynamicArtistService.getProjectComparison()
      .pipe(takeUntil(this.destroy$))
      .subscribe(comparison => {
        this.projectComparison.set(comparison);
      });
  }

  /**
   * Select and switch to a project
   */
  protected selectProject(projectId: ProjectType): void {
    if (this.currentProject() !== projectId) {
      // Update both services
      this.artistCreditService.setCurrentProject(projectId);
      this.dynamicArtistService.setCurrentProject(projectId);

      console.log(`[ProjectSelector] Switched to ${projectId}`);
    }
  }

  /**
   * Open YouTube link for project
   */
  protected openYouTube(projectId: ProjectType): void {
    const metadata = this.artistCreditService.getProjectMetadata(projectId);
    if (metadata?.youtubeUrl) {
      window.open(metadata.youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Open streaming link for project
   */
  protected openStreaming(projectId: ProjectType): void {
    const metadata = this.artistCreditService.getProjectMetadata(projectId);
    if (metadata?.streamingUrl) {
      window.open(metadata.streamingUrl, '_blank', 'noopener,noreferrer');
    }
  }
}