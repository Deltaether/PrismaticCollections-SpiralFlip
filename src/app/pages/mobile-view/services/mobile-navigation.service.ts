import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileNavigationService {
  // Current page index (✓)
  private currentPageIndex = new BehaviorSubject<number>(0);
  
  // Total number of pages (✓)
  private readonly totalPages = 2;
  
  // Animation state (✓)
  private isAnimating = new BehaviorSubject<boolean>(false);
  
  // Cubic rotation data (✓)
  private cubicRotation = new BehaviorSubject<{ x: number, y: number }>({ x: 0, y: 0 });

  constructor() { }
  
  // Get the current page index as an observable (✓)
  getCurrentPageIndex(): Observable<number> {
    return this.currentPageIndex.asObservable();
  }
  
  // Get the current page index as a value (✓)
  getCurrentPageValue(): number {
    return this.currentPageIndex.value;
  }
  
  // Get animation state (✓)
  getAnimationState(): Observable<boolean> {
    return this.isAnimating.asObservable();
  }
  
  // Get cubic rotation (✓)
  getCubicRotation(): Observable<{ x: number, y: number }> {
    return this.cubicRotation.asObservable();
  }
  
  // Navigate to the next page with cubic animation (✓)
  navigateToNextPage(): void {
    if (this.isAnimating.value) return;
    
    const nextIndex = (this.currentPageIndex.value + 1) % this.totalPages;
    this.navigateToPage(nextIndex);
  }
  
  // Navigate to the previous page with cubic animation (✓)
  navigateToPreviousPage(): void {
    if (this.isAnimating.value) return;
    
    const prevIndex = (this.currentPageIndex.value - 1 + this.totalPages) % this.totalPages;
    this.navigateToPage(prevIndex);
  }
  
  // Navigate to a specific page (✓)
  navigateToPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.totalPages || this.isAnimating.value) {
      return;
    }
    
    this.isAnimating.next(true);
    
    // Calculate rotation based on current and target page
    const currentY = this.cubicRotation.value.y;
    let newY = 0;
    
    if (pageIndex > this.currentPageIndex.value) {
      // Moving forward (clockwise)
      newY = currentY - 90;
    } else if (pageIndex < this.currentPageIndex.value) {
      // Moving backward (counter-clockwise)
      newY = currentY + 90;
    }
    
    // Update rotation
    this.cubicRotation.next({ x: 0, y: newY });
    
    // Set the current page after a short delay to allow animation to complete
    setTimeout(() => {
      this.currentPageIndex.next(pageIndex);
      this.isAnimating.next(false);
    }, 500); // Animation duration
  }
}
