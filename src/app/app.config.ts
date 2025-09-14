import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ScrollHelperService } from './shared/services/scroll-helper.service';
import { SelectivePreloadStrategy } from './core/strategies/selective-preload.strategy';

/**
 * Main application configuration
 * Uses app.routes.ts which has HomeComponent at root path
 * 【✓】
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadStrategy)),
    provideHttpClient(),
    ScrollHelperService,
    SelectivePreloadStrategy
  ]
}; 