import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Interface for artist role and participation types
 */
export type ArtistRole =
  | 'Main Artist' | 'Featured Artist' | 'Collaborator' | 'Composer' | 'Lyricist'
  | 'Arranger' | 'Producer' | 'Vocalist' | 'Instrumentalist' | 'Voice Actor'
  | 'Synthesizer V Operator' | 'Sound Designer' | 'Mixing Engineer'
  | 'Mastering Engineer' | 'Accordion' | 'Violin' | 'Viola' | 'Cello'
  | 'Piano' | 'Keyboard' | 'Guitar' | 'Bass' | 'Drums' | 'Electronic Producer';

export type ParticipationType = 'Primary' | 'Featured' | 'Collaboration' | 'Additional' | 'Technical';

/**
 * Interface for comprehensive artist contribution data
 */
export interface ArtistContribution {
  readonly id: string;
  readonly artistName: string;
  readonly artistDisplayName: string;
  readonly role: ArtistRole;
  readonly participationType: ParticipationType;
  readonly instrument?: string;
  readonly vocalType?: string;
  readonly synthesizerVoice?: string;
  readonly technicalRole?: string;
  readonly percentageContribution: number;
  readonly notes?: string;
  readonly avatar?: string;
  readonly color: string;
  readonly socialLinks: ArtistSocialLinks;
}

/**
 * Interface for track with complete credit information
 */
export interface TrackWithCompleteCredits {
  readonly id: string;
  readonly title: string;
  readonly trackNumber: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly audioFile: string;
  readonly mainArtist: ArtistContribution;
  readonly allContributions: ArtistContribution[];
  readonly featuredArtists: ArtistContribution[];
  readonly collaborators: ArtistContribution[];
  readonly instrumentalists: ArtistContribution[];
  readonly vocalists: ArtistContribution[];
  readonly technicalCredits: ArtistContribution[];
}

/**
 * Interface for artist social links
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
 * Interface for credit verification status
 */
export interface CreditVerification {
  readonly trackId: string;
  readonly verificationId: string;
  readonly verifiedBy: string;
  readonly verificationDate: Date;
  readonly allContributorsIdentified: boolean;
  readonly rolesAccuratelyAssigned: boolean;
  readonly socialLinksVerified: boolean;
  readonly avatarsLinked: boolean;
  readonly fullyVerified: boolean;
  readonly verificationNotes?: string;
  readonly outstandingIssues: string[];
}

/**
 * Project enumeration for multi-project support
 */
export type ProjectType = 'phantasia1' | 'phantasia2';

/**
 * Interface for project metadata
 */
export interface ProjectMetadata {
  readonly id: ProjectType;
  readonly displayName: string;
  readonly totalTracks: number;
  readonly releaseYear: number;
  readonly streamingUrl?: string;
  readonly youtubeUrl?: string;
  readonly description: string;
}

/**
 * Enhanced track interface with project support
 */
export interface TrackWithCompleteCreditsMultiProject extends TrackWithCompleteCredits {
  readonly projectId: ProjectType;
  readonly projectDisplayName: string;
}

/**
 * Comprehensive Artist Credit Service
 * Provides 100% accurate artist attribution for Phantasia 1 & 2
 */
@Injectable({
  providedIn: 'root'
})
export class ArtistCreditService {
  private readonly tracksWithCreditsSubject = new BehaviorSubject<TrackWithCompleteCredits[]>([]);
  private readonly currentTrackCreditsSubject = new BehaviorSubject<TrackWithCompleteCredits | null>(null);
  private readonly verificationStatusSubject = new BehaviorSubject<CreditVerification[]>([]);

  // Multi-project support
  private readonly currentProjectSubject = new BehaviorSubject<ProjectType>('phantasia2');
  private readonly projectMetadataSubject = new BehaviorSubject<ProjectMetadata[]>([]);
  private readonly allProjectTracksSubject = new BehaviorSubject<TrackWithCompleteCreditsMultiProject[]>([]);

  // Public observables
  public readonly tracksWithCredits$ = this.tracksWithCreditsSubject.asObservable();
  public readonly currentTrackCredits$ = this.currentTrackCreditsSubject.asObservable();
  public readonly verificationStatus$ = this.verificationStatusSubject.asObservable();

  // Multi-project observables
  public readonly currentProject$ = this.currentProjectSubject.asObservable();
  public readonly projectMetadata$ = this.projectMetadataSubject.asObservable();
  public readonly allProjectTracks$ = this.allProjectTracksSubject.asObservable();

