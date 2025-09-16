import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ArtistCreditService } from '../../services/artist-credit.service';

interface SpecialMention {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  socialLinks: {
    twitter?: string;
    youtube?: string;
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

  constructor(private artistCreditService: ArtistCreditService) {}

  ngOnInit(): void {
    this.loadSpecialMentionsFromDatabase();
  }

  private loadSpecialMentionsFromDatabase(): void {
    // List of special mention artist names from the database
    const specialMentionNames = [
      'PliXoR',
      'NapaL',
      'yy_artwork',
      'Elegant Sister',
      'Len',
      'Daph'
    ];

    const specialMentionsList: SpecialMention[] = specialMentionNames
      .map(artistName => {
        const artistData = this.artistCreditService.getArtistData(artistName);
        if (!artistData) return null;

        return {
          id: artistName.toLowerCase().replace(/\s+/g, '-'),
          name: artistData.displayName,
          role: artistData.primaryRoles?.[0] || 'Production Team',
          avatar: artistData.avatar,
          color: artistData.color,
          socialLinks: {
            twitter: artistData.socialLinks?.twitter,
            youtube: artistData.socialLinks?.youtube,
            website: artistData.socialLinks?.website
          }
        };
      })
      .filter((mention): mention is SpecialMention => mention !== null);

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