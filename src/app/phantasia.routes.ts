import { Routes } from '@angular/router';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { DiscOneComponent } from './pages/disc-one/disc-one.component';
import { DiscTwoComponent } from './pages/disc-two/disc-two.component';
import { PvComponent } from './pages/pv/pv.component';
import { InformationComponent } from './pages/information/information.component';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';
import { MobileHomeComponent } from './pages/mobile-view/pages/mobile-home/mobile-home.component';
import { MobileMusicComponent } from './pages/mobile-view/pages/mobile-music/mobile-music.component';
import { MobileAboutComponent } from './pages/mobile-view/pages/mobile-about/mobile-about.component';
import { MobileContactComponent } from './pages/mobile-view/pages/mobile-contact/mobile-contact.component';
import { MobileCreditsComponent } from './pages/mobile-view/pages/mobile-credits/mobile-credits.component';

export const routes: Routes = [
  { path: '', redirectTo: 'introduction', pathMatch: 'full' },
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
  { path: 'introduction', component: IntroductionComponent },
  { path: 'disc-1', component: DiscOneComponent },
  { path: 'disc-2', component: DiscTwoComponent },
  { path: 'pv', component: PvComponent },
  { path: 'information', component: InformationComponent },
  { path: '**', redirectTo: 'introduction' }
];