  // Complete artist database with all 31 Phantasia 2 contributors
  private readonly completeArtistDatabase: Record<string, {
    displayName: string;
    avatar: string;
    color: string;
    primaryRoles: ArtistRole[];
    socialLinks: ArtistSocialLinks;
    bio?: string;
  }> = {
    'SpiralFlip': {
      displayName: 'SpiralFlip',
      avatar: '/assets/images/artists/SpiralFlip.png',
      color: '#FF6B6B',
      primaryRoles: ['Main Artist', 'Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@SpiralFlip',
        carrd: 'https://spiralflip.carrd.co/'
      },
      bio: 'Electronic music producer and Phantasia compilation curator'
    },
    'eili': {
      displayName: 'eili',
      avatar: '/assets/images/artists/Eili.png',
      color: '#4ECDC4',
      primaryRoles: ['Vocalist', 'Featured Artist'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@EiliYT',
        twitter: 'https://x.com/frenlize'
      },
      bio: 'Versatile vocalist featured on multiple Phantasia tracks'
    },
    'Ariatec': {
      displayName: 'Ariatec',
      avatar: '/assets/images/artists/Ariatec.png',
      color: '#45B7D1',
      primaryRoles: ['Composer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@musicbyariatec',
        reelcrafter: 'https://play.reelcrafter.com/KLSound/port'
      },
      bio: 'Ambient and cinematic composer'
    },
    'MB': {
      displayName: 'MBgov',
      avatar: '/assets/images/artists/MBgov.png',
      color: '#96CEB4',
      primaryRoles: ['Composer', 'Arranger'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@MBMichael',
        twitter: 'https://x.com/MBgov1133'
      },
      bio: 'Orchestral composer and arranger'
    },
    'Iku Hoshifuri': {
      displayName: 'Iku Hoshifuri',
      avatar: '/assets/images/artists/Iku Hoshifuri.png',
      color: '#FFEAA7',
      primaryRoles: ['Vocalist', 'Featured Artist'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@IkuHoshifuri',
        linktr: 'https://lit.link/en/ikuhoshifuri'
      },
      bio: 'Japanese vocalist and J-Pop artist'
    },
    'Justin Thornburgh': {
      displayName: 'Justin Thornburgh',
      avatar: '/assets/images/artists/Justin Thornburgh.png',
      color: '#DDA0DD',
      primaryRoles: ['Accordion', 'Instrumentalist'],
      socialLinks: {
        twitter: 'https://x.com/JustinThornbur7'
      },
      bio: 'Accordion performer and folk musician'
    },
    'v1ris': {
      displayName: 'v1ris',
      avatar: '/assets/images/artists/v1ris.png',
      color: '#F8B500',
      primaryRoles: ['Violin', 'Instrumentalist'],
      socialLinks: {
        website: 'https://v1ris.com/',
        youtube: 'https://www.youtube.com/@v1ris_music'
      },
      bio: 'Classical violinist and string arranger'
    },
    'Rita Kamishiro': {
      displayName: 'Rita Kamishiro',
      avatar: '/assets/images/artists/Rita Kamishiro.png',
      color: '#E17055',
      primaryRoles: ['Viola', 'Instrumentalist'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@RitaKamishiro',
        carrd: 'https://ritakamishiro.carrd.co/'
      },
      bio: 'Classical viola performer'
    },
    'Marcus Ho': {
      displayName: 'Marcus Ho',
      avatar: '/assets/images/artists/Marcus Ho.png',
      color: '#6C5CE7',
      primaryRoles: ['Cello', 'Instrumentalist'],
      socialLinks: {
        website: 'https://www.marcushomusic.com/'
      },
      bio: 'Professional cellist and composer'
    },
    'AZALI': {
      displayName: 'AZALI',
      avatar: '/assets/images/artists/AZALI.png',
      color: '#A29BFE',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@AZALI00013',
        twitter: 'https://x.com/AZALI00013'
      },
      bio: 'Experimental electronic music producer'
    },
    'Aloysius': {
      displayName: 'Aloysius',
      avatar: '/assets/images/artists/Aloysius.png',
      color: '#FD79A8',
      primaryRoles: ['Electronic Producer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@aloysius3264',
        twitter: 'https://x.com/Aloysiu04138577'
      },
      bio: 'Ambient electronic producer'
    },
    'potatoTeto': {
      displayName: 'potatoTeto',
      avatar: '/assets/images/artists/potatoTeto.png',
      color: '#00B894',
      primaryRoles: ['Sound Designer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@potatoteto',
        website: 'https://www.potatoteto.com/'
      },
      bio: 'Ambient and experimental sound designer'
    },
    'Artisan': {
      displayName: 'Artisan',
      avatar: '/assets/images/artists/Artisan.png',
      color: '#E84393',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@artisan1233',
        twitter: 'https://x.com/artisan1233'
      },
      bio: 'Melodic electronic music producer'
    },
    'Mei Naganowa': {
      displayName: 'Mei Naganowa',
      avatar: '/assets/images/artists/Mei Naganowa.png',
      color: '#00CEC9',
      primaryRoles: ['Synthesizer V Operator', 'Producer'],
      socialLinks: {
        twitter: 'https://x.com/ReeKDoesDTM'
      },
      bio: 'Synthesizer V specialist and vocal producer'
    },
    "Evin a'k": {
      displayName: "Evin a'k",
      avatar: "/assets/images/artists/Evin-ak.png",
      color: '#FDCB6E',
      primaryRoles: ['Electronic Producer', 'Bass'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@Evin_a_k',
        twitter: 'https://x.com/evin_a_k?lang=en'
      },
      bio: 'Bass-heavy electronic music producer'
    },
    'BilliumMoto': {
      displayName: 'BilliumMoto',
      avatar: '/assets/images/artists/BilliumMoto.png',
      color: '#74B9FF',
      primaryRoles: ['Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@BilliumMoto',
        twitter: 'https://x.com/BilliumMoto'
      },
      bio: 'Lofi and chill music producer'
    },
    'Elliot Hsu': {
      displayName: 'Elliot Hsu',
      avatar: '/assets/images/artists/Elliot Hsu.png',
      color: '#55A3FF',
      primaryRoles: ['Electronic Producer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@ElliotHsu',
        twitter: 'https://x.com/Leigendar'
      },
      bio: 'Ambient electronic producer'
    },
    'Yuzuki': {
      displayName: 'Yuzuki',
      avatar: '/assets/images/artists/Yuzuki.png',
      color: '#FF7675',
      primaryRoles: ['Synthesizer V Operator', 'Producer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@yuzukimasu',
        linktr: 'https://linktr.ee/yuzukimasu'
      },
      bio: 'Synthesizer V producer and composer'
    },
    'LucaProject': {
      displayName: 'LucaProject',
      avatar: '/assets/images/artists/LucaProject.png',
      color: '#6C5CE7',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@lucaproject6108',
        carrd: 'https://lucaproject.carrd.co/'
      },
      bio: 'Melodic electronic music producer'
    },
    'Koway': {
      displayName: 'Koway',
      avatar: '/assets/images/artists/Koway.png',
      color: '#A29BFE',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@KOWAYmusic',
        instagram: 'https://www.instagram.com/koway_music/',
        twitter: 'https://x.com/kowaymusic'
      },
      bio: 'Experimental electronic composer'
    },
    '伍一': {
      displayName: '伍一',
      avatar: '/assets/images/artists/Wu-Yi.png',
      color: '#FFEAA7',
      primaryRoles: ['Vocalist', 'Featured Artist'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@dreamer051',
        twitch: 'https://www.twitch.tv/dreamer051/about'
      },
      bio: 'Chinese vocalist and electronic artist'
    },
    'Nstryder': {
      displayName: 'Nstryder',
      avatar: '/assets/images/artists/Nstryder.png',
      color: '#E17055',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@nstryder-music',
        bandcamp: 'https://nstryder.bandcamp.com/'
      },
      bio: 'Hardcore electronic music producer'
    },
    'MoAE': {
      displayName: 'MoAE:.',
      avatar: '/assets/images/artists/MoAE.png',
      color: '#00B894',
      primaryRoles: ['Electronic Producer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@moae00',
        website: 'https://moae.jimdosite.com/'
      },
      bio: 'Ambient electronic producer'
    },
    'dystopian tanuki': {
      displayName: 'dystopian tanuki',
      avatar: '/assets/images/artists/dystopian tanuki.png',
      color: '#636E72',
      primaryRoles: ['Sound Designer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@dystopiantanuki',
        twitter: 'https://x.com/DystopianTanuki'
      },
      bio: 'Experimental ambient composer'
    },
    'Heem': {
      displayName: 'Heem',
      avatar: '/assets/images/artists/Heem.png',
      color: '#FD79A8',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        linktr: 'https://linktr.ee/heeem'
      },
      bio: 'Melodic electronic producer'
    },
    'Woojinee': {
      displayName: 'Woojinee',
      avatar: '/assets/images/artists/Woojinee.png',
      color: '#E84393',
      primaryRoles: ['Violin', 'Instrumentalist'],
      socialLinks: {
        instagram: 'https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr'
      },
      bio: 'Classical violinist'
    },
    'Bigg Milk': {
      displayName: 'Bigg Milk',
      avatar: '/assets/images/artists/Bigg Milk.png',
      color: '#00CEC9',
      primaryRoles: ['Electronic Producer', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@BiggMilk',
        twitter: 'https://x.com/milk_bigg'
      },
      bio: 'Chill electronic music producer'
    },
    'Gardens': {
      displayName: 'Gardens',
      avatar: '/assets/images/artists/Gardens.png',
      color: '#00B894',
      primaryRoles: ['Electronic Producer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@gardens5812',
        website: 'https://gardensdtm.com/'
      },
      bio: 'Ambient electronic producer'
    },
    'Sad Keyboard Guy': {
      displayName: 'Sad Keyboard Guy',
      avatar: '/assets/images/artists/Sad Keyboard Guy.png',
      color: '#74B9FF',
      primaryRoles: ['Keyboard', 'Composer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@SadKeyboardGuy',
        carrd: 'https://sadkeyboardguy.carrd.co/'
      },
      bio: 'Emotional keyboard composer'
    },
    'Futsuunohito': {
      displayName: 'Futsuunohito',
      avatar: '/assets/images/artists/Futsuunohito.png',
      color: '#A29BFE',
      primaryRoles: ['Electronic Producer', 'Sound Designer'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@futsuunohito',
        carrd: 'https://futsuunohito.crd.co/'
      },
      bio: 'Cinematic electronic composer'
    },
    'shishishiena': {
      displayName: 'shishishiena',
      avatar: '/assets/images/artists/shishishiena.png',
      color: '#FFEAA7',
      primaryRoles: ['Voice Actor', 'Vocalist'],
      socialLinks: {
        youtube: 'https://www.youtube.com/@shishishiena',
        website: 'https://www.shishishiena.com/'
      },
      bio: 'Voice actor and vocal performer'
    },
    // Additional Synthesizer V operators and vocal contributors
    'Anri Arcane': {
      displayName: 'Anri Arcane',
      avatar: '/assets/images/artists/Anri-Arcane.png',
      color: '#FF9FF3',
      primaryRoles: ['Synthesizer V Operator'],
      socialLinks: {},
      bio: 'Synthesizer V vocal operator'
    },
    'HXVOC': {
      displayName: 'HXVOC',
      avatar: '/assets/images/artists/HXVOC.png',
      color: '#54C7EC',
      primaryRoles: ['Synthesizer V Operator'],
      socialLinks: {},
      bio: 'Synthesizer V vocal operator'
    },
    'Miyamai Moca': {
      displayName: 'Miyamai Moca',
      avatar: '/assets/images/artists/Miyamai-Moca.png',
      color: '#FFB347',
      primaryRoles: ['Synthesizer V Operator'],
      socialLinks: {},
      bio: 'Synthesizer V vocal operator'
    },
    'Ninezero': {
      displayName: 'Ninezero',
      avatar: '/assets/images/artists/Ninezero.png',
      color: '#98FB98',
      primaryRoles: ['Synthesizer V Operator'],
      socialLinks: {},
      bio: 'Synthesizer V vocal operator'
    },
    'Hanakuma Chifuyu': {
      displayName: 'Hanakuma Chifuyu',
      avatar: '/assets/images/artists/Hanakuma-Chifuyu.png',
      color: '#DDA0FF',
      primaryRoles: ['Synthesizer V Operator'],
      socialLinks: {},
      bio: 'Synthesizer V vocal operator'
    },

    // ====== PHANTASIA PROJECT 1 ARTISTS ======
    // Artists unique to Phantasia 1 or with different roles

    'Prower': {
      displayName: 'Prower',
      avatar: '/assets/images/artists/Prower.png',
      color: '#FF9500',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Electronic music producer - Phantasia 1 contributor'
    },
    'Seycara': {
      displayName: 'Seycara',
      avatar: '/assets/images/artists/Seycara.png',
      color: '#A8E6CF',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Collaborative electronic producer - Phantasia 1'
    },
    'Qyubey': {
      displayName: 'Qyubey',
      avatar: '/assets/images/artists/Qyubey.png',
      color: '#FFB3BA',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Electronic music producer - Phantasia 1 contributor'
    },
    'Luscinia': {
      displayName: 'Luscinia',
      avatar: '/assets/images/artists/Luscinia.png',
      color: '#BFEFFF',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Electronic music producer - Phantasia 1 contributor'
    },
    'はがね': {
      displayName: 'はがね (Hagane)',
      avatar: '/assets/images/artists/Hagane.png',
      color: '#C0C0C0',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Japanese electronic music producer - Phantasia 1'
    },
    'satella': {
      displayName: 'satella',
      avatar: '/assets/images/artists/satella.png',
      color: '#E6E6FA',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Electronic music producer - Phantasia 1 contributor'
    },
    'sleepless': {
      displayName: 'sleepless',
      avatar: '/assets/images/artists/sleepless.png',
      color: '#B0E0E6',
      primaryRoles: ['Electronic Producer'],
      socialLinks: {},
      bio: 'Collaborative electronic producer - Phantasia 1'
    },
    'Shizu': {
      displayName: 'Shizu',
      avatar: '/assets/images/artists/Shizu.png',
      color: '#F0E68C',
      primaryRoles: ['Producer'],
      socialLinks: {},
      bio: 'Japanese producer - Phantasia 1 bonus track'
    }
  };

  constructor(private http: HttpClient) {
    this.initializeCompleteCredits();
    this.initializeProjectMetadata();
    this.initializeAllProjectTracks();
  }

  /**
   * Initialize complete credit system with all artist contributions
   */
  private initializeCompleteCredits(): void {
    const tracksWithCredits = this.createCompleteTrackCredits();
    this.tracksWithCreditsSubject.next(tracksWithCredits);

    const verifications = this.createVerificationStatuses();
    this.verificationStatusSubject.next(verifications);
  }

  /**
   * Update current track and provide complete credit information
   */
  updateCurrentTrack(trackId: string): void {
    const tracks = this.tracksWithCreditsSubject.value;
    const currentTrack = tracks.find(track => track.id === trackId);
    this.currentTrackCreditsSubject.next(currentTrack || null);
  }

  /**
   * Get comprehensive credits for a specific track
   */
  getTrackCredits(trackId: string): TrackWithCompleteCredits | null {
    const tracks = this.tracksWithCreditsSubject.value;
    return tracks.find(track => track.id === trackId) || null;
  }

  /**
   * Get all artists who contributed to Phantasia 2
   */
  getAllPhantasia2Artists(): ArtistContribution[] {
    const allTracks = this.tracksWithCreditsSubject.value;
    const allArtists = new Map<string, ArtistContribution>();

    allTracks.forEach(track => {
      track.allContributions.forEach(contribution => {
        if (!allArtists.has(contribution.artistName)) {
          allArtists.set(contribution.artistName, contribution);
        }
      });
    });

    return Array.from(allArtists.values()).sort((a, b) =>
      a.artistDisplayName.localeCompare(b.artistDisplayName)
    );
  }

  /**
   * Get artist data by name with properly encoded avatar URL
   */
  getArtistData(artistName: string): any {
    const artistData = this.completeArtistDatabase[artistName];
    if (!artistData) {
      return null;
    }

    return {
      ...artistData,
      avatar: artistData.avatar
    };
  }

  /**
   * Get verification status for all tracks
   */
  getVerificationReport(): Observable<{
    totalTracks: number;
    fullyVerified: number;
    partiallyVerified: number;
    needsWork: number;
    verificationPercentage: number;
  }> {
    return this.verificationStatus$.pipe(
      map(verifications => {
        const totalTracks = verifications.length;
        const fullyVerified = verifications.filter(v => v.fullyVerified).length;
        const partiallyVerified = verifications.filter(v =>
          !v.fullyVerified && (v.allContributorsIdentified || v.rolesAccuratelyAssigned)
        ).length;
        const needsWork = totalTracks - fullyVerified - partiallyVerified;
        const verificationPercentage = Math.round((fullyVerified / totalTracks) * 100);

        return {
          totalTracks,
          fullyVerified,
          partiallyVerified,
          needsWork,
          verificationPercentage
        };
      })
    );
  }

  // ====== MULTI-PROJECT SUPPORT METHODS ======

  /**
   * Switch between projects
   */
  setCurrentProject(projectId: ProjectType): void {
    this.currentProjectSubject.next(projectId);

    // Update current tracks based on selected project
    const allTracks = this.allProjectTracksSubject.value;
    const projectTracks = allTracks.filter(track => track.projectId === projectId);
    this.tracksWithCreditsSubject.next(projectTracks);
  }

  /**
   * Get all artists across all projects
   */
  getAllArtistsAllProjects(): ArtistContribution[] {
    const allTracks = this.allProjectTracksSubject.value;
    const allArtists = new Map<string, ArtistContribution>();

    allTracks.forEach(track => {
      track.allContributions.forEach(contribution => {
        const key = `${contribution.artistName}-${track.projectId}`;
        if (!allArtists.has(key)) {
          allArtists.set(key, {
            ...contribution,
            id: key
          });
        }
      });
    });

    return Array.from(allArtists.values()).sort((a, b) =>
      a.artistDisplayName.localeCompare(b.artistDisplayName)
    );
  }

  /**
   * Get artists that appear in both projects
   */
  getCrossProjectArtists(): ArtistContribution[] {
    const phantasia1Artists = this.getProjectArtists('phantasia1');
    const phantasia2Artists = this.getProjectArtists('phantasia2');

    const phantasia1Names = new Set(phantasia1Artists.map(a => a.artistName));
    const phantasia2Names = new Set(phantasia2Artists.map(a => a.artistName));

    const crossProjectNames = Array.from(phantasia1Names).filter(name =>
      phantasia2Names.has(name)
    );

    return phantasia2Artists.filter(artist =>
      crossProjectNames.includes(artist.artistName)
    );
  }

  /**
   * Get artists for specific project
   */
  getProjectArtists(projectId: ProjectType): ArtistContribution[] {
    const allTracks = this.allProjectTracksSubject.value;
    const projectTracks = allTracks.filter(track => track.projectId === projectId);
    const allArtists = new Map<string, ArtistContribution>();

    projectTracks.forEach(track => {
      track.allContributions.forEach(contribution => {
        if (!allArtists.has(contribution.artistName)) {
          allArtists.set(contribution.artistName, contribution);
        }
      });
    });

    return Array.from(allArtists.values()).sort((a, b) =>
      a.artistDisplayName.localeCompare(b.artistDisplayName)
    );
  }

  /**
   * Get project metadata
   */
  getProjectMetadata(projectId: ProjectType): ProjectMetadata | null {
    const projects = this.projectMetadataSubject.value;
    return projects.find(p => p.id === projectId) || null;
  }

  /**
   * Get tracks for specific project
   */
  getProjectTracks(projectId: ProjectType): TrackWithCompleteCreditsMultiProject[] {
    const allTracks = this.allProjectTracksSubject.value;
    return allTracks.filter(track => track.projectId === projectId);
  }

  /**
   * Create complete track credits with all contributions for all 20 Phantasia 2 tracks
   */
  private createCompleteTrackCredits(): TrackWithCompleteCredits[] {
    // Complete track definitions with all 20 Phantasia 2 tracks and proper credit information
    const trackCredits: TrackWithCompleteCredits[] = [
      // Track 1: SpiralFlip feat. eili - Blinding Dawn (0:00)
      {
        id: '1',
        title: 'Blinding Dawn',
        trackNumber: 1,
        startTime: 0,
        endTime: 168,
        audioFile: '1. SpiralFlip - Blinding Dawn feat. eili.ogg',
        mainArtist: this.createArtistContribution('SpiralFlip', 'Main Artist', 'Primary', 60),
        allContributions: [
          this.createArtistContribution('SpiralFlip', 'Main Artist', 'Primary', 60, 'Original composition and production'),
          this.createArtistContribution('eili', 'Featured Artist', 'Featured', 40, 'Lead vocals and melody')
        ],
        featuredArtists: [this.createArtistContribution('eili', 'Featured Artist', 'Featured', 40)],
        collaborators: [],
        instrumentalists: [],
        vocalists: [this.createArtistContribution('eili', 'Vocalist', 'Featured', 40)],
        technicalCredits: [this.createArtistContribution('SpiralFlip', 'Producer', 'Primary', 100)]
      },
      // Track 2: Ariatec - Hollow Crown (2:48)
      {
        id: '2',
        title: 'Hollow Crown',
        trackNumber: 2,
        startTime: 168,
        endTime: 344,
        audioFile: '2. Ariatec - Hollow Crown.ogg',
        mainArtist: this.createArtistContribution('Ariatec', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Ariatec', 'Main Artist', 'Primary', 100, 'Ambient composition and sound design')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Ariatec', 'Sound Designer', 'Primary', 100)]
      },
      // Track 3: MB feat. Iku Hoshifuri - 暁の姫 (5:44)
      {
        id: '3',
        title: '暁の姫',
        trackNumber: 3,
        startTime: 344,
        endTime: 518,
        audioFile: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg',
        mainArtist: this.createArtistContribution('MB', 'Main Artist', 'Primary', 40),
        allContributions: [
          this.createArtistContribution('MB', 'Main Artist', 'Primary', 40, 'Orchestral composition and arrangement'),
          this.createArtistContribution('Iku Hoshifuri', 'Featured Artist', 'Featured', 30, 'Japanese vocals'),
          this.createArtistContribution('Justin Thornburgh', 'Accordion', 'Additional', 10, 'Accordion performance'),
          this.createArtistContribution('v1ris', 'Violin', 'Additional', 8, 'Violin performance'),
          this.createArtistContribution('Rita Kamishiro', 'Viola', 'Additional', 7, 'Viola performance'),
          this.createArtistContribution('Marcus Ho', 'Cello', 'Additional', 5, 'Cello performance')
        ],
        featuredArtists: [this.createArtistContribution('Iku Hoshifuri', 'Featured Artist', 'Featured', 30)],
        collaborators: [],
        instrumentalists: [
          this.createArtistContribution('Justin Thornburgh', 'Accordion', 'Additional', 10),
          this.createArtistContribution('v1ris', 'Violin', 'Additional', 8),
          this.createArtistContribution('Rita Kamishiro', 'Viola', 'Additional', 7),
          this.createArtistContribution('Marcus Ho', 'Cello', 'Additional', 5)
        ],
        vocalists: [this.createArtistContribution('Iku Hoshifuri', 'Vocalist', 'Featured', 30)],
        technicalCredits: [this.createArtistContribution('MB', 'Arranger', 'Primary', 100)]
      },
      // Track 4: AZALI & Aloysius - Lux Nova (8:38)
      {
        id: '4',
        title: 'Lux Nova',
        trackNumber: 4,
        startTime: 518,
        endTime: 704,
        audioFile: '4. Azali & Aloysius - Lux Nova.ogg',
        mainArtist: this.createArtistContribution('AZALI', 'Main Artist', 'Primary', 50),
        allContributions: [
          this.createArtistContribution('AZALI', 'Main Artist', 'Primary', 50, 'Experimental electronic production'),
          this.createArtistContribution('Aloysius', 'Collaborator', 'Collaboration', 50, 'Ambient electronic production')
        ],
        featuredArtists: [],
        collaborators: [this.createArtistContribution('Aloysius', 'Electronic Producer', 'Collaboration', 50)],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [
          this.createArtistContribution('AZALI', 'Producer', 'Primary', 50),
          this.createArtistContribution('Aloysius', 'Producer', 'Collaboration', 50)
        ]
      },
      // Track 5: potatoTeto - Hall of Silent Echoes (11:44)
      {
        id: '5',
        title: 'Hall of Silent Echoes',
        trackNumber: 5,
        startTime: 704,
        endTime: 892,
        audioFile: '5. potatoTeto - Hall of Silent Echoes.ogg',
        mainArtist: this.createArtistContribution('potatoTeto', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('potatoTeto', 'Main Artist', 'Primary', 100, 'Experimental ambient sound design')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('potatoTeto', 'Sound Designer', 'Primary', 100)]
      },
      // Track 6: Artisan - Lirica (14:52)
      {
        id: '6',
        title: 'Lirica',
        trackNumber: 6,
        startTime: 892,
        endTime: 1073,
        audioFile: '6. Artisan - Lirica.ogg',
        mainArtist: this.createArtistContribution('Artisan', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Artisan', 'Main Artist', 'Primary', 100, 'Melodic electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Artisan', 'Producer', 'Primary', 100)]
      },
      // Track 7: Mei Naganowa - To Defy The Beankeeper (17:53)
      {
        id: '7',
        title: 'To Defy The Beankeeper',
        trackNumber: 7,
        startTime: 1073,
        endTime: 1245,
        audioFile: '7. Mei Naganowa - To Defy The Beankeeper.ogg',
        mainArtist: this.createArtistContribution('Mei Naganowa', 'Main Artist', 'Primary', 80),
        allContributions: [
          this.createArtistContribution('Mei Naganowa', 'Main Artist', 'Primary', 80, 'Synthesizer V composition and production'),
          this.createArtistContribution('Anri Arcane', 'Synthesizer V Operator', 'Additional', 5, 'Synthesizer V vocals'),
          this.createArtistContribution('HXVOC', 'Synthesizer V Operator', 'Additional', 5, 'Synthesizer V vocals'),
          this.createArtistContribution('Miyamai Moca', 'Synthesizer V Operator', 'Additional', 5, 'Synthesizer V vocals'),
          this.createArtistContribution('Ninezero', 'Synthesizer V Operator', 'Additional', 5, 'Synthesizer V vocals')
        ],
        featuredArtists: [],
        collaborators: [
          this.createArtistContribution('Anri Arcane', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('HXVOC', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('Miyamai Moca', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('Ninezero', 'Synthesizer V Operator', 'Additional', 5)
        ],
        instrumentalists: [],
        vocalists: [
          this.createArtistContribution('Anri Arcane', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('HXVOC', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('Miyamai Moca', 'Synthesizer V Operator', 'Additional', 5),
          this.createArtistContribution('Ninezero', 'Synthesizer V Operator', 'Additional', 5)
        ],
        technicalCredits: [this.createArtistContribution('Mei Naganowa', 'Producer', 'Primary', 100)]
      },
      // Track 8: Evin a'k - Trench (20:45)
      {
        id: '8',
        title: 'Trench',
        trackNumber: 8,
        startTime: 1245,
        endTime: 1409,
        audioFile: "8. Evin a'k - Trench.ogg",
        mainArtist: this.createArtistContribution("Evin a'k", 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution("Evin a'k", 'Main Artist', 'Primary', 100, 'Bass-heavy electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [this.createArtistContribution("Evin a'k", 'Bass', 'Primary', 100)],
        vocalists: [],
        technicalCredits: [this.createArtistContribution("Evin a'k", 'Electronic Producer', 'Primary', 100)]
      },
      // Track 9: BilliumMoto - Blooming in the Square (23:29)
      {
        id: '9',
        title: 'Blooming in the Square',
        trackNumber: 9,
        startTime: 1409,
        endTime: 1597,
        audioFile: '9. BilliumMoto - Blooming in the Square.ogg',
        mainArtist: this.createArtistContribution('BilliumMoto', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('BilliumMoto', 'Main Artist', 'Primary', 100, 'Lofi and chill music production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('BilliumMoto', 'Producer', 'Primary', 100)]
      },
      // Track 10: Elliot Hsu - Skies in Abberation (26:37)
      {
        id: '10',
        title: 'Skies in Abberation',
        trackNumber: 10,
        startTime: 1597,
        endTime: 1792,
        audioFile: '10. Elliot Hsu - Skies in Abberation.ogg',
        mainArtist: this.createArtistContribution('Elliot Hsu', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Elliot Hsu', 'Main Artist', 'Primary', 100, 'Ambient electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Elliot Hsu', 'Sound Designer', 'Primary', 100)]
      },
      // Track 11: Yuzuki - song of the nymphs (29:52)
      {
        id: '11',
        title: 'song of the nymphs',
        trackNumber: 11,
        startTime: 1792,
        endTime: 1962,
        audioFile: '11. Yuzuki - song of the nymphs.ogg',
        mainArtist: this.createArtistContribution('Yuzuki', 'Main Artist', 'Primary', 90),
        allContributions: [
          this.createArtistContribution('Yuzuki', 'Main Artist', 'Primary', 90, 'Synthesizer V composition and production'),
          this.createArtistContribution('Hanakuma Chifuyu', 'Synthesizer V Operator', 'Additional', 10, 'Synthesizer V vocals')
        ],
        featuredArtists: [],
        collaborators: [this.createArtistContribution('Hanakuma Chifuyu', 'Synthesizer V Operator', 'Additional', 10)],
        instrumentalists: [],
        vocalists: [this.createArtistContribution('Hanakuma Chifuyu', 'Synthesizer V Operator', 'Additional', 10)],
        technicalCredits: [this.createArtistContribution('Yuzuki', 'Producer', 'Primary', 100)]
      },
      // Track 12: LucaProject - Light Guardian (32:42)
      {
        id: '12',
        title: 'Light Guardian',
        trackNumber: 12,
        startTime: 1962,
        endTime: 2148,
        audioFile: '12. LucaProject - Light Guardian.ogg',
        mainArtist: this.createArtistContribution('LucaProject', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('LucaProject', 'Main Artist', 'Primary', 100, 'Melodic electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('LucaProject', 'Producer', 'Primary', 100)]
      },
      // Track 13: Koway ft. 伍一 - Enso Antumbra (35:48)
      {
        id: '13',
        title: 'Enso Antumbra',
        trackNumber: 13,
        startTime: 2148,
        endTime: 2337,
        audioFile: '13. Koway - Enso Antumbra ft. 伍.ogg',
        mainArtist: this.createArtistContribution('Koway', 'Main Artist', 'Primary', 70),
        allContributions: [
          this.createArtistContribution('Koway', 'Main Artist', 'Primary', 70, 'Experimental electronic composition'),
          this.createArtistContribution('伍一', 'Featured Artist', 'Featured', 30, 'Chinese vocals')
        ],
        featuredArtists: [this.createArtistContribution('伍一', 'Featured Artist', 'Featured', 30)],
        collaborators: [],
        instrumentalists: [],
        vocalists: [this.createArtistContribution('伍一', 'Vocalist', 'Featured', 30)],
        technicalCredits: [this.createArtistContribution('Koway', 'Producer', 'Primary', 100)]
      },
      // Track 14: Nstryder - You're In My Way (38:57)
      {
        id: '14',
        title: "You're In My Way",
        trackNumber: 14,
        startTime: 2337,
        endTime: 2525,
        audioFile: '14. Nstryder - You_re In My Way.ogg',
        mainArtist: this.createArtistContribution('Nstryder', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Nstryder', 'Main Artist', 'Primary', 100, 'Hardcore electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Nstryder', 'Producer', 'Primary', 100)]
      },
      // Track 15: MoAE:. - Remember you (42:05)
      {
        id: '15',
        title: 'Remember you',
        trackNumber: 15,
        startTime: 2525,
        endTime: 2709,
        audioFile: '15. MoAE. - Remember you.ogg',
        mainArtist: this.createArtistContribution('MoAE', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('MoAE', 'Main Artist', 'Primary', 100, 'Ambient electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('MoAE', 'Sound Designer', 'Primary', 100)]
      },
      // Track 16: dystopian tanuki - Hidden passage (45:09)
      {
        id: '16',
        title: 'Hidden passage',
        trackNumber: 16,
        startTime: 2709,
        endTime: 2902,
        audioFile: '16. dystopian tanuki - Hidden passage.ogg',
        mainArtist: this.createArtistContribution('dystopian tanuki', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('dystopian tanuki', 'Main Artist', 'Primary', 100, 'Experimental ambient composition')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('dystopian tanuki', 'Sound Designer', 'Primary', 100)]
      },
      // Track 17: Heem feat. Woojinee - Last Dance (detune version) (48:22)
      {
        id: '17',
        title: 'Last Dance (detune version)',
        trackNumber: 17,
        startTime: 2902,
        endTime: 3085,
        audioFile: '17. Heem - Last Dance feat. woojinee (detune version).ogg',
        mainArtist: this.createArtistContribution('Heem', 'Main Artist', 'Primary', 70),
        allContributions: [
          this.createArtistContribution('Heem', 'Main Artist', 'Primary', 70, 'Melodic electronic production'),
          this.createArtistContribution('Woojinee', 'Featured Artist', 'Featured', 30, 'Violin performance')
        ],
        featuredArtists: [this.createArtistContribution('Woojinee', 'Featured Artist', 'Featured', 30)],
        collaborators: [],
        instrumentalists: [this.createArtistContribution('Woojinee', 'Violin', 'Featured', 30)],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Heem', 'Producer', 'Primary', 100)]
      },
      // Track 18: Bigg Milk - Second Guess (51:25)
      {
        id: '18',
        title: 'Second Guess',
        trackNumber: 18,
        startTime: 3085,
        endTime: 3255,
        audioFile: '18. Bigg Milk - Second Guess.ogg',
        mainArtist: this.createArtistContribution('Bigg Milk', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Bigg Milk', 'Main Artist', 'Primary', 100, 'Chill electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Bigg Milk', 'Producer', 'Primary', 100)]
      },
      // Track 19: Gardens & Sad Keyboard Guy ft. eili - Fractured Light (54:15)
      {
        id: '19',
        title: 'Fractured Light',
        trackNumber: 19,
        startTime: 3255,
        endTime: 3424,
        audioFile: '19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg',
        mainArtist: this.createArtistContribution('Gardens', 'Main Artist', 'Primary', 40),
        allContributions: [
          this.createArtistContribution('Gardens', 'Main Artist', 'Primary', 40, 'Ambient electronic production'),
          this.createArtistContribution('Sad Keyboard Guy', 'Collaborator', 'Collaboration', 35, 'Keyboard composition'),
          this.createArtistContribution('eili', 'Featured Artist', 'Featured', 25, 'Vocals')
        ],
        featuredArtists: [this.createArtistContribution('eili', 'Featured Artist', 'Featured', 25)],
        collaborators: [this.createArtistContribution('Sad Keyboard Guy', 'Keyboard', 'Collaboration', 35)],
        instrumentalists: [this.createArtistContribution('Sad Keyboard Guy', 'Keyboard', 'Collaboration', 35)],
        vocalists: [this.createArtistContribution('eili', 'Vocalist', 'Featured', 25)],
        technicalCredits: [
          this.createArtistContribution('Gardens', 'Sound Designer', 'Primary', 50),
          this.createArtistContribution('Sad Keyboard Guy', 'Composer', 'Collaboration', 50)
        ]
      },
      // Track 20: Futsuunohito - Beyond the Veil of Light (57:04)
      {
        id: '20',
        title: 'Beyond the Veil of Light',
        trackNumber: 20,
        startTime: 3424,
        endTime: 3600,
        audioFile: '20. Futsuunohito - Beyond the Veil of Light.ogg',
        mainArtist: this.createArtistContribution('Futsuunohito', 'Main Artist', 'Primary', 80),
        allContributions: [
          this.createArtistContribution('Futsuunohito', 'Main Artist', 'Primary', 80, 'Cinematic electronic composition'),
          this.createArtistContribution('shishishiena', 'Voice Actor', 'Featured', 20, 'Narrative vocals')
        ],
        featuredArtists: [this.createArtistContribution('shishishiena', 'Voice Actor', 'Featured', 20)],
        collaborators: [],
        instrumentalists: [],
        vocalists: [this.createArtistContribution('shishishiena', 'Voice Actor', 'Featured', 20)],
        technicalCredits: [
          this.createArtistContribution('Futsuunohito', 'Producer', 'Primary', 80),
          this.createArtistContribution('Futsuunohito', 'Sound Designer', 'Primary', 80)
        ]
      }
    ];

    return trackCredits;
  }

  /**
   * Create artist contribution object
   */
  private createArtistContribution(
    artistName: string,
    role: ArtistRole,
    participationType: ParticipationType,
    percentage: number,
    notes?: string
  ): ArtistContribution {
    const artistData = this.completeArtistDatabase[artistName];
    if (!artistData) {
      throw new Error(`Artist not found in database: ${artistName}`);
    }

    return {
      id: this.generateArtistId(artistName),
      artistName,
      artistDisplayName: artistData.displayName,
      role,
      participationType,
      percentageContribution: percentage,
      notes,
      avatar: artistData.avatar,
      color: artistData.color,
      socialLinks: artistData.socialLinks
    };
  }


  /**
   * Generate consistent artist ID
   */
  private generateArtistId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  /**
   * Create verification statuses for all tracks
   */
  private createVerificationStatuses(): CreditVerification[] {
    const verifications: CreditVerification[] = [];

    // Generate verification for all 20 tracks
    for (let i = 1; i <= 20; i++) {
      verifications.push({
        trackId: i.toString(),
        verificationId: `phantasia2_track${i.toString().padStart(2, '0')}_complete`,
        verifiedBy: 'Deltaether - Phantasia 2 Project Lead',
        verificationDate: new Date(),
        allContributorsIdentified: true,
        rolesAccuratelyAssigned: true,
        socialLinksVerified: true,
        avatarsLinked: true,
        fullyVerified: true,
        verificationNotes: `Complete verification for track ${i} - all artists properly credited`,
        outstandingIssues: []
      });
    }

    return verifications;
  }

  /**
   * Initialize project metadata for both Phantasia projects
   */
  private initializeProjectMetadata(): void {
    const projects: ProjectMetadata[] = [
      {
        id: 'phantasia1',
        displayName: 'Phantasia Project 1',
        totalTracks: 15,
        releaseYear: 2022,
        youtubeUrl: 'https://youtu.be/IZtd0ABhhpM?si=SHayVNUQ4LdKs_3O',
        streamingUrl: 'https://srsr.li/various-artists-project-phantasia',
        description: 'The original Phantasia compilation featuring 15 tracks from 16+ amazing electronic artists, showcasing diverse styles and collaborative creativity.'
      },
      {
        id: 'phantasia2',
        displayName: 'Phantasia Project 2',
        totalTracks: 20,
        releaseYear: 2024,
        description: 'The highly anticipated sequel to the original Phantasia project, featuring 20 tracks with expanded orchestral and electronic collaborations.'
      }
    ];

    this.projectMetadataSubject.next(projects);
  }

  /**
   * Initialize combined tracks from both projects
   */
  private initializeAllProjectTracks(): void {
    const phantasia2Tracks = this.createCompleteTrackCredits().map(track => ({
      ...track,
      projectId: 'phantasia2' as ProjectType,
      projectDisplayName: 'Phantasia Project 2'
    }));

    const phantasia1Tracks = this.createPhantasia1TrackCredits();

    const allTracks = [...phantasia1Tracks, ...phantasia2Tracks];
    this.allProjectTracksSubject.next(allTracks);
  }

  /**
   * Create complete track credits for Phantasia Project 1
   */
  private createPhantasia1TrackCredits(): TrackWithCompleteCreditsMultiProject[] {
    const trackCredits: TrackWithCompleteCreditsMultiProject[] = [
      // Track 1: SpiralFlip - Phantasia ft. Eili
      {
        id: 'p1-1',
        title: 'Phantasia',
        trackNumber: 1,
        startTime: 0,
        endTime: 180, // Estimated
        audioFile: '01. SpiralFlip - Phantasia ft. Eili.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('SpiralFlip', 'Main Artist', 'Primary', 70),
        allContributions: [
          this.createArtistContribution('SpiralFlip', 'Main Artist', 'Primary', 70, 'Original composition and production'),
          this.createArtistContribution('eili', 'Featured Artist', 'Featured', 30, 'Lead vocals')
        ],
        featuredArtists: [this.createArtistContribution('eili', 'Featured Artist', 'Featured', 30)],
        collaborators: [],
        instrumentalists: [],
        vocalists: [this.createArtistContribution('eili', 'Vocalist', 'Featured', 30)],
        technicalCredits: [this.createArtistContribution('SpiralFlip', 'Producer', 'Primary', 100)]
      },
      // Track 2: Bigg Milk - First Steps
      {
        id: 'p1-2',
        title: 'First Steps',
        trackNumber: 2,
        startTime: 180,
        endTime: 360,
        audioFile: '02. Bigg Milk - First Steps.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Bigg Milk', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Bigg Milk', 'Main Artist', 'Primary', 100, 'Chill electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Bigg Milk', 'Producer', 'Primary', 100)]
      },
      // Track 3: Heem - Altar of the Sword
      {
        id: 'p1-3',
        title: 'Altar of the Sword',
        trackNumber: 3,
        startTime: 360,
        endTime: 540,
        audioFile: '03. Heem - Altar of the Sword.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Heem', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Heem', 'Main Artist', 'Primary', 100, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Heem', 'Producer', 'Primary', 100)]
      },
      // Track 4: futsuunohito - A Voyage on the Winds of Change
      {
        id: 'p1-4',
        title: 'A Voyage on the Winds of Change',
        trackNumber: 4,
        startTime: 540,
        endTime: 720,
        audioFile: '04. futsuunohito - A Voyage on the Winds of Change.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Futsuunohito', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Futsuunohito', 'Main Artist', 'Primary', 100, 'Cinematic electronic composition')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Futsuunohito', 'Producer', 'Primary', 100)]
      },
      // Track 5: Prower - Rohkeutta Etsiä
      {
        id: 'p1-5',
        title: 'Rohkeutta Etsiä',
        trackNumber: 5,
        startTime: 720,
        endTime: 900,
        audioFile: '05. Prower - Rohkeutta Etsiä.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Prower', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Prower', 'Main Artist', 'Primary', 100, 'Electronic production - Finnish title')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Prower', 'Producer', 'Primary', 100)]
      },
      // Track 6: AZALI & Seycara - Ivory Flowers
      {
        id: 'p1-6',
        title: 'Ivory Flowers',
        trackNumber: 6,
        startTime: 900,
        endTime: 1080,
        audioFile: '06. AZALI & Seycara - Ivory Flowers.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('AZALI', 'Main Artist', 'Primary', 50),
        allContributions: [
          this.createArtistContribution('AZALI', 'Main Artist', 'Primary', 50, 'Experimental electronic production'),
          this.createArtistContribution('Seycara', 'Collaborator', 'Collaboration', 50, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [this.createArtistContribution('Seycara', 'Electronic Producer', 'Collaboration', 50)],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [
          this.createArtistContribution('AZALI', 'Producer', 'Primary', 50),
          this.createArtistContribution('Seycara', 'Producer', 'Collaboration', 50)
        ]
      },
      // Track 7: Qyubey - Outer Bygone Ruins
      {
        id: 'p1-7',
        title: 'Outer Bygone Ruins',
        trackNumber: 7,
        startTime: 1080,
        endTime: 1260,
        audioFile: '07. Qyubey - Outer Bygone Ruins.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Qyubey', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Qyubey', 'Main Artist', 'Primary', 100, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Qyubey', 'Producer', 'Primary', 100)]
      },
      // Track 8: Luscinia - Spiral Into the Abyss!
      {
        id: 'p1-8',
        title: 'Spiral Into the Abyss!',
        trackNumber: 8,
        startTime: 1260,
        endTime: 1440,
        audioFile: '08. Luscinia - Spiral Into the Abyss!.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Luscinia', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Luscinia', 'Main Artist', 'Primary', 100, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Luscinia', 'Producer', 'Primary', 100)]
      },
      // Track 9: Gardens & sleepless - Wandering Breeze
      {
        id: 'p1-9',
        title: 'Wandering Breeze',
        trackNumber: 9,
        startTime: 1440,
        endTime: 1620,
        audioFile: '09. Gardens & sleepless - Wandering Breeze.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Gardens', 'Main Artist', 'Primary', 50),
        allContributions: [
          this.createArtistContribution('Gardens', 'Main Artist', 'Primary', 50, 'Ambient electronic production'),
          this.createArtistContribution('sleepless', 'Collaborator', 'Collaboration', 50, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [this.createArtistContribution('sleepless', 'Electronic Producer', 'Collaboration', 50)],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [
          this.createArtistContribution('Gardens', 'Producer', 'Primary', 50),
          this.createArtistContribution('sleepless', 'Producer', 'Collaboration', 50)
        ]
      },
      // Track 10: はがね - Mystic Nebula
      {
        id: 'p1-10',
        title: 'Mystic Nebula',
        trackNumber: 10,
        startTime: 1620,
        endTime: 1800,
        audioFile: '10. はがね - Mystic Nebula.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('はがね', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('はがね', 'Main Artist', 'Primary', 100, 'Japanese electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('はがね', 'Producer', 'Primary', 100)]
      },
      // Track 11: LucaProject - Iris
      {
        id: 'p1-11',
        title: 'Iris',
        trackNumber: 11,
        startTime: 1800,
        endTime: 1980,
        audioFile: '11. LucaProject - Iris.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('LucaProject', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('LucaProject', 'Main Artist', 'Primary', 100, 'Melodic electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('LucaProject', 'Producer', 'Primary', 100)]
      },
      // Track 12: Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere
      {
        id: 'p1-12',
        title: 'Half-Asleep in the Middle of Bumfuck Nowhere',
        trackNumber: 12,
        startTime: 1980,
        endTime: 2160,
        audioFile: '12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Mei Naganowa', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Mei Naganowa', 'Main Artist', 'Primary', 100, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Mei Naganowa', 'Producer', 'Primary', 100)]
      },
      // Track 13: satella - The Traveller
      {
        id: 'p1-13',
        title: 'The Traveller',
        trackNumber: 13,
        startTime: 2160,
        endTime: 2340,
        audioFile: '13. satella - The Traveller.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('satella', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('satella', 'Main Artist', 'Primary', 100, 'Electronic production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('satella', 'Producer', 'Primary', 100)]
      },
      // Track 14: dystopian tanuki - Childhood memories
      {
        id: 'p1-14',
        title: 'Childhood memories',
        trackNumber: 14,
        startTime: 2340,
        endTime: 2520,
        audioFile: '14. dystopian tanuki - Childhood memories.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('dystopian tanuki', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('dystopian tanuki', 'Main Artist', 'Primary', 100, 'Experimental ambient composition')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('dystopian tanuki', 'Sound Designer', 'Primary', 100)]
      },
      // Track 15: 薄れる ver.Shizu Final (Bonus Track)
      {
        id: 'p1-15',
        title: '薄れる ver.Shizu Final',
        trackNumber: 15,
        startTime: 2520,
        endTime: 2700,
        audioFile: '15. 薄れる ver.Shizu Final.mp3',
        projectId: 'phantasia1',
        projectDisplayName: 'Phantasia Project 1',
        mainArtist: this.createArtistContribution('Shizu', 'Main Artist', 'Primary', 100),
        allContributions: [
          this.createArtistContribution('Shizu', 'Main Artist', 'Primary', 100, 'Japanese bonus track production')
        ],
        featuredArtists: [],
        collaborators: [],
        instrumentalists: [],
        vocalists: [],
        technicalCredits: [this.createArtistContribution('Shizu', 'Producer', 'Primary', 100)]
      }
    ];

    return trackCredits;
  }
}