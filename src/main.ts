import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/phantasia.config';
import { PhantasiaComponent } from './app/phantasia.component';

bootstrapApplication(PhantasiaComponent, appConfig)
  .catch((err) => console.error(err));
