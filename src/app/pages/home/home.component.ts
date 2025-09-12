import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
import { ResponsiveService } from '../../shared/services/responsive.service';
import { ResponsiveFromDirective, ResponsiveToDirective } from '../../shared/directives/responsive.directive';

/**
 * Main homepage component for Prismatic Collections
 * Provides navigation to different projects and site sections
 * 【✓】
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    SiteHeaderComponent, 
    SquaresAnimationComponent,
    ResponsiveFromDirective,
    ResponsiveToDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  // Cleanup subject
  private readonly destroy$ = new Subject<void>();
  
  // Flag for debug logging
  private readonly isDebugMode = false;
  
  // Responsive service integration
  public readonly screenInfo = this.responsiveService.screenInfo;
  public readonly isMobile = this.responsiveService.isMobile;
  public readonly isTablet = this.responsiveService.isTablet;
  public readonly isDesktop = this.responsiveService.isDesktop;
  public readonly isTouchDevice = this.responsiveService.isTouchDevice;
  
  // Computed layout properties
  public readonly gridColumns = computed(() => this.responsiveService.getGridColumns());
  public readonly contentMaxWidth = computed(() => this.responsiveService.getContentMaxWidth());
  
  
  // Featured content sections
  readonly featuredSections = [
    {
      id: 'phantasia-album',
      title: 'Project Phantasia - CD Album',
      description: 'Experience our immersive musical album with 3D interactive CD cases and visual storytelling',
      image: 'assets/images/albums/phantasia-cd-cover.jpg',
      route: '/phantasia/phantasia',
      isMain: true
    },
    {
      id: 'unknown-prism',
      title: '???',
      description: 'PRISM UNREADABLE - This prism appears to be corrupted ./restoration in progress...',
      image: 'assets/images/featured/prism-unreadable.svg',
      route: '/phantasia/phantasia',
      isMain: false
    }
  ];

  constructor(
    private router: Router, 
    @Inject(DOCUMENT) private document: Document,
    public responsiveService: ResponsiveService
  ) {}

  /**
   * Initialize component 
   * 【✓】
   */
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component initialized');
    }
    console.log('HOME COMPONENT LOADED - VERSION 3 (Scroll Fix Applied)');
    
    // Enable scrolling for home page by adding body class only
    this.document.body.classList.add('home-page-active');
    
    // COMPREHENSIVE DEBUGGING FOR GREY BACKGROUND ISSUE
    setTimeout(() => {
      this.debugBackgroundStyles();
    }, 100);
    
    // Additional delayed debugging to catch dynamic changes
    setTimeout(() => {
      console.log('=== DELAYED BACKGROUND DEBUG (500ms) ===');
      this.debugBackgroundStyles();
    }, 500);
    
    // Log the featuredSections to verify the correct data
    console.log('Featured Sections:', this.featuredSections);
  }

  /**
   * Comprehensive background debugging method
   */
  private debugBackgroundStyles(): void {
    const body = this.document.body;
    const html = this.document.documentElement;
    const appRoot = this.document.querySelector('app-root') as HTMLElement;
    const homeComponent = this.document.querySelector('app-home') as HTMLElement;
    const homePage = this.document.querySelector('.home-page') as HTMLElement;
    
    console.log('=== COMPREHENSIVE BACKGROUND DEBUG ===');
    
    // 1. Element identification
    console.log('1. ELEMENT IDENTIFICATION:');
    console.log('- Body element:', body);
    console.log('- HTML element:', html);
    console.log('- App-root element:', appRoot);
    console.log('- Home component element:', homeComponent);
    console.log('- Home page div:', homePage);
    
    // 2. CSS Classes
    console.log('2. CSS CLASSES:');
    console.log('- Body classes:', body.className);
    console.log('- HTML classes:', html.className);
    console.log('- App-root classes:', appRoot?.className || 'N/A');
    console.log('- Home component classes:', homeComponent?.className || 'N/A');
    console.log('- Home page classes:', homePage?.className || 'N/A');
    
    // 3. Computed background styles for all elements
    console.log('3. COMPUTED BACKGROUND STYLES:');
    this.logElementBackgroundStyles('HTML', html);
    this.logElementBackgroundStyles('BODY', body);
    if (appRoot) this.logElementBackgroundStyles('APP-ROOT', appRoot);
    if (homeComponent) this.logElementBackgroundStyles('APP-HOME', homeComponent);
    if (homePage) this.logElementBackgroundStyles('HOME-PAGE', homePage);
    
    // 4. CSS Rule inspection
    console.log('4. CSS RULE INSPECTION:');
    this.inspectCSSRules();
    
    // 5. Z-index and layering
    console.log('5. Z-INDEX AND LAYERING:');
    console.log('- HTML z-index:', getComputedStyle(html).zIndex);
    console.log('- Body z-index:', getComputedStyle(body).zIndex);
    if (appRoot) console.log('- App-root z-index:', getComputedStyle(appRoot).zIndex);
    if (homeComponent) console.log('- Home component z-index:', getComputedStyle(homeComponent).zIndex);
    if (homePage) console.log('- Home page z-index:', getComputedStyle(homePage).zIndex);
    
    // 6. Viewport and dimensions
    console.log('6. VIEWPORT AND DIMENSIONS:');
    console.log('- Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('- Body dimensions:', body.offsetWidth, 'x', body.offsetHeight);
    console.log('- Body scroll dimensions:', body.scrollWidth, 'x', body.scrollHeight);
    
    // 7. Dynamic style changes detection
    console.log('7. CHECKING FOR DYNAMIC STYLE CHANGES:');
    this.watchForStyleChanges();
  }

  /**
   * Log detailed background styles for a specific element
   */
  private logElementBackgroundStyles(elementName: string, element: HTMLElement): void {
    const computed = getComputedStyle(element);
    console.log(`--- ${elementName} BACKGROUND STYLES ---`);
    console.log(`- background: ${computed.background}`);
    console.log(`- background-color: ${computed.backgroundColor}`);
    console.log(`- background-image: ${computed.backgroundImage}`);
    console.log(`- background-size: ${computed.backgroundSize}`);
    console.log(`- background-position: ${computed.backgroundPosition}`);
    console.log(`- background-repeat: ${computed.backgroundRepeat}`);
    console.log(`- background-attachment: ${computed.backgroundAttachment}`);
    console.log(`- opacity: ${computed.opacity}`);
    console.log(`- display: ${computed.display}`);
    console.log(`- position: ${computed.position}`);
    console.log(`- top: ${computed.top}`);
    console.log(`- left: ${computed.left}`);
    console.log(`- width: ${computed.width}`);
    console.log(`- height: ${computed.height}`);
  }

  /**
   * Inspect CSS rules that might be affecting background
   */
  private inspectCSSRules(): void {
    try {
      const stylesheets = Array.from(document.styleSheets);
      console.log('Total stylesheets:', stylesheets.length);
      
      stylesheets.forEach((sheet, index) => {
        try {
          const href = sheet.href || 'inline';
          console.log(`Stylesheet ${index}: ${href}`);
          
          const rules = Array.from(sheet.cssRules || sheet.rules || []);
          const backgroundRules = rules.filter(rule => {
            const ruleText = rule.cssText || '';
            return ruleText.includes('background') && 
                   (ruleText.includes('body') || ruleText.includes('html') || 
                    ruleText.includes('app-root') || ruleText.includes('app-home') ||
                    ruleText.includes('home-page'));
          });
          
          if (backgroundRules.length > 0) {
            console.log(`Found ${backgroundRules.length} background rules in ${href}:`);
            backgroundRules.forEach(rule => {
              console.log('- Rule:', rule.cssText);
            });
          }
        } catch (e) {
          console.log(`Cannot access stylesheet ${index}:`, (e as Error).message);
        }
      });
    } catch (e) {
      console.error('Error inspecting CSS rules:', e);
    }
  }

  /**
   * Watch for dynamic style changes that might cause grey background
   */
  private watchForStyleChanges(): void {
    const elementsToWatch = [
      document.body,
      document.documentElement,
      document.querySelector('app-root'),
      document.querySelector('app-home'),
      document.querySelector('.home-page')
    ].filter(Boolean);
    
    elementsToWatch.forEach(element => {
      if (element) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
              console.log(`STYLE CHANGE DETECTED on ${element.tagName}:`, {
                attributeName: mutation.attributeName,
                oldValue: mutation.oldValue,
                newValue: element.getAttribute(mutation.attributeName || '')
              });
              
              // Re-log background styles after change
              setTimeout(() => {
                this.logElementBackgroundStyles(`${element.tagName} (AFTER CHANGE)`, element as HTMLElement);
              }, 10);
            }
          });
        });
        
        observer.observe(element, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['style', 'class']
        });
        
        // Store observer for cleanup
        if (!this.styleObservers) {
          this.styleObservers = [];
        }
        this.styleObservers.push(observer);
      }
    });
  }

  // Property to store mutation observers
  private styleObservers: MutationObserver[] = [];

  /**
   * Navigate to the selected section
   * 【✓】
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }


  /**
   * Clean up on component destruction
   * 【✓】
   */
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[Home] Component destroyed');
    }
    
    // Clean up mutation observers
    if (this.styleObservers) {
      this.styleObservers.forEach(observer => observer.disconnect());
      this.styleObservers = [];
    }
    
    // Restore original overflow settings when leaving home page
    this.document.body.classList.remove('home-page-active');
    
    this.destroy$.next();
    this.destroy$.complete();
  }
}
