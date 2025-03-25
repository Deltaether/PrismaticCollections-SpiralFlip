import { Routes } from '@angular/router';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';

export const routes: Routes = [
  {
    path: 'mobile',
    component: MobileViewComponent
  },
  {
    path: 'introduction',
    loadComponent: () => import('./pages/introduction/introduction.component').then(m => m.IntroductionComponent)
  },
  {
    path: '',
    redirectTo: 'introduction',
    pathMatch: 'full'
  }
]; 