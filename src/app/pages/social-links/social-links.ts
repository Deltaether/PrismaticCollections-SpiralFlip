import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
}

interface Artist {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  socialLinks: SocialLink[];
}

/**
 * Social Links component for artist social media connections
 * Displays various artists and their social media platforms
 */
@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent],
  templateUrl: './social-links.html',
  styleUrls: ['./social-links.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLinksComponent implements OnInit {
  
  // Artist data with social links
  readonly artists: Artist[] = [
    {
      id: 'deltaether',
      name: 'Deltaether',
      role: 'Lead Producer & Visual Artist',
      description: 'Creating immersive musical experiences and interactive visual environments.',
      avatar: 'assets/images/artists/deltaether-avatar.jpg',
      socialLinks: [
        {
          platform: 'Spotify',
          url: 'https://open.spotify.com/artist/deltaether',
          icon: '🎵',
          color: '#1DB954'
        },
        {
          platform: 'SoundCloud',
          url: 'https://soundcloud.com/deltaether',
          icon: '🌤️',
          color: '#FF5500'
        },
        {
          platform: 'YouTube',
          url: 'https://youtube.com/@deltaether',
          icon: '📺',
          color: '#FF0000'
        },
        {
          platform: 'GitHub',
          url: 'https://github.com/deltaether',
          icon: '💻',
          color: '#333'
        },
        {
          platform: 'Discord',
          url: '#',
          icon: '💬',
          color: '#5865F2'
        }
      ]
    },
    {
      id: 'phantasia-collective',
      name: 'Phantasia Collective',
      role: 'Musical Collaboration',
      description: 'A collective of artists working together on the Phantasia project.',
      avatar: 'assets/images/artists/phantasia-collective.jpg',
      socialLinks: [
        {
          platform: 'Bandcamp',
          url: '#',
          icon: '🎪',
          color: '#629AA0'
        },
        {
          platform: 'Instagram',
          url: '#',
          icon: '📸',
          color: '#E4405F'
        },
        {
          platform: 'Twitter',
          url: '#',
          icon: '🐦',
          color: '#1DA1F2'
        }
      ]
    },
    {
      id: 'guest-artists',
      name: 'Featured Artists',
      role: 'Collaborations & Remixes',
      description: 'Various artists who have contributed to Prismatic Collections projects.',
      avatar: 'assets/images/artists/featured-artists.jpg',
      socialLinks: [
        {
          platform: 'Various Platforms',
          url: '#',
          icon: '🌐',
          color: '#ff7f50'
        }
      ]
    }
  ];

  ngOnInit(): void {
    console.log('Social Links component initialized');
  }

  /**
   * Open social link in new tab
   */
  openSocialLink(url: string, platform: string): void {
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log(`${platform} link coming soon!`);
    }
  }

  /**
   * TrackBy function for artist list performance
   */
  trackByArtistId(index: number, artist: Artist): string {
    return artist.id;
  }

  /**
   * TrackBy function for social links performance
   */
  trackByPlatform(index: number, link: SocialLink): string {
    return link.platform;
  }
}
