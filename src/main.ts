import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { PhantasiaComponent } from './app/phantasia.component';
import { provideAnimations } from '@angular/platform-browser/animations';

// Update the configuration to include animations
const updatedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations()
  ]
};

bootstrapApplication(PhantasiaComponent, updatedConfig)
  .catch((err) => console.error(err));
