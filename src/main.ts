import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScrollHelperService } from './app/shared/services/scroll-helper.service';
import { BrowserOptimizationService } from './app/shared/services/browser-optimization.service';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Update the configuration to include animations
const updatedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    ScrollHelperService,
    BrowserOptimizationService,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));
