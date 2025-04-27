import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StyleOverrideDirective } from './style-override.directive';

/**
 * Interface for tracking stylesheet conflicts
 * 【✓】
 */
interface StyleConflict {
  stylesheet: string;
  selector: string;
  cssText: string;
}

/**
 * Interface for conflict tracking object
 * 【✓】
 */
interface ConflictMap {
  [selector: string]: StyleConflict[];
}

/**
 * NewCollectionsComponent
 * This component displays the collections in a layout that matches the screenshot
 * 【✓】
 */
@Component({
  selector: 'app-new-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, StyleOverrideDirective],
  templateUrl: './new-collections.component.html',
  styleUrls: ['./new-collections.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewCollectionsComponent implements OnInit, AfterViewInit {
  @ViewChild('debugContainer') debugContainer!: ElementRef;
  @ViewChild('pageHeader') pageHeader!: ElementRef;
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  @ViewChild('collectionCard') collectionCard!: ElementRef;
  
  // All available collections
  collections = [
    {
      id: 'phantasia',
      title: 'Project Phantasia',
      artist: 'Various Artists',
      year: '2023',
      tracks: 12,
      imagePath: 'assets/images/collections/phantasia-cover.jpg',
      description: 'Our flagship collection featuring a blend of orchestral and electronic music. Experience our immersive 3D interface with stunning visual effects and interactive elements.',
      tags: ['Orchestral', 'Electronic', 'Ambient', '3D Experience']
    },
    {
      id: 'ethereal-soundscapes',
      title: 'Ethereal Soundscapes',
      artist: 'Audio Architects',
      year: '2023',
      tracks: 18,
      imagePath: 'assets/images/collections/ethereal-soundscapes.jpg',
      description: 'Immersive ambient compositions that blend electronic elements with organic textures.',
      tags: ['Ambient', 'Electronic']
    }
  ];

  constructor(private renderer: Renderer2) { }

  /**
   * Initialize component
   * 【✓】
   */
  ngOnInit(): void {
    console.log('[DEBUG] NewCollections component initializing');
    console.log('[DEBUG] Expected body background color: #11141d');
    console.log('[DEBUG] Expected header background: linear-gradient(90deg, #006064, #00796B)');
    
    // Debug global styles
    const bodyStyles = window.getComputedStyle(document.body);
    console.log('[DEBUG] Actual body background:', bodyStyles.backgroundColor);
    console.log('[DEBUG] Body classes:', document.body.classList);
    
    // Check for imported or global styles
    const styleSheets = document.styleSheets;
    console.log('[DEBUG] Total stylesheets loaded:', styleSheets.length);
    
    // Forcefully apply styles to body
    this.renderer.addClass(document.body, 'new-collections-page');
    this.renderer.setStyle(document.body, 'background-color', '#11141d');
    this.renderer.setStyle(document.body, 'margin', '0');
    this.renderer.setStyle(document.body, 'padding', '0');
    this.renderer.setStyle(document.body, 'color', '#e9ecef');
    
    // Check for potentially conflicting selectors
    const conflictingSelectors = [
      '.phantasia-header', 
      '.collection-header', 
      '.collections-container', 
      '.collection-card',
      'body'
    ];
    
    this.logConflictingSelectors(styleSheets, conflictingSelectors);
  }
  
  /**
   * After view initialization, log computed styles
   * 【✓】
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log('[DEBUG] Component view initialized');
      
      // Check header styles
      if (this.pageHeader?.nativeElement) {
        const headerStyles = window.getComputedStyle(this.pageHeader.nativeElement);
        console.log('[DEBUG] Header element background:', headerStyles.background);
        console.log('[DEBUG] Header element computed styles:', {
          background: headerStyles.background,
          color: headerStyles.color,
          boxShadow: headerStyles.boxShadow
        });
      } else {
        console.log('[DEBUG] Header element not found');
      }
      
      // Check card container styles
      if (this.cardContainer?.nativeElement) {
        const containerStyles = window.getComputedStyle(this.cardContainer.nativeElement);
        console.log('[DEBUG] Card container background:', containerStyles.background);
      }
      
      // Check card styles
      if (this.collectionCard?.nativeElement) {
        const cardStyles = window.getComputedStyle(this.collectionCard.nativeElement);
        console.log('[DEBUG] Collection card background:', cardStyles.background);
        console.log('[DEBUG] Collection card computed styles:', {
          background: cardStyles.background,
          borderRadius: cardStyles.borderRadius,
          boxShadow: cardStyles.boxShadow
        });
      }
      
      // Document any style inheritance issues
      this.checkStyleInheritance();
    }, 100);
  }
  
  /**
   * Log conflicting selectors across stylesheets
   * 【✓】
   */
  private logConflictingSelectors(styleSheets: StyleSheetList, selectors: string[]): void {
    console.log('[DEBUG] Checking for conflicting selectors...');
    
    try {
      // Track conflicts by selector
      const conflicts: ConflictMap = {};
      
      // Initialize conflict tracking
      selectors.forEach(selector => {
        conflicts[selector] = [];
      });
      
      // Check each stylesheet
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const sheet = styleSheets[i];
          
          // Skip external stylesheets
          if (!sheet.href || sheet.href.includes('localhost')) {
            const rules = sheet.cssRules || sheet.rules;
            
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                
                // Check if this is a style rule
                if (rule.type === 1) { // CSSStyleRule
                  const styleRule = rule as CSSStyleRule;
                  const selectorText = styleRule.selectorText;
                  
                  // Check if this selector conflicts with our components
                  selectors.forEach(selector => {
                    if (selectorText && 
                        (selectorText === selector || 
                         selectorText.includes(selector + ' ') || 
                         selectorText.includes(' ' + selector))) {
                           
                      conflicts[selector].push({
                        stylesheet: sheet.href || 'inline',
                        selector: selectorText,
                        cssText: styleRule.cssText
                      });
                    }
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log('[DEBUG] Error accessing stylesheet', i, e);
        }
      }
      
      // Log conflicts found
      Object.keys(conflicts).forEach(selector => {
        if (conflicts[selector].length > 0) {
          console.log(`[DEBUG] Conflicts for selector "${selector}":`, conflicts[selector]);
        } else {
          console.log(`[DEBUG] No conflicts found for selector "${selector}"`);
        }
      });
    } catch (e) {
      console.error('[DEBUG] Error checking for conflicts:', e);
    }
  }
  
  /**
   * Check for style inheritance issues
   * 【✓】
   */
  private checkStyleInheritance(): void {
    console.log('[DEBUG] Checking for style inheritance issues...');
    
    // Get body and key element style properties
    const bodyStyles = window.getComputedStyle(document.body);
    const bodyColor = bodyStyles.backgroundColor;
    
    // Log which parent elements might be influencing the styles
    const parents = [];
    let parentElement = document.querySelector('.collections-container')?.parentElement;
    
    while (parentElement) {
      const styles = window.getComputedStyle(parentElement);
      parents.push({
        tagName: parentElement.tagName,
        id: parentElement.id,
        classes: parentElement.className,
        backgroundColor: styles.backgroundColor,
        position: styles.position,
        zIndex: styles.zIndex
      });
      parentElement = parentElement.parentElement;
    }
    
    console.log('[DEBUG] Parent element hierarchy that might affect styles:', parents);
  }

  /**
   * Navigate to collection details
   * 【✓】
   */
  exploreCollection(collectionId: string): void {
    console.log(`[DEBUG] Exploring collection: ${collectionId}`);
    // Add navigation logic here
  }
} 