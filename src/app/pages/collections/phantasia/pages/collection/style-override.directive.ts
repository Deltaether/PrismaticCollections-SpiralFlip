import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

/**
 * StyleOverrideDirective
 * Forces the correct styles for collections page design
 * 【✓】
 */
@Directive({
  standalone: true,
  selector: '[appStyleOverride]'
})
export class StyleOverrideDirective implements OnInit {
  // Collection page style variables
  private readonly styles = {
    backgroundDark: '#11141d',
    cardBackground: '#1b1e2b',
    textColor: '#e9ecef',
    accentColor: '#7240ff',
    headerGradient: 'linear-gradient(90deg, #006064, #00796B)'
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Apply styles on init
   * 【✓】
   */
  ngOnInit() {
    console.log('[StyleOverrideDirective] Applying global styles for collections');
    this.applyGlobalStyles();
    this.applyComponentStyles();
  }

  /**
   * Apply styles to global elements
   * 【✓】
   */
  private applyGlobalStyles() {
    // Apply to document body with !important flag
    document.body.setAttribute('style', 
      `background-color: ${this.styles.backgroundDark} !important; 
       color: ${this.styles.textColor} !important; 
       margin: 0 !important; 
       padding: 0 !important;`
    );
    this.renderer.addClass(document.body, 'collections-themed-page');
    
    // Apply to html
    document.documentElement.setAttribute('style',
      `background-color: ${this.styles.backgroundDark} !important;`
    );
    
    // Find and override any parent containers
    let parent = this.el.nativeElement.parentElement;
    while (parent) {
      parent.setAttribute('style', 
        `background-color: ${this.styles.backgroundDark} !important;`
      );
      parent = parent.parentElement;
    }
    
    // Force any router-outlet to take full width/height
    const routerOutlets = document.querySelectorAll('router-outlet');
    routerOutlets.forEach(outlet => {
      // Get next sibling which is the rendered component
      let sibling = outlet.nextElementSibling;
      if (sibling) {
        sibling.setAttribute('style',
          `background-color: ${this.styles.backgroundDark} !important;
           min-height: 100vh !important;
           width: 100% !important;`
        );
      }
    });
    
    // Create a style element with high-specificity rules
    this.injectGlobalStyles();
  }

  /**
   * Apply styles to component elements
   * 【✓】
   */
  private applyComponentStyles() {
    // Style the host element
    this.el.nativeElement.setAttribute('style',
      `background-color: ${this.styles.backgroundDark} !important;
       color: ${this.styles.textColor} !important;
       min-height: 100vh !important;
       display: block !important;
       width: 100% !important;`
    );
    
    // Style header if present
    const header = this.el.nativeElement.querySelector('.phantasia-header');
    if (header) {
      header.setAttribute('style',
        `background: ${this.styles.headerGradient} !important;
         width: 100% !important;
         z-index: 100 !important;
         display: flex !important;
         align-items: center !important;
         justify-content: space-between !important;
         padding: 0.5rem 1rem !important;
         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;`
      );
    }
    
    // Style collection cards
    const cards = this.el.nativeElement.querySelectorAll('.collection-card');
    cards.forEach((card: Element) => {
      card.setAttribute('style',
        `background: ${this.styles.cardBackground} !important;
         display: flex !important;
         border-radius: 0.5rem !important;
         overflow: hidden !important;
         margin-bottom: 2rem !important;
         box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;`
      );
    });
  }
  
  /**
   * Inject global styles with high specificity
   * 【✓】
   */
  private injectGlobalStyles() {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'collection-override-styles');
    
    // Add CSS rules with high specificity
    styleEl.innerHTML = `
      html body, html .collections-themed-page, body .collections-themed-page {
        background-color: ${this.styles.backgroundDark} !important;
        color: ${this.styles.textColor} !important;
      }
      
      html body .phantasia-header, 
      body.collections-themed-page .phantasia-header {
        background: ${this.styles.headerGradient} !important;
        color: white !important;
      }
      
      html body .collection-card,
      body.collections-themed-page .collection-card {
        background: ${this.styles.cardBackground} !important;
      }
      
      html body .collections-container,
      body.collections-themed-page .collections-container {
        background-color: ${this.styles.backgroundDark} !important;
      }
    `;
    
    // Add to head
    document.head.appendChild(styleEl);
  }
}
