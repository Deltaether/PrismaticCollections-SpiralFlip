import { Component } from '@angular/core';
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
export class PhantasiaLayoutComponent {
  /**
   * Current year for the copyright text
   * 【✓】
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }
} 