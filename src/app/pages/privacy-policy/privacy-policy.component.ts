import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { PhantasiaFooterComponent, PhantasiaFooterConfig } from '../../shared/components/phantasia-footer/phantasia-footer.component';
import { Title, Meta } from '@angular/platform-browser';

/**
 * Privacy Policy page component for Prismatic Collections
 * Provides comprehensive privacy policy information for the website
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SiteHeaderComponent,
    PhantasiaFooterComponent
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

  /**
   * Footer configuration for the privacy policy page
   */
  footerConfig: PhantasiaFooterConfig = {
    logoSrc: 'assets/images/logos/prismcoll_logox.svg',
    logoAlt: 'Prismatic Collections',
    linkGroups: [
      {
        title: 'Navigate',
        links: [
          { label: 'Home', disabled: true },
          { label: 'Collections', disabled: true },
          { label: 'Social Links', disabled: true },
          { label: 'News', disabled: true }
        ]
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', disabled: true },
          { label: 'Terms of Use', disabled: true }
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
    this.titleService.setTitle('Privacy Policy - Prismatic Collections');

    // Set meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Privacy Policy for Prismatic Collections website. Learn how we collect, use, and protect your personal information.'
    });

    // Set additional meta tags
    this.metaService.updateTag({ property: 'og:title', content: 'Privacy Policy - Prismatic Collections' });
    this.metaService.updateTag({ property: 'og:description', content: 'Privacy Policy for Prismatic Collections website.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Enable scrolling for privacy policy page
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