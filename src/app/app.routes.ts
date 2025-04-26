import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

/**
 * Main application routes
 * Organized by layout components
 * 【✓】
 */
export const routes: Routes = [
  // Main Layout routes
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
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
        path: 'scroll-demo',
        loadComponent: () => import('./shared/components/scroll-demo.component').then(m => m.ScrollDemoComponent)
      }
    ]
  },
  
  // Phantasia Layout routes
  {
    path: 'phantasia',
    loadComponent: () => import('./layout/phantasia-layout/phantasia-layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'introduction',
        pathMatch: 'full'
      },
      {
        path: 'introduction',
        loadComponent: () => import('./pages/collections/phantasia/pages/introduction/introduction.component').then(m => m.IntroductionComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections/phantasia/pages/collection/collection.component').then(m => m.CollectionComponent)
      },
      {
        path: 'disc-one',
        loadComponent: () => import('./pages/collections/phantasia/pages/disc-one/disc-one.component').then(m => m.DiscOneComponent)
      },
      {
        path: 'disc-two',
        loadComponent: () => import('./pages/collections/phantasia/pages/disc-two/disc-two.component').then(m => m.DiscTwoComponent)
      },
      {
        path: 'information',
        loadComponent: () => import('./pages/collections/phantasia/pages/information/information.component').then(m => m.InformationComponent)
      },
      {
        path: 'pv',
        loadComponent: () => import('./pages/collections/phantasia/pages/pv/pv.component').then(m => m.PvComponent)
      }
    ]
  },
  
  // Mobile Layout routes
  {
    path: 'mobile',
    loadComponent: () => import('./layout/mobile-layout/mobile-layout.component').then(m => m.MobileLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/mobile/mobile-view.component').then(m => m.MobileViewComponent)
      }
    ]
  },
  
  // For backward compatibility, redirect old paths to new structured paths
  {
    path: 'introduction',
    redirectTo: 'phantasia/introduction',
    pathMatch: 'full'
  },
  {
    path: 'collections',
    redirectTo: 'phantasia/collections',
    pathMatch: 'full'
  },
  {
    path: 'collection',
    redirectTo: 'phantasia/collections',
    pathMatch: 'full'
  },
  {
    path: 'disc-one',
    redirectTo: 'phantasia/disc-one',
    pathMatch: 'full'
  },
  {
    path: 'disc-two',
    redirectTo: 'phantasia/disc-two',
    pathMatch: 'full'
  },
  {
    path: 'information',
    redirectTo: 'phantasia/information',
    pathMatch: 'full'
  },
  {
    path: 'pv',
    redirectTo: 'phantasia/pv',
    pathMatch: 'full'
  }
]; 