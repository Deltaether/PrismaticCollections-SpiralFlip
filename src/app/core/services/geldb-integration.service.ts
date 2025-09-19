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
 * Interface for storing Twitter user data in GelDB
 */
export interface GelDbTwitterUser {
  id: string;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url?: string;
  verified?: boolean;
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
  cached_at: string;
  updated_at: string;
}

/**
 * Interface for storing Twitter tweets in GelDB
 */
export interface GelDbTwitterTweet {
  id: string;
  tweet_id: string;
  user_id: string;
  text: string;
  created_at: string;
  retweet_count?: number;
  like_count?: number;
  reply_count?: number;
  quote_count?: number;
  hashtags: string[];
  mentions: string[];
  urls: string[];
  cached_at: string;
  updated_at: string;
}

/**
 * Interface for Twitter API usage tracking
 */
export interface GelDbTwitterApiUsage {
  id: string;
  endpoint: string;
  method: string;
  timestamp: string;
  success: boolean;
  rate_limit_remaining?: number;
  error_message?: string;
  monthly_calls_used: number;
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

  // Twitter data streams
  private readonly twitterUsers$ = new BehaviorSubject<GelDbTwitterUser[]>([]);
  private readonly twitterTweets$ = new BehaviorSubject<GelDbTwitterTweet[]>([]);
  private readonly twitterApiUsage$ = new BehaviorSubject<GelDbTwitterApiUsage[]>([]);

