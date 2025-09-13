import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ScrollHelperService } from './shared/services/scroll-helper.service';

/**
 * Main application configuration
 * Uses app.routes.ts which has HomeComponent at root path
 * 【✓】
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ScrollHelperService
  ]
}; 