import { Routes } from '@angular/router';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { DiscOneComponent } from './pages/disc-one/disc-one.component';
import { DiscTwoComponent } from './pages/disc-two/disc-two.component';
import { PvComponent } from './pages/pv/pv.component';
import { InformationComponent } from './pages/information/information.component';

export const routes: Routes = [
  { path: '', redirectTo: 'introduction', pathMatch: 'full' },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'disc-1', component: DiscOneComponent },
  { path: 'disc-2', component: DiscTwoComponent },
  { path: 'pv', component: PvComponent },
  { path: 'information', component: InformationComponent },
  { path: '**', redirectTo: 'introduction' }
];
