import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';

/**
 * Interface matching the geldb Artist schema
 */
export interface GelDbArtist {
  id: string;
  name: string;
  display_name?: string;
  bio?: string;
  country?: string;
  genre?: string;
  website?: string;
  avatar?: string;
  color?: string;
  social_links?: GelDbSocialLinks;
  created_at: string;
  updated_at: string;
}

/**
 * Interface matching the geldb SocialLinks schema
 */
export interface GelDbSocialLinks {
  id: string;
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
 * Interface for Phantasia 2 track with geldb artist integration
 */
export interface GelDbTrack {
  id: string;
  title: string;
  main_artist: GelDbArtist;
  album?: GelDbAlbum;
  track_number?: number;
  start_time_seconds?: number;
  end_time_seconds?: number;
  duration_seconds?: number;
  genre?: string;
  lyrics?: string;
  audio_file_path?: string;
  audio_file_url?: string;
  featured_artists: GelDbArtist[];
  collaborators: GelDbArtist[];
  additional_artists: GelDbArtist[];
}

/**
 * Interface matching the geldb Album schema
 */
export interface GelDbAlbum {
  id: string;
  title: string;
  artist: GelDbArtist;
  release_date?: string;
  genre?: string;
  description?: string;
  cover_art_url?: string;
  track_count?: number;
  duration_seconds?: number;
  songs: GelDbTrack[];
}

/**
 * Interface matching the geldb Collection schema
 */
export interface GelDbCollection {
  id: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  songs: GelDbTrack[];
  albums: GelDbAlbum[];
}

/**
 * Interface matching the geldb Prism schema
 */
export interface GelDbPrism {
  id: string;
  name: string;
  description?: string;
  color_scheme?: string;
  theme?: string;
  is_featured: boolean;
  collections: GelDbCollection[];
  featured_artists: GelDbArtist[];
}

/**
 * Artist avatar data structure with organized paths
 */
export interface ArtistAvatarMap {
  [artistName: string]: {
    avatarPath: string;
    displayName: string;
    color?: string;
    genre?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GelDbIntegrationService {
  private readonly phantasia2Artists$ = new BehaviorSubject<GelDbArtist[]>([]);
  private readonly phantasia2Album$ = new BehaviorSubject<GelDbAlbum | null>(null);
  private readonly prismaticCollection$ = new BehaviorSubject<GelDbPrism | null>(null);

  /**
   * Pre-organized artist avatar mapping based on file system analysis
   */
  private readonly artistAvatarMap: ArtistAvatarMap = {
    'SpiralFlip': {
      avatarPath: '/assets/images/artists/SpiralFlip.png',
      displayName: 'SpiralFlip',
      color: '#FF6B6B',
      genre: 'Electronic, Synthwave'
    },
    'eili': {
      avatarPath: '/assets/images/artists/Eili.png',
      displayName: 'eili',
      color: '#ffffff', // Changed from cyan to white for better readability
      genre: 'Vocal, Electronic'
    },
    'Ariatec': {
      avatarPath: '/assets/images/artists/Ariatec.png',
      displayName: 'Ariatec',
      color: '#45B7D1',
      genre: 'Ambient, Cinematic'
    },
    'MB': {
      avatarPath: '/assets/images/artists/MBgov.png',
      displayName: 'MBgov',
      color: '#96CEB4',
      genre: 'Orchestral, Classical'
    },
    'Iku Hoshifuri': {
      avatarPath: '/assets/images/artists/Iku Hoshifuri.png',
      displayName: 'Iku Hoshifuri',
      color: '#FFEAA7',
      genre: 'Vocal, J-Pop'
    },
    'Justin Thornburgh': {
      avatarPath: '/assets/images/artists/Justin Thornburgh.png',
      displayName: 'Justin Thornburgh',
      color: '#DDA0DD',
      genre: 'Folk, Accordion'
    },
    'v1ris': {
      avatarPath: '/assets/images/artists/v1ris.png',
      displayName: 'v1ris',
      color: '#F8B500',
      genre: 'Classical, Violin'
    },
    'Rita Kamishiro': {
      avatarPath: '/assets/images/artists/Rita Kamishiro.png',
      displayName: 'Rita Kamishiro',
      color: '#E17055',
      genre: 'Classical, Viola'
    },
    'Marcus Ho': {
      avatarPath: '/assets/images/artists/Marcus Ho.png',
      displayName: 'Marcus Ho',
      color: '#6C5CE7',
      genre: 'Classical, Cello'
    },
    'AZALI': {
      avatarPath: '/assets/images/artists/AZALI.png',
      displayName: 'AZALI',
      color: '#A29BFE',
      genre: 'Electronic, Experimental'
    },
    'Aloysius': {
      avatarPath: '/assets/images/artists/Aloysius.png',
      displayName: 'Aloysius',
      color: '#FD79A8',
      genre: 'Electronic, Ambient'
    },
    'potatoTeto': {
      avatarPath: '/assets/images/artists/potatoTeto.png',
      displayName: 'potatoTeto',
      color: '#00B894',
      genre: 'Ambient, Experimental'
    },
    'Artisan': {
      avatarPath: '/assets/images/artists/Artisan.png',
      displayName: 'Artisan',
      color: '#E84393',
      genre: 'Electronic, Melodic'
    },
    'Mei Naganowa': {
      avatarPath: '/assets/images/artists/Mei Naganowa.png',
      displayName: 'Mei Naganowa',
      color: '#00CEC9',
      genre: 'Electronic, Synthesizer V'
    },
    'Evin a\'k': {
      avatarPath: '/assets/images/artists/Evin a\'k.png',
      displayName: 'Evin a\'k',
      color: '#FDCB6E',
      genre: 'Electronic, Bass'
    },
    'BilliumMoto': {
      avatarPath: '/assets/images/artists/BilliumMoto.png',
      displayName: 'BilliumMoto',
      color: '#74B9FF',
      genre: 'Lofi, Chill'
    },
    'Elliot Hsu': {
      avatarPath: '/assets/images/artists/Elliot Hsu.png',
      displayName: 'Elliot Hsu',
      color: '#55A3FF',
      genre: 'Electronic, Ambient'
    },
    'Yuzuki': {
      avatarPath: '/assets/images/artists/Yuzuki.png',
      displayName: 'Yuzuki',
      color: '#FF7675',
      genre: 'Electronic, Synthesizer V'
    },
    'LucaProject': {
      avatarPath: '/assets/images/artists/LucaProject.png',
      displayName: 'LucaProject',
      color: '#6C5CE7',
      genre: 'Electronic, Melodic'
    },
    'Koway': {
      avatarPath: '/assets/images/artists/Koway.png',
      displayName: 'Koway',
      color: '#A29BFE',
      genre: 'Electronic, Experimental'
    },
    '伍一': {
      avatarPath: '/assets/images/artists/伍一.png',
      displayName: '伍一',
      color: '#FFEAA7',
      genre: 'Vocal, Electronic'
    },
    'Nstryder': {
      avatarPath: '/assets/images/artists/Nstryder.png',
      displayName: 'Nstryder',
      color: '#E17055',
      genre: 'Electronic, Hardcore'
    },
    'MoAE': {
      avatarPath: '/assets/images/artists/MoAE:..png',
      displayName: 'MoAE:.',
      color: '#00B894',
      genre: 'Electronic, Ambient'
    },
    'dystopian tanuki': {
      avatarPath: '/assets/images/artists/dystopian tanuki.png',
      displayName: 'dystopian tanuki',
      color: '#636E72',
      genre: 'Experimental, Ambient'
    },
    'Heem': {
      avatarPath: '/assets/images/artists/Heem.png',
      displayName: 'Heem',
      color: '#FD79A8',
      genre: 'Electronic, Melodic'
    },
    'Woojinee': {
      avatarPath: '/assets/images/artists/Woojinee.png',
      displayName: 'Woojinee',
      color: '#E84393',
      genre: 'Classical, Violin'
    },
    'Bigg Milk': {
      avatarPath: '/assets/images/artists/Bigg Milk.png',
      displayName: 'Bigg Milk',
      color: '#00CEC9',
      genre: 'Electronic, Chill'
    },
    'Gardens': {
      avatarPath: '/assets/images/artists/Gardens.png',
      displayName: 'Gardens',
      color: '#00B894',
      genre: 'Electronic, Ambient'
    },
    'Sad Keyboard Guy': {
      avatarPath: '/assets/images/artists/Sad Keyboard Guy.png',
      displayName: 'Sad Keyboard Guy',
      color: '#74B9FF',
      genre: 'Lofi, Emotional'
    },
    'Futsuunohito': {
      avatarPath: '/assets/images/artists/Futsuunohito.png',
      displayName: 'Futsuunohito',
      color: '#A29BFE',
      genre: 'Electronic, Cinematic'
    },
    'shishishiena': {
      avatarPath: '/assets/images/artists/shishishiena.png',
      displayName: 'shishishiena',
      color: '#FFEAA7',
      genre: 'Voice Acting, Vocal'
    }
  };

  constructor(private http: HttpClient) {
    this.initializeGelDbData();
  }

  /**
   * Get all Phantasia 2 artists with their avatars
   */
  getPhantasia2Artists(): Observable<GelDbArtist[]> {
    return this.phantasia2Artists$.asObservable();
  }

  /**
   * Get Phantasia 2 album data with full artist information
   */
  getPhantasia2Album(): Observable<GelDbAlbum | null> {
    return this.phantasia2Album$.asObservable();
  }

  /**
   * Get the Prismatic Collections prism data
   */
  getPrismaticCollection(): Observable<GelDbPrism | null> {
    return this.prismaticCollection$.asObservable();
  }

  /**
   * Get artist avatar path by name
   */
  getArtistAvatar(artistName: string): string {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.avatarPath || '/assets/images/artists/default-avatar.png';
  }

  /**
   * Get artist display name
   */
  getArtistDisplayName(artistName: string): string {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.displayName || artistName;
  }

  /**
   * Get artist color theme
   */
  getArtistColor(artistName: string): string {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.color || '#74B9FF';
  }

  /**
   * Get all artist avatar mappings
   */
  getArtistAvatarMap(): ArtistAvatarMap {
    return this.artistAvatarMap;
  }

  /**
   * Search artists by name or genre
   */
  searchArtists(query: string): Observable<GelDbArtist[]> {
    return this.phantasia2Artists$.pipe(
      map(artists => artists.filter(artist =>
        artist.name.toLowerCase().includes(query.toLowerCase()) ||
        artist.display_name?.toLowerCase().includes(query.toLowerCase()) ||
        artist.genre?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  /**
   * Get featured artists from Prismatic Collections
   */
  getFeaturedArtists(): Observable<GelDbArtist[]> {
    return this.prismaticCollection$.pipe(
      map(prism => prism?.featured_artists || [])
    );
  }

  /**
   * Initialize geldb data (would typically query the actual database)
   * For now, this creates mock data based on the avatar mapping
   */
  private initializeGelDbData(): void {
    try {
      // Create mock artist data based on avatar mapping
      const artists: GelDbArtist[] = Object.entries(this.artistAvatarMap).map(([name, data], index) => ({
        id: `artist-${index + 1}`,
        name,
        display_name: data.displayName,
        avatar: data.avatarPath,
        color: data.color,
        genre: data.genre,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      this.phantasia2Artists$.next(artists);

      // Create mock album data
      const phantasia2Album: GelDbAlbum = {
        id: 'phantasia-2',
        title: 'Phantasia 2',
        artist: artists.find(a => a.name === 'SpiralFlip')!,
        release_date: '2025-01-01',
        genre: 'Electronic Compilation',
        description: 'The second installment of the Phantasia compilation series',
        cover_art_url: '/assets/images/covers/phantasia2-cover.jpg',
        track_count: 20,
        duration_seconds: 4567,
        songs: [] // Would be populated with actual track data
      };

      this.phantasia2Album$.next(phantasia2Album);

      // Create mock prism data
      const prismaticCollection: GelDbPrism = {
        id: 'prismatic-collections',
        name: 'Prismatic Collections',
        description: 'A multi-faceted music collection celebrating diverse electronic artists',
        color_scheme: 'prismatic',
        theme: 'electronic-fusion',
        is_featured: true,
        collections: [],
        featured_artists: artists.slice(0, 10) // First 10 artists as featured
      };

      this.prismaticCollection$.next(prismaticCollection);

    } catch (error) {
      console.error('Failed to initialize geldb data:', error);
    }
  }

  /**
   * Refresh data from geldb (placeholder for actual database queries)
   */
  refreshData(): Observable<boolean> {
    // This would typically make HTTP requests to geldb API endpoints
    // For now, just re-initialize the mock data
    this.initializeGelDbData();
    return of(true);
  }
}