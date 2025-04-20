import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/pages/collections/phantasia/phantasia.config';
import { PhantasiaComponent } from './app/pages/collections/phantasia/phantasia.component';
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

bootstrapApplication(PhantasiaComponent, updatedConfig)
  .catch((err) => console.error(err));
