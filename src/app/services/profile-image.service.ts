import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, timer } from 'rxjs';
import { catchError, tap, map, retry, switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ProfileImageCacheEntry {
  url: string;
  timestamp: number;
  failed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api.baseUrl}/twitter`;

  // Cache for profile image URLs and their states
  private readonly imageCache = new Map<string, ProfileImageCacheEntry>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly DEFAULT_AVATAR = '/assets/images/default-avatar.svg';

  // Reactive cache state
  private readonly _cacheState = new BehaviorSubject<Map<string, ProfileImageCacheEntry>>(new Map());
  readonly cacheState$ = this._cacheState.asObservable();

  // Loading states for individual images
  private readonly loadingStates = new Map<string, BehaviorSubject<boolean>>();

  constructor() {
    // Load cache from localStorage on initialization
    this.loadCacheFromStorage();

    // Clean up expired cache entries periodically
    timer(0, 60 * 60 * 1000).subscribe(() => { // Every hour
      this.cleanExpiredCache();
    });
  }

  /**
   * Get profile image URL for a username with intelligent caching
   */
  getProfileImageUrl(username: string): Observable<string> {
    if (!username) {
      return of(this.DEFAULT_AVATAR);
    }

    const cached = this.imageCache.get(username);
    const now = Date.now();

    // Return cached URL if valid and not expired
    if (cached && !cached.failed && (now - cached.timestamp) < this.CACHE_DURATION) {
      return of(cached.url);
    }

    // If previously failed and not enough time has passed, return default
    if (cached?.failed && (now - cached.timestamp) < (5 * 60 * 1000)) { // 5 minute retry delay
      return of(this.DEFAULT_AVATAR);
    }

    // Check if already loading this image
    if (!this.loadingStates.has(username)) {
      this.loadingStates.set(username, new BehaviorSubject<boolean>(false));
    }

    const loadingState = this.loadingStates.get(username)!;

    // If already loading, return the loading observable
    if (loadingState.value) {
      return loadingState.pipe(
        switchMap(() => {
          const latestCached = this.imageCache.get(username);
          return of(latestCached?.failed ? this.DEFAULT_AVATAR : latestCached?.url || this.DEFAULT_AVATAR);
        })
      );
    }

    // Start loading
    loadingState.next(true);

    return this.checkProfileImageExists(username).pipe(
      map(exists => {
        const url = exists
          ? `${this.apiUrl}/profile-image/${username}?t=${Date.now()}`
          : this.DEFAULT_AVATAR;

        // Cache the result
        this.imageCache.set(username, {
          url,
          timestamp: now,
          failed: !exists
        });

        this.saveCacheToStorage();
        this._cacheState.next(new Map(this.imageCache));
        loadingState.next(false);

        return url;
      }),
      catchError(() => {
        // Cache the failure
        this.imageCache.set(username, {
          url: this.DEFAULT_AVATAR,
          timestamp: now,
          failed: true
        });

        this.saveCacheToStorage();
        this._cacheState.next(new Map(this.imageCache));
        loadingState.next(false);

        return of(this.DEFAULT_AVATAR);
      }),
      shareReplay(1)
    );
  }

  /**
   * Check if profile image exists on server
   */
  private checkProfileImageExists(username: string): Observable<boolean> {
    return this.http.head(`${this.apiUrl}/profile-image/${username}`, {
      observe: 'response'
    }).pipe(
      map(response => response.status === 200),
      retry({ count: 2, delay: 1000 }),
      catchError(() => of(false))
    );
  }

  /**
   * Preload profile images for multiple usernames
   */
  preloadProfileImages(usernames: string[]): void {
    const uniqueUsernames = [...new Set(usernames)].filter(Boolean);

    // Batch load images with a small delay between requests to avoid overwhelming the server
    uniqueUsernames.forEach((username, index) => {
      timer(index * 100).subscribe(() => {
        this.getProfileImageUrl(username).subscribe();
      });
    });
  }

  /**
   * Get loading state for a specific username
   */
  getLoadingState(username: string): Observable<boolean> {
    if (!this.loadingStates.has(username)) {
      this.loadingStates.set(username, new BehaviorSubject<boolean>(false));
    }
    return this.loadingStates.get(username)!.asObservable();
  }

  /**
   * Clear cache for specific username
   */
  clearUserCache(username: string): void {
    this.imageCache.delete(username);
    this.saveCacheToStorage();
    this._cacheState.next(new Map(this.imageCache));
  }

  /**
   * Clear all cached images
   */
  clearAllCache(): void {
    this.imageCache.clear();
    this.saveCacheToStorage();
    this._cacheState.next(new Map(this.imageCache));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { total: number; failed: number; valid: number; expired: number } {
    const now = Date.now();
    let failed = 0;
    let valid = 0;
    let expired = 0;

    for (const entry of this.imageCache.values()) {
      if (entry.failed) {
        failed++;
      } else if ((now - entry.timestamp) > this.CACHE_DURATION) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.imageCache.size,
      failed,
      valid,
      expired
    };
  }

  private loadCacheFromStorage(): void {
    try {
      const cached = localStorage.getItem('profile-image-cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.imageCache.clear();

        Object.entries(parsed).forEach(([username, entry]) => {
          this.imageCache.set(username, entry as ProfileImageCacheEntry);
        });

        this._cacheState.next(new Map(this.imageCache));
      }
    } catch (error) {
      console.warn('Failed to load profile image cache from localStorage:', error);
    }
  }

  private saveCacheToStorage(): void {
    try {
      const cacheObject = Object.fromEntries(this.imageCache.entries());
      localStorage.setItem('profile-image-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save profile image cache to localStorage:', error);
    }
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [username, entry] of this.imageCache.entries()) {
      // Remove entries older than 7 days or failed entries older than 1 hour
      const expireTime = entry.failed ? (60 * 60 * 1000) : (7 * 24 * 60 * 60 * 1000);

      if ((now - entry.timestamp) > expireTime) {
        this.imageCache.delete(username);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.saveCacheToStorage();
      this._cacheState.next(new Map(this.imageCache));
      console.log(`Profile image cache: cleaned ${cleaned} expired entries`);
    }
  }
}