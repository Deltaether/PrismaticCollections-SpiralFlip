import { Routes } from '@angular/router';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';
import { HomeComponent } from './pages/home/home.component';

/**
 * Main application routes
 * HomeComponent serves both root and /home paths
 * No automatic redirects
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
    path: 'mobile',
    component: MobileViewComponent
  },
  {
    path: 'introduction',
    loadComponent: () => import('./pages/introduction/introduction.component').then(m => m.IntroductionComponent)
  },
  {
    path: 'collection',
    loadComponent: () => import('./pages/collection/collection.component').then(m => m.CollectionComponent)
  }
]; 