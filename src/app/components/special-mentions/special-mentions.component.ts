import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { GelDbIntegrationService } from '../../core/services/geldb-integration.service';

interface SpecialMention {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  socialLinks: {
    twitter?: string;
    youtube?: string;
    instagram?: string;
    website?: string;
  };
}

@Component({
  selector: 'app-special-mentions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './special-mentions.component.html',
  styleUrls: ['./special-mentions.component.scss']
})
export class SpecialMentionsComponent implements OnInit {
  readonly specialMentions = signal<SpecialMention[]>([]);

  readonly displayedMentions = computed(() => {
    return this.specialMentions().map(mention => ({
      ...mention,
      initials: this.getInitials(mention.name)
    }));
  });

  // Split cards for left and right side display
  readonly leftSideCards = computed(() => {
    const mentions = this.displayedMentions();
    const halfPoint = Math.ceil(mentions.length / 2);
    return mentions.slice(0, halfPoint);
  });

  readonly rightSideCards = computed(() => {
    const mentions = this.displayedMentions();
    const halfPoint = Math.ceil(mentions.length / 2);
    return mentions.slice(halfPoint);
  });

  constructor(
    private gelDbService: GelDbIntegrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpecialMentionsFromDatabase();
  }

  private loadSpecialMentionsFromDatabase(): void {
    // Determine current project based on URL
    const currentUrl = this.router.url;
    const isPhantasia2 = currentUrl.includes('phantasia2') || currentUrl.includes('/disc-2');

    // Project-specific special mention lists
    const phantasia1SpecialMentions = [
      'SpiralFlip',     // Organiser
      'PliXoR',         // Mastering Engineer
      'NapaL',          // Cover Illustration
      'yy_artwork',     // Logo/Jacket Design
      'Elegant Sister', // Album Stream MV
      'Len',            // Crossfade MV/Live2D
      'Daph',           // Live2D (Phantasia 1 only)
      'honabai',        // Special Thanks
      'shironill'       // Special Thanks
    ];

    const phantasia2SpecialMentions = [
      'SpiralFlip',     // Organiser
      'Len_licht',      // Co-Organiser/Video Editor
      'NapaL',          // Main Illustrator
      'TronC',          // Stained Glass Illustrator
      'Hototogisu',     // Chibi Illustrator
      'yy_artwork',     // Logo/Jacket Design
      'roər',           // Illustration separator
      'PliXoR',         // Mastering Engineer
      'Atelier Magicae', // SFX
      '白｡',            // Special Thanks
      'Sol',            // Special Thanks
      'Yo Kaze'         // Special Thanks
    ];

    // Select the appropriate list based on current project
    const specialMentionNames = isPhantasia2 ? phantasia2SpecialMentions : phantasia1SpecialMentions;

    const specialMentionsList: SpecialMention[] = specialMentionNames
      .map(artistName => {
        const avatar = this.gelDbService.getArtistAvatar(artistName);
        const displayName = this.gelDbService.getArtistDisplayName(artistName);
        const color = this.gelDbService.getArtistColor(artistName);
        const socialLinks = this.gelDbService.getArtistSocialLinks(artistName);

        // Get role from artist avatar map genre field
        const avatarMap = this.gelDbService.getArtistAvatarMap();
        const role = avatarMap[artistName]?.genre || 'Production Team';

        return {
          id: artistName.toLowerCase().replace(/\s+/g, '-'),
          name: displayName,
          role: role,
          avatar: avatar,
          color: color,
          socialLinks: {
            twitter: socialLinks?.twitter,
            youtube: socialLinks?.youtube,
            instagram: socialLinks?.instagram,
            website: socialLinks?.website
          }
        };
      });

    this.specialMentions.set(specialMentionsList);
  }

  private getInitials(name: string): string {
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  onCardClick(mention: SpecialMention): void {
    if (mention.socialLinks.twitter) {
      window.open(mention.socialLinks.twitter, '_blank', 'noopener,noreferrer');
    } else if (mention.socialLinks.instagram) {
      window.open(mention.socialLinks.instagram, '_blank', 'noopener,noreferrer');
    } else if (mention.socialLinks.youtube) {
      window.open(mention.socialLinks.youtube, '_blank', 'noopener,noreferrer');
    } else if (mention.socialLinks.website) {
      window.open(mention.socialLinks.website, '_blank', 'noopener,noreferrer');
    }
  }

  onSocialLinkClick(url: string, event: Event): void {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}