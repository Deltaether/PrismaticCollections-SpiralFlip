import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArtistCreditService, ArtistContribution, ProjectType } from './artist-credit.service';

/**
 * Interface for artist display on socials page
 */
export interface SocialsArtist {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly role: string;
  readonly description: string;
  readonly avatar: string;
  readonly color: string;
  readonly socialLinks: ArtistSocialLinks;
  readonly projects: ProjectType[];
  readonly trackCount: number;
  readonly isMainArtist: boolean;
  readonly isFeatured: boolean;
  readonly bio?: string;
}

/**
 * Interface for social media links
 */
export interface ArtistSocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  carrd?: string;
  linktr?: string;
  bandcamp?: string;
  reelcrafter?: string;
  twitch?: string;
}

/**
 * Filter options for artist display
 */
export interface ArtistFilter {
  project?: ProjectType | 'all';
  role?: string | 'all';
  hasLinks?: boolean;
  minTracks?: number;
}

/**
 * Comprehensive Artist Service for Socials Page
 *
 * Provides unified access to all Prismatic Collections artists
 * across both Phantasia projects with filtering and organization
 */
@Injectable({
  providedIn: 'root'
})
export class ComprehensiveArtistService {
  private readonly allArtistsSubject = new BehaviorSubject<SocialsArtist[]>([]);
  private readonly filterSubject = new BehaviorSubject<ArtistFilter>({ project: 'all' });

  // Public observables
  public readonly allArtists$ = this.allArtistsSubject.asObservable();
  public readonly currentFilter$ = this.filterSubject.asObservable();

  // Filtered artists observable
  public readonly filteredArtists$ = this.allArtists$.pipe(
    map(artists => this.applyFilter(artists, this.filterSubject.value))
  );

  constructor(private readonly artistCreditService: ArtistCreditService) {
    this.initializeArtists();
  }

  /**
   * Initialize comprehensive artist data
   */
  private initializeArtists(): void {
    const allArtistContributions = this.artistCreditService.getAllArtistsAllProjects();
    const socialsArtists = this.convertToSocialsArtists(allArtistContributions);
    this.allArtistsSubject.next(socialsArtists);
  }

  /**
   * Convert artist contributions to socials artist format
   */
  private convertToSocialsArtists(contributions: ArtistContribution[]): SocialsArtist[] {
    // Group contributions by artist name
    const artistMap = new Map<string, ArtistContribution[]>();

    contributions.forEach(contribution => {
      const existing = artistMap.get(contribution.artistName) || [];
      existing.push(contribution);
      artistMap.set(contribution.artistName, existing);
    });

    // Convert to socials artists
    const socialsArtists: SocialsArtist[] = [];

    artistMap.forEach((artistContributions, artistName) => {
      const primaryContribution = artistContributions[0];

      // Determine projects this artist appears in
      const projects = this.getArtistProjects(artistName);

      // Count tracks
      const trackCount = artistContributions.length;

      // Determine primary role
      const role = this.determinePrimaryRole(artistContributions);

      // Create description based on contributions
      const description = this.generateArtistDescription(artistContributions, projects);

      const socialsArtist: SocialsArtist = {
        id: this.generateArtistId(artistName),
        name: artistName,
        displayName: primaryContribution.artistDisplayName,
        role,
        description,
        avatar: primaryContribution.avatar || this.getDefaultAvatar(artistName),
        color: primaryContribution.color,
        socialLinks: primaryContribution.socialLinks,
        projects,
        trackCount,
        isMainArtist: this.isMainArtist(artistContributions),
        isFeatured: this.isFeatured(artistContributions),
        bio: this.getArtistBio(artistName)
      };

      socialsArtists.push(socialsArtist);
    });

    // Sort by importance: main artists first, then by track count, then alphabetically
    return socialsArtists.sort((a, b) => {
      if (a.isMainArtist && !b.isMainArtist) return -1;
      if (!a.isMainArtist && b.isMainArtist) return 1;
      if (a.trackCount !== b.trackCount) return b.trackCount - a.trackCount;
      return a.displayName.localeCompare(b.displayName);
    });
  }

  /**
   * Get projects an artist appears in
   */
  private getArtistProjects(artistName: string): ProjectType[] {
    const phantasia1Artists = this.artistCreditService.getProjectArtists('phantasia1');
    const phantasia2Artists = this.artistCreditService.getProjectArtists('phantasia2');

    const projects: ProjectType[] = [];

    if (phantasia1Artists.some(a => a.artistName === artistName)) {
      projects.push('phantasia1');
    }

    if (phantasia2Artists.some(a => a.artistName === artistName)) {
      projects.push('phantasia2');
    }

    return projects;
  }

  /**
   * Determine primary role for an artist
   */
  private determinePrimaryRole(contributions: ArtistContribution[]): string {
    const roleCounts = new Map<string, number>();

    contributions.forEach(contribution => {
      const count = roleCounts.get(contribution.role) || 0;
      roleCounts.set(contribution.role, count + 1);
    });

    // Find most common role
    let primaryRole = 'Artist';
    let maxCount = 0;

    roleCounts.forEach((count, role) => {
      if (count > maxCount) {
        maxCount = count;
        primaryRole = role;
      }
    });

    return primaryRole;
  }