  /**
   * Pre-organized artist avatar mapping based on file system analysis
   */
  private readonly artistAvatarMap: ArtistAvatarMap = {
    'SpiralFlip': {
      avatarPath: '/assets/images/artists/SpiralFlip.png',
      displayName: 'SpiralFlip',
      color: '#FF6B6B',
      genre: 'Organiser'
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
      genre: 'Violinist'
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
    },

    // ====== SPECIAL MENTIONS - PRODUCTION TEAM ======
    'PliXoR': {
      avatarPath: '/assets/images/artists/PliXoR.png',
      displayName: 'PliXoR',
      color: '#ff6b6b',
      genre: 'Mastering Engineer'
    },
    'NapaL': {
      avatarPath: '/assets/images/artists/NapaL.png',
      displayName: '나팔 NapaL',
      color: '#4ecdc4',
      genre: 'Cover Illustration'
    },
    'yy_artwork': {
      avatarPath: '/assets/images/artists/yy_artwork.png',
      displayName: 'yy_artwork',
      color: '#45b7d1',
      genre: 'Logo/Jacket Design'
    },
    'Elegant Sister': {
      avatarPath: '/assets/images/artists/Elegant Sister.png',
      displayName: 'Elegant Sister',
      color: '#f7b733',
      genre: 'Album Stream MV'
    },
    'Len': {
      avatarPath: '/assets/images/artists/Len Licht.png',
      displayName: 'Len',
      color: '#5f27cd',
      genre: 'Crossfade MV/Live2D'
    },
    'Daph': {
      avatarPath: '/assets/images/artists/Daph Shoo.png',
      displayName: 'Daph',
      color: '#00d2d3',
      genre: 'Live2D'
    },
    'honabai': {
      avatarPath: '/assets/images/artists/honabai.png',
      displayName: 'honabai',
      color: '#ff9ff3',
      genre: 'Special Thanks'
    },
    'shironill': {
      avatarPath: '/assets/images/artists/shironill.png',
      displayName: 'shironill',
      color: '#f368e0',
      genre: 'Special Thanks'
    },

    // ====== PHANTASIA 2 ADDITIONAL PRODUCTION TEAM ======
    'roər': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: 'roər',
      color: '#F39C12',
      genre: 'PRODUCTION TEAM'
    },
    'TronC': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: 'TronC',
      color: '#8E44AD',
      genre: 'STAINED GLASS ILLUSTRATOR'
    },
    'Hototogisu': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: 'Hototogisu',
      color: '#E74C3C',
      genre: 'CHIBI ILLUSTRATOR'
    },
    'Len_licht': {
      avatarPath: '/assets/images/artists/Len Licht.png',
      displayName: 'Len_licht',
      color: '#5f27cd',
      genre: 'CO-ORGANISER/VIDEO EDITOR'
    },
    'Atelier Magicae': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: 'Atelier Magicae',
      color: '#9B59B6',
      genre: 'PRODUCTION TEAM'
    },
    '白｡': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: '白｡',
      color: '#BDC3C7',
      genre: 'PRODUCTION TEAM'
    },
    'Sol': {
      avatarPath: '/assets/images/artists/default-avatar.svg',
      displayName: 'Sol',
      color: '#F1C40F',
      genre: 'PRODUCTION TEAM'
    },
    'Yo Kaze': {
      avatarPath: '/assets/images/artists/YoKaze.png',
      displayName: 'Yo Kaze',
      color: '#16A085',
      genre: 'PRODUCTION TEAM'
    },

    // ====== PHANTASIA 1 ARTISTS ======
    'Prower': {
      avatarPath: '/assets/images/artists/Prower.png',
      displayName: 'Prower',
      color: '#9b59b6',
      genre: 'Electronic Producer'
    },
    'Seycara': {
      avatarPath: '/assets/images/artists/Seycara.png',
      displayName: 'Seycara',
      color: '#e74c3c',
      genre: 'Electronic Producer'
    },
    'Qyubey': {
      avatarPath: '/assets/images/artists/Qyubey.png',
      displayName: 'Qyubey',
      color: '#f39c12',
      genre: 'Electronic Producer'
    },
    'Luscinia': {
      avatarPath: '/assets/images/artists/Luscinia.png',
      displayName: 'Luscinia',
      color: '#2ecc71',
      genre: 'Electronic Producer'
    },
    'はがね': {
      avatarPath: '/assets/images/artists/Hagane.png',
      displayName: 'はがね',
      color: '#34495e',
      genre: 'Electronic Producer'
    },
    'satella': {
      avatarPath: '/assets/images/artists/satella.png',
      displayName: 'satella',
      color: '#8e44ad',
      genre: 'Electronic Producer'
    },
    'sleepy': {
      avatarPath: '/assets/images/artists/Sleepless.png',
      displayName: 'sleepy',
      color: '#B0E0E6',
      genre: 'Electronic Producer'
    },
    'tikaal': {
      avatarPath: '/assets/images/artists/tikaal.png',
      displayName: 'tikaal',
      color: '#FF9F40',
      genre: 'Bass Guitarist'
    },
    'Miyamai Moca': {
      avatarPath: '/assets/images/artists/Miyamai-Moca.png',
      displayName: 'Miyamai Moca',
      color: '#FFB347',
      genre: 'Synthesizer V Operator'
    }
  };

  constructor(private http: HttpClient) {
    this.initializeGelDbData();
    this.loadTwitterDataFromLocalStorage();
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
    return artistData?.avatarPath || '/assets/images/artists/default-avatar.svg';
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
   * Get social media links for an artist
   */
  getArtistSocialLinks(artistName: string): GelDbSocialLinks | null {
    // Social media links mapping - consolidated from services
    const socialLinksMap: Record<string, Partial<GelDbSocialLinks>> = {
      'SpiralFlip': { youtube: 'https://www.youtube.com/@SpiralFlip', carrd: 'https://spiralflip.carrd.co/' },
      'eili': { youtube: 'https://www.youtube.com/@EiliYT', twitter: 'https://x.com/frenlize' },
      'Ariatec': { youtube: 'https://www.youtube.com/@musicbyariatec', reelcrafter: 'https://play.reelcrafter.com/KLSound/port' },
      'MB': { youtube: 'https://www.youtube.com/@MBMichael', twitter: 'https://x.com/MBgov1133' },
      'Iku Hoshifuri': { youtube: 'https://www.youtube.com/@IkuHoshifuri', linktr: 'https://lit.link/en/ikuhoshifuri' },
      'AZALI': { youtube: 'https://www.youtube.com/@AZALI00013', twitter: 'https://x.com/AZALI00013' },
      'Aloysius': { youtube: 'https://www.youtube.com/@aloysius3264', twitter: 'https://x.com/Aloysiu04138577' },
      'Heem': { twitter: 'https://x.com/h_e_e__m', linktr: 'https://linktr.ee/heeem' },
      'Prower': { twitter: 'https://x.com/prowerrr_' },
      'Seycara': { twitter: 'https://x.com/Seycara', youtube: 'https://www.youtube.com/@Seycara' },
      'Qyubey': { twitter: 'https://x.com/QyubeySan', youtube: 'https://www.youtube.com/@qyubey_san' },
      'Luscinia': { twitter: 'https://x.com/LusciniaSound', youtube: 'https://www.youtube.com/@Luscinia.Nightingale' },
      'はがね': { twitter: 'https://x.com/STEEL_PLUS', youtube: 'https://www.youtube.com/@steelplus_hagane' },
      'Hagane': { twitter: 'https://x.com/STEEL_PLUS', youtube: 'https://www.youtube.com/@steelplus_hagane' },
      'LucaProject': { youtube: 'https://www.youtube.com/@lucaproject6108', twitter: 'https://x.com/LucaProject6108', carrd: 'https://lucaproject.carrd.co/' },
      'satella': { twitter: 'https://x.com/satella0w0', youtube: 'https://www.youtube.com/@satella0w0' },
      'sleepy': { twitter: 'https://x.com/sleeplessgamign' },
      'PliXoR': { twitter: 'https://x.com/plixormusic' },
      'NapaL': { twitter: 'https://x.com/Ve_Xillum' },
      'yy_artwork': { twitter: 'https://x.com/yy_artwork' },
      'Elegant Sister': { twitter: 'https://x.com/ElegantSister' },
      'Len': { twitter: 'https://x.com/Len_licht' },
      'Daph': { twitter: 'https://x.com/daphshoo' },
      'honabai': { twitter: 'https://x.com/honabai' },
      'shironill': { twitter: 'https://x.com/shironill' },
      'Woojinee': { instagram: 'https://www.instagram.com/wooj1nee/?igsh=czUwcXg3aWh6NmM5&utm_source=qr#' },
      'tikaal': { twitter: 'https://x.com/tikaal' },
      'Miyamai Moca': { twitter: 'https://x.com/ReeKDoesDTM' }
    };

    const links = socialLinksMap[artistName];
    if (!links) return null;

    return {
      id: `social-${artistName.toLowerCase().replace(/\s+/g, '-')}`,
      ...links
    } as GelDbSocialLinks;
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

  // ====== TWITTER DATA MANAGEMENT METHODS ======

  /**
   * Get cached Twitter users
   */
  getTwitterUsers(): Observable<GelDbTwitterUser[]> {
    return this.twitterUsers$.asObservable();
  }

  /**
   * Get cached Twitter tweets
   */
  getTwitterTweets(): Observable<GelDbTwitterTweet[]> {
    return this.twitterTweets$.asObservable();
  }

  /**
   * Get Twitter API usage history
   */
  getTwitterApiUsage(): Observable<GelDbTwitterApiUsage[]> {
    return this.twitterApiUsage$.asObservable();
  }

  /**
   * Cache Twitter user data
   */
  cacheTwitterUser(userData: Partial<GelDbTwitterUser> & { twitter_id: string; username: string; display_name: string }): void {
    const currentUsers = this.twitterUsers$.value;
    const existingIndex = currentUsers.findIndex(user => user.twitter_id === userData.twitter_id);

    const now = new Date().toISOString();
    const user: GelDbTwitterUser = {
      id: userData.id || `twitter_user_${userData.twitter_id}`,
      twitter_id: userData.twitter_id,
      username: userData.username,
      display_name: userData.display_name,
      profile_image_url: userData.profile_image_url,
      verified: userData.verified,
      followers_count: userData.followers_count,
      following_count: userData.following_count,
      tweet_count: userData.tweet_count,
      cached_at: now,
      updated_at: now
    };

    if (existingIndex >= 0) {
      // Update existing user
      currentUsers[existingIndex] = user;
    } else {
      // Add new user
      currentUsers.push(user);
    }

    this.twitterUsers$.next([...currentUsers]);
    this.saveTwitterDataToLocalStorage();

    console.log(`📋 Cached Twitter user: @${user.username}`);
  }

  /**
   * Cache Twitter tweets
   */
  cacheTwitterTweets(tweets: Array<Partial<GelDbTwitterTweet> & { tweet_id: string; user_id: string; text: string; created_at: string }>): void {
    const currentTweets = this.twitterTweets$.value;
    const now = new Date().toISOString();

    tweets.forEach(tweetData => {
      const existingIndex = currentTweets.findIndex(tweet => tweet.tweet_id === tweetData.tweet_id);

      // Extract hashtags, mentions, and URLs from text
      const hashtags = (tweetData.text.match(/#\w+/g) || []).map(tag => tag.substring(1));
      const mentions = (tweetData.text.match(/@\w+/g) || []).map(mention => mention.substring(1));
      const urls = (tweetData.text.match(/https?:\/\/[^\s]+/g) || []);

      const tweet: GelDbTwitterTweet = {
        id: tweetData.id || `twitter_tweet_${tweetData.tweet_id}`,
        tweet_id: tweetData.tweet_id,
        user_id: tweetData.user_id,
        text: tweetData.text,
        created_at: tweetData.created_at,
        retweet_count: tweetData.retweet_count,
        like_count: tweetData.like_count,
        reply_count: tweetData.reply_count,
        quote_count: tweetData.quote_count,
        hashtags,
        mentions,
        urls,
        cached_at: now,
        updated_at: now
      };

      if (existingIndex >= 0) {
        // Update existing tweet
        currentTweets[existingIndex] = tweet;
      } else {
        // Add new tweet
        currentTweets.push(tweet);
      }
    });

    // Sort tweets by created_at (newest first)
    currentTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    this.twitterTweets$.next([...currentTweets]);
    this.saveTwitterDataToLocalStorage();

    console.log(`📋 Cached ${tweets.length} Twitter tweets`);
  }

  /**
   * Log Twitter API usage
   */
  logTwitterApiUsage(apiCall: Partial<GelDbTwitterApiUsage> & { endpoint: string; method: string; success: boolean }): void {
    const currentUsage = this.twitterApiUsage$.value;
    const now = new Date().toISOString();

    // Calculate monthly calls used
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyCallsUsed = currentUsage.filter(call => {
      const callDate = new Date(call.timestamp);
      return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear;
    }).length + 1;

    const usage: GelDbTwitterApiUsage = {
      id: apiCall.id || `api_call_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      endpoint: apiCall.endpoint,
      method: apiCall.method,
      timestamp: now,
      success: apiCall.success,
      rate_limit_remaining: apiCall.rate_limit_remaining,
      error_message: apiCall.error_message,
      monthly_calls_used: monthlyCallsUsed
    };

    currentUsage.push(usage);

    // Keep only the last 1000 API call logs to prevent excessive memory usage
    if (currentUsage.length > 1000) {
      currentUsage.splice(0, currentUsage.length - 1000);
    }

    this.twitterApiUsage$.next([...currentUsage]);
    this.saveTwitterDataToLocalStorage();

    console.log(`📊 Logged Twitter API call: ${usage.method} ${usage.endpoint} (${usage.success ? 'Success' : 'Failed'})`);
  }

  /**
   * Get cached Twitter user by username
   */
  getCachedTwitterUser(username: string): Observable<GelDbTwitterUser | null> {
    return this.twitterUsers$.pipe(
      map(users => users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null)
    );
  }

  /**
   * Get cached tweets for a specific user
   */
  getCachedTwitterTweetsForUser(userId: string): Observable<GelDbTwitterTweet[]> {
    return this.twitterTweets$.pipe(
      map(tweets => tweets.filter(tweet => tweet.user_id === userId))
    );
  }

  /**
   * Get monthly Twitter API usage statistics
   */
  getMonthlyApiUsageStats(): Observable<{
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    successRate: number;
    remainingCalls: number;
    lastCallTimestamp: string | null;
  }> {
    return this.twitterApiUsage$.pipe(
      map(usage => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyUsage = usage.filter(call => {
          const callDate = new Date(call.timestamp);
          return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear;
        });

        const totalCalls = monthlyUsage.length;
        const successfulCalls = monthlyUsage.filter(call => call.success).length;
        const failedCalls = totalCalls - successfulCalls;
        const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
        const remainingCalls = Math.max(0, 100 - totalCalls); // 100 calls per month limit
        const lastCallTimestamp = monthlyUsage.length > 0 ? monthlyUsage[monthlyUsage.length - 1].timestamp : null;

        return {
          totalCalls,
          successfulCalls,
          failedCalls,
          successRate,
          remainingCalls,
          lastCallTimestamp
        };
      })
    );
  }

  /**
   * Check if Twitter data is cached and recent
   */
  isTwitterDataFresh(username: string, maxAgeHours: number = 24): Observable<boolean> {
    return this.getCachedTwitterUser(username).pipe(
      map(user => {
        if (!user) return false;

        const cacheAge = Date.now() - new Date(user.cached_at).getTime();
        const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds

        return cacheAge < maxAge;
      })
    );
  }

  /**
   * Clear Twitter cache
   */
  clearTwitterCache(): void {
    this.twitterUsers$.next([]);
    this.twitterTweets$.next([]);
    this.twitterApiUsage$.next([]);
    localStorage.removeItem('geldb_twitter_cache');
    console.log('🗑️ Twitter cache cleared');
  }

  /**
   * Save Twitter data to localStorage
   */
  private saveTwitterDataToLocalStorage(): void {
    try {
      const twitterData = {
        users: this.twitterUsers$.value,
        tweets: this.twitterTweets$.value,
        usage: this.twitterApiUsage$.value,
        timestamp: Date.now()
      };

      localStorage.setItem('geldb_twitter_cache', JSON.stringify(twitterData));
    } catch (error) {
      console.warn('Failed to save Twitter data to localStorage:', error);
    }
  }

  /**
   * Load Twitter data from localStorage
   */
  private loadTwitterDataFromLocalStorage(): void {
    try {
      const cached = localStorage.getItem('geldb_twitter_cache');
      if (!cached) return;

      const twitterData = JSON.parse(cached);
      const age = Date.now() - twitterData.timestamp;

      // Keep cache for 7 days
      if (age > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('geldb_twitter_cache');
        return;
      }

      this.twitterUsers$.next(twitterData.users || []);
      this.twitterTweets$.next(twitterData.tweets || []);
      this.twitterApiUsage$.next(twitterData.usage || []);

      console.log(`📋 Loaded Twitter cache: ${twitterData.users?.length || 0} users, ${twitterData.tweets?.length || 0} tweets, ${twitterData.usage?.length || 0} API calls`);

    } catch (error) {
      console.warn('Failed to load Twitter data from localStorage:', error);
      localStorage.removeItem('geldb_twitter_cache');
    }
  }
}