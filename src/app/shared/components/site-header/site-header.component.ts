import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ResponsiveService } from '../../services/responsive.service';
import { ResponsiveDirective, ResponsiveFromDirective, ResponsiveToDirective } from '../../directives/responsive.directive';

/**
 * Shared site header component
 * Provides navigation between different views and collections
 * Uses global styles from collection-header-global.scss
 * 【✓】
 */
@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ResponsiveDirective, ResponsiveFromDirective, ResponsiveToDirective],
  template: `
    <header class="site-header">
      <div class="header-container">
        <!-- Site Logo/Title -->
        <div class="logo-container">
          <a class="logo-link" [routerLink]="['/']">
            <img src="/assets/images/prismcoll_logox.svg" alt="Prismatic Collections" class="logo-image">
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *appResponsiveTo="'tablet'">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <!-- Desktop Navigation -->
        <nav class="site-nav" *appResponsiveFrom="'desktop'">
          <!-- Home Link -->
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

        <!-- Tablet Navigation (Compact) -->
        <nav class="site-nav tablet-nav" *appResponsive="'tablet'">
          <div class="nav-section">
            <ul>
              <li [class.active]="isActiveRoute('/')" [routerLink]="['/']">
                <span class="page-name">Home</span>
              </li>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span class="page-name">Gallery</span>
              </li>
              <li [class.active]="isActiveRoute('/news')" [routerLink]="['/news']">
                <span class="page-name">News</span>
              </li>
              <li [class.active]="isActiveRoute('/socials')" [routerLink]="['/socials']">
                <span class="page-name">Socials</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Mobile Overlay Menu -->
      <div class="mobile-menu-overlay" 
           [class.open]="mobileMenuOpen()" 
           (click)="closeMobileMenu()"
           *appResponsiveTo="'tablet'">
        <nav class="mobile-nav">
          <ul>
            <li [routerLink]="['/']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/')">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Home</span>
            </li>
            <li [routerLink]="['/collections']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/collections')">
              <span class="nav-icon">🎨</span>
              <span class="nav-text">Gallery</span>
            </li>
            <li [routerLink]="['/news']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/news')">
              <span class="nav-icon">📰</span>
              <span class="nav-text">News</span>
            </li>
            <li [routerLink]="['/socials']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/socials')">
              <span class="nav-icon">🌐</span>
              <span class="nav-text">Socials</span>
            </li>
          </ul>
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
      z-index: 1000;
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

    // Mobile Menu Toggle Button
    .mobile-menu-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 4px;
      z-index: 1001;
      
      .hamburger-line {
        width: 24px;
        height: 3px;
        background-color: #e0f7ff;
        transition: all 0.3s ease;
        border-radius: 2px;
      }
      
      &.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      &.active .hamburger-line:nth-child(2) {
        opacity: 0;
      }
      
      &.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
    
    // Mobile Menu Overlay
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      
      &.open {
        opacity: 1;
        visibility: visible;
      }
      
      .mobile-nav {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          
          li {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 2rem;
            color: #e0f7ff;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            min-height: 60px; // Touch-friendly target size
            
            &:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }
            
            &.active {
              background-color: rgba(255, 255, 255, 0.2);
              font-weight: 600;
            }
            
            .nav-icon {
              font-size: 1.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
            }
            
            .nav-text {
              font-size: 1.2rem;
              font-weight: 500;
            }
          }
        }
      }
    }
    
    // Tablet Navigation Compact Styles
    .tablet-nav {
      gap: 20px !important;
      padding-right: 30px !important;
      
      .nav-section ul {
        gap: 10px !important;
        
        li {
          padding: 0 15px !important;
          
          .page-name {
            font-size: 0.9rem !important;
          }
        }
      }
    }
    
    // Responsive Logo Adjustments
    @media (max-width: 1023px) {
      .logo-container {
        padding-left: 20px;
        
        .logo-image {
          height: 45px;
          max-width: 220px;
        }
      }
    }
    
    @media (max-width: 767px) {
      .logo-container {
        padding-left: 15px;
        
        .logo-image {
          height: 40px;
          max-width: 180px;
        }
      }
      
      .site-header {
        height: 70px;
      }
    }
    
    // Safe area support for devices with notches
    @supports (padding-top: env(safe-area-inset-top)) {
      .site-header {
        padding-top: env(safe-area-inset-top);
        height: calc(90px + env(safe-area-inset-top));
        
        @media (max-width: 767px) {
          height: calc(70px + env(safe-area-inset-top));
        }
      }
      
      .mobile-menu-overlay {
        padding-top: env(safe-area-inset-top);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeaderComponent implements OnInit {
  
  // Mobile menu state
  public readonly mobileMenuOpen = signal(false);
  
  // Responsive service integration
  public readonly isMobile = this.responsiveService.isMobile;
  public readonly isTablet = this.responsiveService.isTablet;
  public readonly isDesktop = this.responsiveService.isDesktop;
  public readonly isTouchDevice = this.responsiveService.isTouchDevice;

  constructor(
    private router: Router,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {}

  /**
   * Check if the given route is active
   * 【✓】
   */
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
  
  /**
   * Toggle mobile menu visibility
   * 【✓】
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
    
    // Prevent body scrolling when menu is open
    if (this.mobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Close mobile menu
   * 【✓】
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }
} 