import { Routes } from '@angular/router';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { DiscOneComponent } from './pages/disc-one/disc-one.component';
import { DiscTwoComponent } from './pages/disc-two/disc-two.component';
import { PvComponent } from './pages/pv/pv.component';
import { InformationComponent } from './pages/information/information.component';
import { MobileViewComponent } from './mobile/mobile-view.component';
import { MobileHomeComponent } from './mobile/pages/mobile-home/mobile-home.component';
import { MobileMusicComponent } from './mobile/pages/mobile-music/mobile-music.component';
import { MobileAboutComponent } from './mobile/pages/mobile-about/mobile-about.component';
import { MobileContactComponent } from './mobile/pages/mobile-contact/mobile-contact.component';
import { MobileCreditsComponent } from './mobile/pages/mobile-credits/mobile-credits.component';
import { CollectionComponent } from '../../collections-page/collection.component';
import { HomeComponent } from '../../../pages/home/home.component';
import { TestHomeComponent } from '../../../pages/test-home/test-home.component';

/**
 * Routes specific to the Phantasia project
 * 【✓】
 */
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'test-home',
    component: TestHomeComponent
  },
  { 
    path: 'mobile', 
    component: MobileViewComponent,
    children: [
      { 
        path: '', 
        component: MobileHomeComponent,
        outlet: 'front'
      },
      { 
        path: 'music', 
        component: MobileMusicComponent,
        outlet: 'right'
      },
      { 
        path: 'about', 
        component: MobileAboutComponent,
        outlet: 'back'
      },
      { 
        path: 'contact', 
        component: MobileContactComponent,
        outlet: 'left'
      },
      { 
        path: 'credits', 
        component: MobileCreditsComponent,
        outlet: 'top'
      }
    ]
  },
  { path: 'collections/phantasia', component: IntroductionComponent },
  { path: 'disc-1', component: DiscOneComponent },
  { path: 'disc-2', component: DiscTwoComponent },
  { path: 'pv', component: PvComponent },
  { path: 'information', component: InformationComponent },
  // Commenting out to prevent conflict with main app routes
  // { path: 'collections', component: CollectionComponent }
];
