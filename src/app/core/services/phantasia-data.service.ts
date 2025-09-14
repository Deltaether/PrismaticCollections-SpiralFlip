import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { ArtistSocialLinks, Artist, TrackWithArtists } from '../../pages/collections/phantasia/services/dynamic-artist.service';

/**
 * Interface for raw track data parsed from timestamps file
 */
export interface RawTrackData {
  trackNumber: number;
  title: string;
  mainArtist: string;
  featuredArtists: string[];
  collaborators: string[];
  additionalArtists: string[];
  socialLinks: Record<string, ArtistSocialLinks>;
  startTimeSeconds: number;
  endTimeSeconds?: number;
  audioFileName: string;
}

/**
 * Interface for Phantasia album data structure
 */
export interface PhantasiaAlbumData {
  id: string;
  title: string;
  artist: string;
  releaseYear: number;
  trackCount: number;
  tracks: TrackWithArtists[];
}

@Injectable({
  providedIn: 'root'
})
export class PhantasiaDataService {
  private readonly phantasia1Data$ = new BehaviorSubject<PhantasiaAlbumData | null>(null);
  private readonly phantasia2Data$ = new BehaviorSubject<PhantasiaAlbumData | null>(null);

  constructor(private http: HttpClient) {
    this.initializePhantasiaData();
  }

  /**
   * Get Phantasia 1 album data
   */
  getPhantasia1Data(): Observable<PhantasiaAlbumData | null> {
    return this.phantasia1Data$.asObservable();
  }

  /**
   * Get Phantasia 2 album data
   */
  getPhantasia2Data(): Observable<PhantasiaAlbumData | null> {
    return this.phantasia2Data$.asObservable();
  }

  /**
   * Initialize Phantasia album data
   */
  private async initializePhantasiaData(): Promise<void> {
    try {
      // Load Phantasia 2 from timestamps file
      const phantasia2 = await this.loadPhantasia2FromTimestamps();
      this.phantasia2Data$.next(phantasia2);

      // Load Phantasia 1 from hardcoded data (since no files exist)
      const phantasia1 = this.createPhantasia1Data();
      this.phantasia1Data$.next(phantasia1);
    } catch (error) {
      console.error('Failed to initialize Phantasia data:', error);
    }
  }

  /**
   * Load Phantasia 2 data from the timestamps file
   */
  private async loadPhantasia2FromTimestamps(): Promise<PhantasiaAlbumData> {
    try {
      const timestampData = await firstValueFrom(
        this.http.get('/assets/audio/Phantasia_2/timestamps_data.txt', { responseType: 'text' })
      );

      const rawTracks = this.parseTimestampsData(timestampData);
      const tracks = rawTracks.map(rawTrack => this.convertRawTrackToTrackWithArtists(rawTrack));

      return {
        id: 'phantasia-2',
        title: 'Phantasia 2',
        artist: 'Various Artists',
        releaseYear: 2025,
        trackCount: tracks.length,
        tracks
      };
    } catch (error) {
      console.error('Failed to load Phantasia 2 timestamps:', error);
      return this.createFallbackPhantasia2Data();
    }
  }

  /**
   * Parse the timestamps_data.txt file
   */
  private parseTimestampsData(data: string): RawTrackData[] {
    const tracks: RawTrackData[] = [];
    const lines = data.split('\n');

    let currentTrack: Partial<RawTrackData> | null = null;
    let currentSocialLinks: Record<string, ArtistSocialLinks> = {};

    // Find timestamps section
    const timestampsIndex = lines.findIndex(line => line.includes('REAL TIMESTAMPS:'));
    const timestamps = this.parseTimestamps(lines.slice(timestampsIndex + 1));

    // Parse tracks section
    for (let i = 0; i < timestampsIndex; i++) {
      const line = lines[i].trim();

      if (line.startsWith('Track ')) {
        // Save previous track if exists
        if (currentTrack && currentTrack.trackNumber) {
          tracks.push(this.finalizeRawTrack(currentTrack, currentSocialLinks, timestamps));
        }

        // Start new track
        const trackMatch = line.match(/Track (\d+): (.+)/);
        if (trackMatch) {
          const [, trackNumStr, titleArtist] = trackMatch;
          const trackNumber = parseInt(trackNumStr);

          const { title, mainArtist, featuredArtists, collaborators } = this.parseTrackTitleAndArtist(titleArtist);

          currentTrack = {
            trackNumber,
            title,
            mainArtist,
            featuredArtists,
            collaborators,
            additionalArtists: [],
            audioFileName: this.getAudioFileName(trackNumber, titleArtist)
          };
          currentSocialLinks = {};
        }
      } else if (line.startsWith('https://') && currentTrack) {
        // Parse social links
        this.addSocialLinkToCurrentTrack(line, currentSocialLinks, currentTrack);
      } else if (line.startsWith('-') && currentTrack) {
        // Parse additional artists/roles
        const roleMatch = line.match(/^-(.+?):\s*(.+)/);
        if (roleMatch) {
          const [, role, artist] = roleMatch;
          if (!currentTrack.additionalArtists) currentTrack.additionalArtists = [];
          currentTrack.additionalArtists.push(artist.trim());
        }
      }
    }

    // Add final track
    if (currentTrack && currentTrack.trackNumber) {
      tracks.push(this.finalizeRawTrack(currentTrack, currentSocialLinks, timestamps));
    }

    return tracks;
  }

