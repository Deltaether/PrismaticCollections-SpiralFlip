import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

/**
 * Shared site header component
 * Provides navigation between different views and collections
 * Uses global styles from collection-header-global.scss
 * 【✓】
 */
@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header">
      <div class="header-container">
        <!-- Site Logo/Title -->
        <div class="logo-container">
          <a class="logo-link" [routerLink]="['/']">
            <img src="/assets/images/prismcoll_logox.svg" alt="Prismatic Collections" class="logo-image">
          </a>
        </div>

        <!-- Navigation -->
        <nav class="site-nav">
          <!-- Home Link (styled like other navigation items) -->
          <div class="nav-section home-tabs">
            <ul>
              <li class="home-tab" [class.active]="isActiveRoute('/')" [routerLink]="['/']">
                <span class="page-name">Home</span>
                <span class="page-description">Landing Page</span>
              </li>
            </ul>
          </div>

          <!-- Collection Tab -->
          <div class="nav-section collection-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span class="page-name">Gallery</span>
                <span class="page-description">Library</span>
              </li>
            </ul>
          </div>

          <!-- News Tab -->
          <div class="nav-section news-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/news')" [routerLink]="['/news']">
                <span class="page-name">News</span>
                <span class="page-description">Updates</span>
              </li>
            </ul>
          </div>

          <!-- Social Links Tab -->
          <div class="nav-section experience-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/socials')" [routerLink]="['/socials']">
                <span class="page-name">Circles</span>
                <span class="page-description">Socials</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['../../../pages/collections-page/collection-header-global.scss'],
  styles: [`
    // Basic Header Styles - detailed styling in collection-header-global.scss
    .site-header {
      width: 100%;
      height: 90px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 900;
      background-color: rgba(17, 17, 17, 0.95);
      backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(0, 229, 255, 0.3);

      .header-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }

    // Logo Styles
    .logo-container {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 50px;
      
      .logo-link {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        text-decoration: none;
        height: 100%;
        cursor: pointer;
      }
      
      .logo-image {
        height: 55px;
        width: auto;
        object-fit: contain;
        max-width: 280px;
        display: block;
      }
    }

    // Navigation Styles
    .site-nav {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 50px;
      margin-left: auto;
      padding-right: 50px;
      
      .nav-section {
        height: 100%;
        
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        li {
          height: 100%;
          padding: 0 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          color: #e0f7ff;
          flex-direction: column;
          justify-content: center;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          &.active {
            background-color: rgba(255, 255, 255, 0.2);
            font-weight: 500;
          }
      
          .page-name {
            font-size: 1rem;
            font-weight: 500;
          }
          
          .page-description {
            font-size: 0.7rem;
            opacity: 0.8;
          }
        }
      }
    }

    // Media Queries
    @media (max-width: 768px) {
      .site-nav {
        display: none; // Hide on mobile - would need to add mobile menu
      }
      
      .logo-container {
        margin: 0 auto;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Check if the given route is active
   * 【✓】
   */
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
} 