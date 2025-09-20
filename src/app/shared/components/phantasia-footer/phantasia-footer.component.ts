import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Configuration interface for footer links
 */
export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

/**
 * Individual footer link interface
 */
export interface FooterLink {
  label: string;
  routerLink?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

/**
 * Footer configuration interface
 */
export interface PhantasiaFooterConfig {
  logoSrc: string;
  logoAlt: string;
  linkGroups: FooterLinkGroup[];
  copyrightText?: string;
  customYear?: number;
}

/**
 * Shared Phantasia Footer Component
 *
 * A reusable footer component designed for both Phantasia 1 and Phantasia 2 pages.
 * Eliminates code duplication and provides clean, maintainable footer implementation
 * without style conflicts or !important declarations.
 *
 * Features:
 * - Configurable content through input properties
 * - Proper CSS encapsulation without style conflicts
 * - Responsive design with mobile-first approach
 * - Professional grid layout with three columns
 * - Clean typography and spacing using clamp() functions
 * - Accessible link navigation with proper focus states
 */
@Component({
  selector: 'app-phantasia-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './phantasia-footer.component.html',
  styleUrls: ['./phantasia-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Use None encapsulation to avoid conflicts while maintaining isolation through specific class names
  encapsulation: ViewEncapsulation.None
})
export class PhantasiaFooterComponent {
  /**
   * Footer configuration object containing all footer data
   */
  @Input() config: PhantasiaFooterConfig | null = null;

  /**
   * Optional override for the current year display
   * If not provided, will use the current year
   */
  @Input() currentYear?: number;

  /**
   * Get the current year for copyright display
   */
  get displayYear(): number {
    return this.currentYear || new Date().getFullYear();
  }

  /**
   * Default footer configuration for Phantasia pages
   * This provides a fallback configuration if no config is provided
   * NOTE: Links are disabled by default to prevent navigation during development
   */
  get defaultConfig(): PhantasiaFooterConfig {
    return {
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
  }

  /**
   * Get the active configuration (provided config or default)
   */
  get activeConfig(): PhantasiaFooterConfig {
    return this.config || this.defaultConfig;
  }

  /**
   * Track function for ngFor optimization
   */
  trackByIndex(index: number): number {
    return index;
  }

  /**
   * Track function for link groups
   */
  trackByTitle(index: number, item: FooterLinkGroup): string {
    return item.title;
  }

  /**
   * Track function for individual links
   */
  trackByLabel(index: number, item: FooterLink): string {
    return item.label;
  }
}