  /**
   * Parse track title and extract artist information
   */
  private parseTrackTitleAndArtist(titleArtist: string): {
    title: string;
    mainArtist: string;
    featuredArtists: string[];
    collaborators: string[];
  } {
    const featuredArtists: string[] = [];
    const collaborators: string[] = [];

    // Handle feat. pattern
    let cleanTitleArtist = titleArtist;
    const featMatch = titleArtist.match(/(.+?)\s+\(feat\.\s+(.+?)\)/);
    if (featMatch) {
      const [, main, featured] = featMatch;
      featuredArtists.push(featured.trim());
      cleanTitleArtist = main.trim();
    }

    // Split artist and title
    const parts = cleanTitleArtist.split(' - ');
    if (parts.length >= 2) {
      const mainArtist = parts[0].trim();
      const title = parts.slice(1).join(' - ').trim();

      return {
        title,
        mainArtist,
        featuredArtists,
        collaborators
      };
    }

    return {
      title: titleArtist,
      mainArtist: 'Unknown Artist',
      featuredArtists,
      collaborators
    };
  }

  /**
   * Parse timestamps from the file
   */
  private parseTimestamps(timestampLines: string[]): Record<number, number> {
    const timestamps: Record<number, number> = {};

    for (const line of timestampLines) {
      const match = line.match(/\[(\d{2}):(\d{2}):(\d{2})\]\s+(\d+)/);
      if (match) {
        const [, hours, minutes, seconds, trackNum] = match;
        const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        timestamps[parseInt(trackNum)] = totalSeconds;
      }
    }

    return timestamps;
  }

  /**
   * Get audio file name for a track
   */
  private getAudioFileName(trackNumber: number, titleArtist: string): string {
    // Map to actual file names based on the directory listing
    const fileMap: Record<number, string> = {
      1: '1. SpiralFlip - Blinding Dawn feat. eili.ogg',
      2: '2. Ariatec - Hollow Crown.ogg',
      3: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg',
      4: '4. Azali & Aloysius - Lux Nova.ogg',
      5: '5. potatoTeto - Hall of Silent Echoes.ogg',
      6: '6. Artisan - Lirica.ogg',
      7: '7. Mei Naganowa - To Defy The Beankeeper.ogg',
      8: '8. Evin a\'k - Trench.ogg',
      9: '9. BilliumMoto - Blooming in the Square.ogg',
      10: '10. Elliot Hsu - Skies in Abberation.ogg',
      11: '11. Yuzuki - song of the nymphs.ogg',
      12: '12. LucaProject - Light Guardian.ogg',
      13: '13. Koway - Enso Antumbra ft. 伍.ogg',
      14: '14. Nstryder - You_re In My Way.ogg',
      15: '15. MoAE. - Remember you.ogg',
      16: '16. dystopian tanuki - Hidden passage.ogg',
      17: '17. Heem - Last Dance feat. woojinee (detune version).ogg',
      18: '18. Bigg Milk - Second Guess.ogg',
      19: '19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg',
      20: '20. Futsuunohito - Beyond the Veil of Light.ogg'
    };

    return fileMap[trackNumber] || `${trackNumber}. ${titleArtist}.ogg`;
  }

  /**
   * Add social link to current track's social links collection
   */
  private addSocialLinkToCurrentTrack(
    url: string,
    socialLinks: Record<string, ArtistSocialLinks>,
    track: Partial<RawTrackData>
  ): void {
    const artistName = track.mainArtist || 'Unknown';
    if (!socialLinks[artistName]) {
      socialLinks[artistName] = {};
    }

    if (url.includes('youtube.com')) {
      socialLinks[artistName].youtube = url;
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      socialLinks[artistName].twitter = url;
    } else if (url.includes('instagram.com')) {
      socialLinks[artistName].instagram = url;
    } else if (url.includes('.carrd.co')) {
      socialLinks[artistName].carrd = url;
    } else if (url.includes('linktr.ee')) {
      socialLinks[artistName].linktr = url;
    } else if (url.includes('bandcamp.com')) {
      socialLinks[artistName].bandcamp = url;
    } else if (url.includes('reelcrafter.com')) {
      socialLinks[artistName].reelcrafter = url;
    } else if (url.includes('twitch.tv')) {
      socialLinks[artistName].twitch = url;
    } else {
      socialLinks[artistName].website = url;
    }
  }

