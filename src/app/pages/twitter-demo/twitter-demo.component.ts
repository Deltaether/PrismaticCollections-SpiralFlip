import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { TwitterFeedComponent } from '../../components/twitter-feed/twitter-feed.component';

/**
 * Twitter Demo Page
 *
 * Demonstrates the Twitter integration with proper CORS handling
 * and fallback mechanisms. This page showcases:
 *
 * 1. Twitter Embed Widget (primary integration)
 * 2. Fallback tweet display
 * 3. Error handling and user feedback
 * 4. Responsive design
 *
 * Created to resolve the "user not found" error by implementing
 * a CORS-compliant Twitter integration strategy.
 */
@Component({
  selector: 'app-twitter-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SiteHeaderComponent,
    TwitterFeedComponent
  ],
  templateUrl: './twitter-demo.component.html',
  styleUrl: './twitter-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwitterDemoComponent {

  constructor() {}

  /**
   * Navigate back to news page
   */
  navigateToNews(): void {
    window.location.href = '/news';
  }

  /**
   * Open Twitter profile
   */
  openTwitterProfile(): void {
    window.open('https://x.com/prismcollect_', '_blank', 'noopener,noreferrer');
  }

  /**
   * Copy link to this demo
   */
  copyDemoLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      console.log('Demo link copied to clipboard');
    }).catch(() => {
      console.warn('Failed to copy demo link');
    });
  }
}