  /**
   * Generate artist description based on contributions
   */
  private generateArtistDescription(contributions: ArtistContribution[], projects: ProjectType[]): string {
    const roles = Array.from(new Set(contributions.map(c => c.role)));
    const projectNames = projects.map(p => p === 'phantasia1' ? 'Phantasia 1' : 'Phantasia 2');

    let description = `Contributing as ${roles.slice(0, 2).join(' and ')}`;
    if (roles.length > 2) {
      description += ` among other roles`;
    }

    description += ` across ${projectNames.join(' and ')}.`;

    if (contributions.length > 1) {
      description += ` Featured on ${contributions.length} tracks.`;
    }

    return description;
  }

  /**
   * Check if artist is a main artist
   */
  private isMainArtist(contributions: ArtistContribution[]): boolean {
    return contributions.some(c =>
      c.role === 'Main Artist' ||
      c.participationType === 'Primary'
    );
  }

  /**
   * Check if artist is featured
   */
  private isFeatured(contributions: ArtistContribution[]): boolean {
    return contributions.some(c =>
      c.role === 'Featured Artist' ||
      c.participationType === 'Featured'
    );
  }

  /**
   * Get artist bio from the service
   */
  private getArtistBio(artistName: string): string | undefined {
    const artistData = this.artistCreditService.getArtistData(artistName);
    return artistData?.bio;
  }

  /**
   * Generate default avatar if none exists
   */
  private getDefaultAvatar(artistName: string): string {
    return `assets/images/artists/default-avatar.svg`;
  }

  /**
   * Generate consistent artist ID
   */
  private generateArtistId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  /**
   * Apply filter to artists list
   */
  private applyFilter(artists: SocialsArtist[], filter: ArtistFilter): SocialsArtist[] {
    return artists.filter(artist => {
      // Project filter
      if (filter.project && filter.project !== 'all') {
        if (!artist.projects.includes(filter.project)) {
          return false;
        }
      }

      // Role filter
      if (filter.role && filter.role !== 'all') {
        if (artist.role !== filter.role) {
          return false;
        }
      }

      // Has links filter
      if (filter.hasLinks) {
        const hasLinks = Object.values(artist.socialLinks).some(link => link && link.length > 0);
        if (!hasLinks) {
          return false;
        }
      }

      // Minimum tracks filter
      if (filter.minTracks && artist.trackCount < filter.minTracks) {
        return false;
      }

      return true;
    });
  }

  // ====== PUBLIC METHODS ======

  /**
   * Get all artists
   */
  getAllArtists(): Observable<SocialsArtist[]> {
    return this.allArtists$;
  }

  /**
   * Get filtered artists
   */
  getFilteredArtists(): Observable<SocialsArtist[]> {
    return this.filteredArtists$;
  }

  /**
   * Set filter for artists
   */
  setFilter(filter: ArtistFilter): void {
    this.filterSubject.next(filter);
  }

  /**
   * Get main artists (those with primary contributions)
   */
  getMainArtists(): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist => artist.isMainArtist))
    );
  }

  /**
   * Get featured artists
   */
  getFeaturedArtists(): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist => artist.isFeatured))
    );
  }

  /**
   * Get artists by project
   */
  getArtistsByProject(project: ProjectType): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist => artist.projects.includes(project)))
    );
  }

  /**
   * Get cross-project artists
   */
  getCrossProjectArtists(): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist => artist.projects.length > 1))
    );
  }

  /**
   * Get artists with social links
   */
  getArtistsWithSocialLinks(): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist =>
        Object.values(artist.socialLinks).some(link => link && link.length > 0)
      ))
    );
  }

  /**
   * Search artists by name
   */
  searchArtists(query: string): Observable<SocialsArtist[]> {
    return this.allArtists$.pipe(
      map(artists => artists.filter(artist =>
        artist.name.toLowerCase().includes(query.toLowerCase()) ||
        artist.displayName.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Get available roles for filtering
   */
  getAvailableRoles(): Observable<string[]> {
    return this.allArtists$.pipe(
      map(artists => {
        const roles = new Set(artists.map(artist => artist.role));
        return Array.from(roles).sort();
      })
    );
  }

  /**
   * Get project statistics
   */
  getProjectStatistics(): Observable<{
    phantasia1: { artists: number; mainArtists: number; featured: number };
    phantasia2: { artists: number; mainArtists: number; featured: number };
    crossProject: number;
    totalUnique: number;
  }> {
    return this.allArtists$.pipe(
      map(artists => {
        const phantasia1Artists = artists.filter(a => a.projects.includes('phantasia1'));
        const phantasia2Artists = artists.filter(a => a.projects.includes('phantasia2'));
        const crossProjectArtists = artists.filter(a => a.projects.length > 1);

        return {
          phantasia1: {
            artists: phantasia1Artists.length,
            mainArtists: phantasia1Artists.filter(a => a.isMainArtist).length,
            featured: phantasia1Artists.filter(a => a.isFeatured).length
          },
          phantasia2: {
            artists: phantasia2Artists.length,
            mainArtists: phantasia2Artists.filter(a => a.isMainArtist).length,
            featured: phantasia2Artists.filter(a => a.isFeatured).length
          },
          crossProject: crossProjectArtists.length,
          totalUnique: artists.length
        };
      })
    );
  }
}