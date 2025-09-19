import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
import { SocialsArtistCardsComponent } from '../../components/socials-artist-cards/socials-artist-cards.component';
import { PhantasiaFooterComponent, PhantasiaFooterConfig } from '../../shared/components/phantasia-footer/phantasia-footer.component';

/**
 * Social Links component for artist social media connections
 * Displays various artists and their social media platforms
 */
@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule, MatIconModule, SiteHeaderComponent, SquaresAnimationComponent, SocialsArtistCardsComponent, PhantasiaFooterComponent],
  templateUrl: './social-links.html',
  styleUrls: ['./social-links.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLinksComponent implements OnInit, OnDestroy {

  /**
   * Footer configuration for social links page
   */
  footerConfig: PhantasiaFooterConfig = {
    logoSrc: 'assets/images/logos/prismcoll_logox.svg',
    logoAlt: 'Prismatic Collections',
    linkGroups: [
      {
        title: 'Explore',
        links: [
          { label: 'Collections', routerLink: '/collections' },
          { label: 'Projects', routerLink: '/phantasia' },
          { label: 'News', routerLink: '/news' }
        ]
      },
      {
        title: 'Connect',
        links: [
          { label: 'Artist Circles', routerLink: '/socials' },
          { label: 'Community', href: '#community' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Use', href: '#' }
        ]
      }
    ],
    copyrightText: 'Prismatic Collections. All rights reserved.'
  };

  /**
   * Current year for copyright display
   */
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    console.log('Social Links component initialized');
    // Add body class for global scrolling support
    document.body.classList.add('social-links-page-active');
  }

  ngOnDestroy(): void {
    // Clean up body class when component is destroyed
    document.body.classList.remove('social-links-page-active');
  }

}
