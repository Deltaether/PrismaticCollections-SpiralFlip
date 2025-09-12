import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { TrianglesAnimationComponent } from '../../shared/components/triangles-animation/triangles-animation.component';

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
  imports: [CommonModule, SiteHeaderComponent, TrianglesAnimationComponent],
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
      avatar: 'assets/images/artists/deltaether-avatar.svg',
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
      avatar: 'assets/images/artists/phantasia-collective.svg',
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
      avatar: 'assets/images/artists/featured-artists.svg',
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

  /**
   * Enhanced interaction methods
   */
  onSocialHover(platform: string): void {
    console.log('Social platform hovered:', platform);
    // Could trigger analytics or preview loading
  }

  /**
   * Get platform-specific styling or behavior
   */
  getPlatformAttributes(platform: string): { [key: string]: string } {
    const platformLower = platform.toLowerCase();
    return {
      'data-platform': platformLower,
      'aria-label': `Visit ${platform}`,
      'title': `Connect on ${platform}`
    };
  }

  /**
   * Check if platform link is available
   */
  isPlatformAvailable(url: string): boolean {
    return url !== '#';
  }

  /**
   * Handle avatar image loading errors with proper fallback
   */
  onAvatarError(event: any, artistName: string): void {
    console.warn(`Avatar image failed to load for ${artistName}, using default fallback`);
    event.target.src = 'assets/images/default-avatar.svg';
    event.target.onerror = null; // Prevent infinite loop if default also fails
  }

  /**
   * Handle default avatar error as final fallback
   */
  onDefaultAvatarError(event: any): void {
    console.error('Default avatar also failed to load, using CSS fallback');
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent) {
      parent.classList.add('avatar-fallback');
    }
  }
}
