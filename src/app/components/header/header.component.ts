import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

/**
 * Main website header component
 * Provides navigation between different views and collections
 * 【✓】
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
    '../../pages/collections/phantasia/pages/collection/phantasia-header.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  readonly collections = [
    { id: 'phantasia', name: 'Prismatic Collections', active: true, route: '/introduction' }
  ];
  
  readonly pages = [
    { id: 'experience', name: 'Experience', active: true, route: '/introduction', description: '3D Experience' },
    { id: 'collection', name: 'Collection', active: false, route: '/collections', description: 'Album Info' }
  ];
  
  activeCollectionId = 'phantasia';
  activePageId = 'experience';
  isDebugMode = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveTabsBasedOnRoute();
  }

  /**
   * Sets active navigation state based on current route
   * Determines which collection and page should be highlighted
   * 【✓】
   */
  private setActiveTabsBasedOnRoute(): void {
    const currentUrl = this.router.url;
    
    if (this.isDebugMode) {
      console.log('[Header] Current route:', currentUrl);
    }
    
    // Update collection tabs
    this.collections.forEach(collection => {
      collection.active = currentUrl.includes(collection.route);
    });
    
    // Update page tabs
    this.pages.forEach(page => {
      page.active = currentUrl === page.route;
    });
    
    // Set active IDs
    const activeCollection = this.collections.find(c => c.active);
    if (activeCollection) {
      this.activeCollectionId = activeCollection.id;
    }
    
    const activePage = this.pages.find(p => p.active);
    if (activePage) {
      this.activePageId = activePage.id;
    }
  }

  /**
   * Navigates to the selected collection
   * Updates active state for collection tabs
   * 【✓】
   */
  navigateToCollection(collectionId: string): void {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) return;
    
    // Update active states
    this.collections.forEach(c => c.active = c.id === collectionId);
    this.activeCollectionId = collectionId;
    
    // Navigate to the collection route
    this.router.navigate([collection.route]);
    
    if (this.isDebugMode) {
      console.log(`[Header] Navigated to collection: ${collectionId}`);
    }
  }
  
  /**
   * Navigates to the selected page
   * Updates active state for page tabs
   * 【✓】
   */
  navigateToPage(pageId: string): void {
    const page = this.pages.find(p => p.id === pageId);
    if (!page) return;
    
    // Update active states
    this.pages.forEach(p => p.active = p.id === pageId);
    this.activePageId = pageId;
    
    // Navigate to the page route
    this.router.navigate([page.route]);
    
    if (this.isDebugMode) {
      console.log(`[Header] Navigated to page: ${pageId}`);
    }
  }
  
  /**
   * Navigates to the home page
   * This is separate from the Phantasia project navigation
   * 【✓】
   */
  navigateToHome(): void {
    // Navigate to root path with a hard reload to ensure complete state reset
    window.location.href = '/';
    
    if (this.isDebugMode) {
      console.log('[Header] Navigated to home page with window.location');
    }
  }
} 