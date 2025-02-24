import { ApplicationConfig } from '@angular/core';
import { PreloaderService } from './services/preloader.service';
import { provideRouter } from '@angular/router';
import { routes } from './phantasia.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    PreloaderService,
    provideRouter(routes),
    provideHttpClient()
  ]
};
