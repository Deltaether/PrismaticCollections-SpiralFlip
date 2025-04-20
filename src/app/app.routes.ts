import { Routes } from '@angular/router';
import { MobileViewComponent } from './pages/mobile-view/mobile-view.component';
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
        component: MobileViewComponent
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
  }
]; 