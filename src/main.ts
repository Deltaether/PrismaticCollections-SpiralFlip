import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScrollHelperService } from './app/shared/services/scroll-helper.service';

// Update the configuration to include animations
const updatedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    ScrollHelperService
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));
