import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

/**
 * Shared site header component
 * Provides navigation between different views and collections
 * Based on the Phantasia header design
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
            <img src="/assets/graphic/prismcoll_logox.svg" alt="Prismatic Collections" class="logo-image">
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

          <!-- Collection Tabs -->
          <div class="nav-section collection-tabs">
            <h2 class="visually-hidden">Collections</h2>
            <ul>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span>Prismatic Collections</span>
              </li>
            </ul>
          </div>

          <!-- Page Tabs -->
          <div class="nav-section page-tabs">
            <h2 class="visually-hidden">Pages</h2>
            <ul>
              <li [class.active]="isActiveRoute('/phantasia/introduction')" [routerLink]="['/phantasia/introduction']">
                <span class="page-name">Experience</span>
                <span class="page-description">3D Experience</span>
              </li>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span class="page-name">Collection</span>
                <span class="page-description">Album Info</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    // Variables
    $header-height: 90px;
    $primary-color: #f5d884;
    $background-color: rgba(0, 0, 0, 0.8);
    $accent-color: #ff4081;
    $text-color: white;
    $active-tab-color: linear-gradient(to right, rgba(255, 100, 50, 0.8), rgba(255, 150, 70, 0.8));
    $inactive-tab-color: rgba(255, 255, 255, 0.1);
    $tab-hover-color: rgba(255, 255, 255, 0.2);
    $tab-transition: all 0.3s ease;
    $border-glow: 0 0 10px rgba(255, 150, 70, 0.5);

    // Header Styles
    .site-header {
      width: 100%;
      height: $header-height;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 900;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      background-color: $background-color;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);

      .header-container {
        max-width: 1400px;
        height: 100%;
        margin: 0 auto;
        padding: 0 30px 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    // Logo Styles
    .logo-container {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 15px;
      
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
        height: 60px;
        width: auto;
        object-fit: contain;
        max-width: 300px;
        display: block;
        filter: drop-shadow(0 0 5px rgba(245, 216, 132, 0.3));
        transition: filter 0.3s ease;
        
        &:hover {
          filter: drop-shadow(0 0 8px rgba(245, 216, 132, 0.5));
        }
      }
    }

    // Navigation Styles
    .site-nav {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 30px;
      
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
          color: white;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          &.active {
            background: linear-gradient(to right, rgba(255, 100, 50, 0.8), rgba(255, 150, 70, 0.8));
            
            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              background-color: #f5d884;
              box-shadow: 0 0 10px rgba(255, 150, 70, 0.5);
            }
          }
        }
      }
    }

    // Home Tabs Styles
    .home-tabs li {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 5px;
      
      .page-name {
        font-weight: 500;
        font-size: 1rem;
      }
      
      .page-description {
        font-size: 0.7rem;
        opacity: 0.6;
        margin-top: 2px;
      }
    }

    // Collection Tabs Styles
    .collection-tabs li {
      font-weight: 600;
      font-size: 1.1rem;
    }

    // Page Tabs Styles
    .page-tabs li {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 5px;
      
      .page-name {
        font-weight: 500;
        font-size: 1rem;
      }
      
      .page-description {
        font-size: 0.7rem;
        opacity: 0.6;
        margin-top: 2px;
      }
    }

    // Accessibility Helper
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    // Media Queries
    @media (max-width: 768px) {
      .site-header {
        height: auto;
        padding: 10px 0;
        
        .header-container {
          flex-direction: column;
          padding: 10px;
        }
      }
      
      .site-nav {
        width: 100%;
        margin-top: 15px;
        flex-direction: column;
        gap: 10px;
        
        .nav-section ul {
          width: 100%;
          justify-content: center;
        }
      }
      
      .logo-container .logo-image {
        height: 45px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Check if the current route matches the provided route
   * 【✓】
   */
  isActiveRoute(route: string): boolean {
    return this.router.url === route || 
           (route === '/' && this.router.url === '/home');
  }
} 