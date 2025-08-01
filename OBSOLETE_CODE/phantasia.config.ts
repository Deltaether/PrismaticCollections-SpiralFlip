import { ApplicationConfig } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from '../../../app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * Application configuration for Phantasia
 * Now using consolidated routes from app.routes.ts
 * 【✓】
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing() // Enable router tracing for debugging
    ),
    provideHttpClient()
  ]
};
