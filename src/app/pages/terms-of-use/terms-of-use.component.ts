import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { PhantasiaFooterComponent, PhantasiaFooterConfig } from '../../shared/components/phantasia-footer/phantasia-footer.component';
import { Title, Meta } from '@angular/platform-browser';

/**
 * Terms of Use page component for Prismatic Collections
 * Provides comprehensive terms of use information for the website
 */
@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SiteHeaderComponent,
    PhantasiaFooterComponent
  ],
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfUseComponent implements OnInit, OnDestroy {

  /**
   * Footer configuration for the terms of use page
   */
  footerConfig: PhantasiaFooterConfig = {
    logoSrc: 'assets/images/logos/prismcoll_logox.svg',
    logoAlt: 'Prismatic Collections',
    linkGroups: [
      {
        title: 'Navigate',
        links: [
          { label: 'Home', routerLink: '/' },
          { label: 'Collections', routerLink: '/collections' },
          { label: 'Social Links', routerLink: '/socials' },
          { label: 'News', routerLink: '/news' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', routerLink: '/privacy-policy' },
          { label: 'Terms of Use', routerLink: '/terms-of-use' }
        ]
      }
    ],
    copyrightText: 'Prismatic Collections. All rights reserved.'
  };

  /**
   * Current year for copyright display
   */
  currentYear = new Date().getFullYear();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private titleService: Title,
    private metaService: Meta
  ) {}

  /**
   * Initialize component and set up SEO meta tags
   */
  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Terms of Use - Prismatic Collections');

    // Set meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Terms of Use for Prismatic Collections website. Learn about our terms and conditions for using our creative platform.'
    });

    // Set additional meta tags
    this.metaService.updateTag({ property: 'og:title', content: 'Terms of Use - Prismatic Collections' });
    this.metaService.updateTag({ property: 'og:description', content: 'Terms of Use for Prismatic Collections website.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Enable scrolling for terms of use page
    this.document.body.classList.add('legal-page-active');
  }

  /**
   * Clean up on component destruction
   */
  ngOnDestroy(): void {
    // Restore original overflow settings when leaving page
    this.document.body.classList.remove('legal-page-active');
  }
}