/**
 * 【✓】 Utility to ensure the header styling is correctly applied
 * on collection pages
 */
export class CollectionHeaderFix {
  /**
   * Apply header styling for collections page
   * Forces the correct styling to be applied to the header
   */
  static applyHeaderStyles(): void {
    // Check if we're on the collections page
    const isCollectionsPage = window.location.pathname.includes('/collections');
    
    if (isCollectionsPage) {
      // Add the necessary class to the body
      document.body.classList.add('collections-page');
      
      // Get header element
      const header = document.querySelector('.site-header');
      if (header) {
        // Force new styles
        header.classList.add('collections-header');
        
        // Apply inline styles as a backup
        const headerStyles = {
          'backdrop-filter': 'blur(15px)',
          'background-color': 'rgba(2, 20, 30, 0.90)',
          'border-bottom': '1px solid rgba(0, 229, 255, 0.3)',
          'box-shadow': '0 0 25px rgba(0, 0, 0, 0.5)'
        };
        
        Object.entries(headerStyles).forEach(([prop, value]) => {
          (header as HTMLElement).style.setProperty(prop, value, 'important');
        });
        
        // Fix active nav items
        const activeNavItems = document.querySelectorAll('.nav-section li.active');
        activeNavItems.forEach(item => {
          (item as HTMLElement).style.background = 'linear-gradient(135deg, rgba(0, 59, 79, 0.8) 0%, rgba(0, 80, 105, 0.8) 100%)';
          (item as HTMLElement).style.color = '#ffd700';
          (item as HTMLElement).style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
          item.classList.add('collections-active-item');
          
          // Find the ::after element and style it
          const afterElement = item.querySelector('::after');
          if (afterElement) {
            (afterElement as HTMLElement).style.backgroundColor = '#ffd700';
            (afterElement as HTMLElement).style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
          }
        });
      }
    }
  }
  
  /**
   * Clean up styles when navigating away
   */
  static cleanupHeaderStyles(): void {
    document.body.classList.remove('collections-page');
    
    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.remove('collections-header');
    }
    
    const activeNavItems = document.querySelectorAll('.collections-active-item');
    activeNavItems.forEach(item => {
      item.classList.remove('collections-active-item');
    });
  }
} 