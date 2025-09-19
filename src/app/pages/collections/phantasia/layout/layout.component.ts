import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../../../../shared/components/site-header/site-header.component';

/**
 * Phantasia project layout component
 * Contains the app header, main content area for Phantasia pages, and footer
 * 【✓】
 */
@Component({
  selector: 'app-phantasia-layout',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class PhantasiaLayoutComponent implements AfterViewInit, OnDestroy {
  private resizeObserver?: ResizeObserver;

  /**
   * Current year for the copyright text
   * 【✓】
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  /**
   * Apply direct JavaScript override for footer logo sizing
   * This is an emergency fix since CSS !important rules are not taking effect
   * 【✓】
   */
  ngAfterViewInit(): void {
    // Use multiple timing strategies to ensure the footer is fully rendered
    setTimeout(() => this.fixFooterLogoSizing(), 500);
    setTimeout(() => this.fixFooterLogoSizing(), 1000);
    setTimeout(() => this.fixFooterLogoSizing(), 2000);

    // Watch for dynamic content changes and reapply fix
    this.resizeObserver = new ResizeObserver(() => {
      this.fixFooterLogoSizing();
    });

    // Also observe document body for changes
    setTimeout(() => {
      const footerElement = document.querySelector('.phantasia-footer');
      if (footerElement) {
        this.resizeObserver?.observe(footerElement);
      }

      // Fallback: observe document body
      this.resizeObserver?.observe(document.body);
    }, 100);
  }

  /**
   * Clean up ResizeObserver
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Direct JavaScript manipulation to fix footer logo sizing
   * Overrides any CSS that isn't working due to Angular encapsulation
   * 【✓】
   */
  private fixFooterLogoSizing(): void {
    const footerLogo = document.querySelector('.footer-logo img') as HTMLImageElement;
    if (footerLogo) {
      // Check if already correctly sized to avoid unnecessary work
      const currentRect = footerLogo.getBoundingClientRect();
      if (currentRect.width <= 150) {
        // Already correctly sized, no need to reapply
        return;
      }

      // Apply responsive sizing directly via JavaScript
      const screenWidth = window.innerWidth;

      // Remove any existing styles that might conflict
      footerLogo.style.removeProperty('width');
      footerLogo.style.removeProperty('max-width');
      footerLogo.style.removeProperty('min-width');

      // Apply responsive sizing based on screen width
      if (screenWidth <= 768) {
        // Mobile devices
        footerLogo.style.setProperty('max-width', '100px', 'important');
        footerLogo.style.setProperty('width', '80px', 'important');
      } else if (screenWidth >= 1200) {
        // Large screens
        footerLogo.style.setProperty('max-width', '140px', 'important');
        footerLogo.style.setProperty('width', '120px', 'important');
      } else {
        // Medium screens (tablets/small desktops)
        footerLogo.style.setProperty('max-width', '120px', 'important');
        footerLogo.style.setProperty('width', '100px', 'important');
      }

      // Apply common properties
      footerLogo.style.setProperty('height', 'auto', 'important');
      footerLogo.style.setProperty('object-fit', 'contain', 'important');
      footerLogo.style.setProperty('filter', 'brightness(0) invert(1)', 'important');
      footerLogo.style.setProperty('min-width', '80px', 'important');

      console.log('🔧 Footer logo sizing applied via Angular JavaScript override:', {
        screenWidth,
        appliedWidth: footerLogo.style.width,
        appliedMaxWidth: footerLogo.style.maxWidth,
        actualWidth: footerLogo.getBoundingClientRect().width
      });
    }
  }
} 