  /**
   * Finalize raw track with timestamps
   */
  private finalizeRawTrack(
    track: Partial<RawTrackData>,
    socialLinks: Record<string, ArtistSocialLinks>,
    timestamps: Record<number, number>
  ): RawTrackData {
    const trackNumber = track.trackNumber!;
    const startTime = timestamps[trackNumber] || 0;
    const endTime = timestamps[trackNumber + 1] || startTime + 180; // Default 3 minutes

    return {
      trackNumber,
      title: track.title!,
      mainArtist: track.mainArtist!,
      featuredArtists: track.featuredArtists || [],
      collaborators: track.collaborators || [],
      additionalArtists: track.additionalArtists || [],
      socialLinks,
      startTimeSeconds: startTime,
      endTimeSeconds: endTime,
      audioFileName: track.audioFileName!
    };
  }

  /**
   * Convert raw track to TrackWithArtists format
   */
  private convertRawTrackToTrackWithArtists(rawTrack: RawTrackData): TrackWithArtists {
    const features: Artist[] = rawTrack.featuredArtists.map(name => ({
      id: this.generateArtistId(name),
      name,
      displayName: name,
      role: 'Featured Artist',
      socialLinks: rawTrack.socialLinks[name] || {}
    }));

    const collaborators: Artist[] = rawTrack.collaborators.map(name => ({
      id: this.generateArtistId(name),
      name,
      displayName: name,
      role: 'Collaborator',
      socialLinks: rawTrack.socialLinks[name] || {}
    }));

    return {
      id: rawTrack.trackNumber.toString(),
      title: rawTrack.title,
      mainArtist: rawTrack.mainArtist,
      startTime: rawTrack.startTimeSeconds,
      endTime: rawTrack.endTimeSeconds || rawTrack.startTimeSeconds + 180,
      artists: [],
      features,
      collaborators,
      audioFile: rawTrack.audioFileName
    };
  }

  /**
   * Create Phantasia 1 data (placeholder since no files exist)
   */
  private createPhantasia1Data(): PhantasiaAlbumData {
    // This would be populated with actual Phantasia 1 data when available
    return {
      id: 'phantasia-1',
      title: 'Phantasia 1',
      artist: 'Various Artists',
      releaseYear: 2024,
      trackCount: 14,
      tracks: [] // Empty for now - would be populated with real data
    };
  }

  /**
   * Create fallback Phantasia 2 data if timestamps parsing fails
   */
  private createFallbackPhantasia2Data(): PhantasiaAlbumData {
    // Return the old hardcoded data as fallback
    const timestampData = `0:00 SpiralFlip feat. eili: NIGHT PHANTASIA
2:48 Ariatec: REFLECTIONS
5:44 Soupandreas: Memories Of This Place
8:38 Elliot Hsu: UNDER THE MOON
11:44 potatoTeto: Hall of Silent Echoes
14:52 Artisan: Lirica
17:53 Mei Naganowa: To Defy The Beankeeper
20:45 Evin a'k: Trench
23:29 BilliumMoto: Blooming in the Square
26:37 Elliot Hsu: Skies in Abberation
29:52 Yuzuki: song of the nymphs
32:42 Elliot Hsu: Skyliners
35:48 Ariatec: Starry Mountain Nights
38:57 Artisan: Illusion
42:05 Mei Naganowa: Take My Hope Away
45:09 Cryo: Crimson Sky
48:22 Elliot Hsu: Starry Night
51:25 BilliumMoto: Rooftop Rendezvous
54:15 Gardens feat. Sad Keyboard Guy (w. eili): Bittersweet Dreams
57:04 SpiralFlip feat. eili: DAWN PHANTASIA`;

    const tracks: TrackWithArtists[] = [];
    const lines = timestampData.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/(\d+):(\d+)\s+(.+?):\s+(.+)/);
      if (match) {
        const [, minutes, seconds, artist, title] = match;
        const startTime = parseInt(minutes) * 60 + parseInt(seconds);
        const nextLine = lines[index + 1];
        let endTime = 60 * 60;

        if (nextLine) {
          const nextMatch = nextLine.match(/(\d+):(\d+)/);
          if (nextMatch) {
            endTime = parseInt(nextMatch[1]) * 60 + parseInt(nextMatch[2]);
          }
        }

        tracks.push({
          id: (index + 1).toString(),
          title,
          mainArtist: artist,
          startTime,
          endTime,
          artists: [],
          features: [],
          collaborators: [],
          audioFile: `${index + 1}. ${artist} - ${title}.ogg`
        });
      }
    });

    return {
      id: 'phantasia-2',
      title: 'Phantasia 2 (Fallback)',
      artist: 'Various Artists',
      releaseYear: 2025,
      trackCount: tracks.length,
      tracks
    };
  }

  /**
   * Generate artist ID from name
   */
  private generateArtistId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }
}