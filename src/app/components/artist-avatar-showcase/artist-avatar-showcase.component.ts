import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { GelDbIntegrationService, GelDbArtist, ArtistAvatarMap } from '../../core/services/geldb-integration.service';

/**
 * Component to showcase artist avatars integration with geldb
 * Demonstrates proper organization and Angular best practices
 */
@Component({
  selector: 'app-artist-avatar-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="artist-avatar-showcase">
      <div class="showcase-header">
        <h2>Phantasia 2 Artist Avatars</h2>
        <p>Integrated with GelDB Database</p>
        <div class="stats">
          <span class="stat">
            <strong>{{ artists.length }}</strong> Artists
          </span>
          <span class="stat">
            <strong>{{ avatarCount }}</strong> Avatars
          </span>
        </div>
      </div>

      <div class="artists-grid" *ngIf="artists.length > 0">
        <div
          *ngFor="let artist of artists; trackBy: trackByArtistId"
          class="artist-card"
          [style.--artist-color]="artist.color"
        >
          <div class="avatar-container">
            <img
              [src]="artist.avatar"
              [alt]="artist.display_name + ' avatar'"
              class="artist-avatar"
              (error)="onImageError($event, artist)"
              loading="lazy"
            />
            <div class="avatar-overlay">
              <span class="artist-genre">{{ artist.genre }}</span>
            </div>
          </div>

          <div class="artist-info">
            <h3 class="artist-name">{{ artist.display_name || artist.name }}</h3>
            <p class="artist-genre-text">{{ artist.genre }}</p>
            <div class="artist-meta">
              <span class="artist-id">ID: {{ artist.id }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="artists.length === 0">
        <div class="loading-spinner"></div>
        <p>Loading artist avatars...</p>
      </div>

      <div class="showcase-footer">
        <div class="avatar-map-info">
          <h3>Avatar Organization Structure</h3>
          <div class="folder-structure">
            <div class="folder-item">
              <strong>/src/assets/images/artists/</strong>
              <ul class="file-list">
                <li *ngFor="let avatarEntry of avatarMapEntries | slice:0:5">
                  {{ avatarEntry[1].avatarPath.split('/').pop() }}
                </li>
                <li *ngIf="avatarMapEntries.length > 5" class="more-items">
                  ... and {{ avatarMapEntries.length - 5 }} more files
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artist-avatar-showcase {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .showcase-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .showcase-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .showcase-header p {
      font-size: 1.1rem;
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .stat strong {
      font-size: 1.5rem;
      color: #1f2937;
      font-weight: 700;
    }

    .artists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .artist-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
    }

    .artist-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .avatar-container {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .artist-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .artist-card:hover .artist-avatar {
      transform: scale(1.05);
    }

    .avatar-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        to top,
        var(--artist-color, #667eea) 0%,
        transparent 100%
      );
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .artist-card:hover .avatar-overlay {
      opacity: 1;
    }

    .avatar-overlay .artist-genre {
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .artist-info {
      padding: 1.5rem;
    }

    .artist-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
    }

    .artist-genre-text {
      color: #6b7280;
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .artist-meta {
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .showcase-footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 2rem;
    }

    .avatar-map-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .folder-structure {
      background: #f9fafb;
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .folder-item strong {
      color: #374151;
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
    }

    .file-list {
      list-style: none;
      padding-left: 1.5rem;
      margin: 0.5rem 0 0 0;
    }

    .file-list li {
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }

    .file-list li::before {
      content: "📄 ";
      margin-right: 0.5rem;
    }

    .more-items {
      font-style: italic;
      color: #9ca3af !important;
    }

    .more-items::before {
      content: "⋯ ";
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .artist-avatar-showcase {
        padding: 1rem;
      }

      .showcase-header h2 {
        font-size: 2rem;
      }

      .artists-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1rem;
      }

      .stats {
        flex-direction: column;
        gap: 1rem;
      }

      .artist-info {
        padding: 1rem;
      }
    }
  `]
})
export class ArtistAvatarShowcaseComponent implements OnInit, OnDestroy {
  artists: GelDbArtist[] = [];
  avatarMapEntries: [string, any][] = [];
  avatarCount = 0;

  private destroy$ = new Subject<void>();

  constructor(private gelDbService: GelDbIntegrationService) {}

  ngOnInit(): void {
    this.loadArtistData();
    this.setupAvatarMapData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load artist data from geldb service
   */
  private loadArtistData(): void {
    this.gelDbService.getPhantasia2Artists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(artists => {
        this.artists = artists;
        this.avatarCount = artists.filter(artist => artist.avatar).length;
      });
  }

  /**
   * Setup avatar map data for display
   */
  private setupAvatarMapData(): void {
    const avatarMap = this.gelDbService.getArtistAvatarMap();
    this.avatarMapEntries = Object.entries(avatarMap);
  }

  /**
   * Track by function for ngFor performance
   */
  trackByArtistId(index: number, artist: GelDbArtist): string {
    return artist.id;
  }

  /**
   * Handle image load errors with fallback
   */
  onImageError(event: Event, artist: GelDbArtist): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/artists/default-avatar.png';
    console.warn(`Avatar not found for artist: ${artist.name}, using fallback`);
  }
}