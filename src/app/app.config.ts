import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ScrollHelperService } from './shared/services/scroll-helper.service';
import { PerformancePreloadStrategy } from './shared/services/preload-strategy.service';

/**
 * Main application configuration
 * Uses app.routes.ts which has HomeComponent at root path
 * 【✓】
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PerformancePreloadStrategy)),
    provideHttpClient(),
    ScrollHelperService,
    PerformancePreloadStrategy
  ]
}; 