import { ApplicationConfig } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './phantasia.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing() // Enable router tracing for debugging
    ),
    provideHttpClient()
  ]
};
