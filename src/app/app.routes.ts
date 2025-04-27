import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestHomeComponent } from './pages/test-home/test-home.component';

/**
 * Consolidated application routes
 * Includes both main and Phantasia routes
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
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections/phantasia/pages/collection/new-collections.component').then(m => m.NewCollectionsComponent)
      },
      {
        path: 'test-home',
        component: TestHomeComponent
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
        loadComponent: () => import('./pages/collections/phantasia/pages/collection/new-collections.component').then(m => m.NewCollectionsComponent)
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
  
  // Direct routes for collections/phantasia (from phantasia.routes.ts)
  {
    path: 'collections/phantasia',
    loadComponent: () => import('./pages/collections/phantasia/pages/introduction/introduction.component').then(m => m.IntroductionComponent)
  },
  {
    path: 'disc-1',
    loadComponent: () => import('./pages/collections/phantasia/pages/disc-one/disc-one.component').then(m => m.DiscOneComponent)
  },
  {
    path: 'disc-2',
    loadComponent: () => import('./pages/collections/phantasia/pages/disc-two/disc-two.component').then(m => m.DiscTwoComponent)
  },
  {
    path: 'pv',
    loadComponent: () => import('./pages/collections/phantasia/pages/pv/pv.component').then(m => m.PvComponent)
  },
  {
    path: 'information',
    loadComponent: () => import('./pages/collections/phantasia/pages/information/information.component').then(m => m.InformationComponent)
  },
  
  // Mobile Layout routes with named outlets
  {
    path: 'mobile',
    loadComponent: () => import('./layout/mobile-layout/mobile-layout.component').then(m => m.MobileLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/mobile/mobile-view.component').then(m => m.MobileViewComponent),
        children: [
          { 
            path: '', 
            loadComponent: () => import('./pages/collections/phantasia/mobile/pages/mobile-home/mobile-home.component').then(m => m.MobileHomeComponent),
            outlet: 'front'
          },
          { 
            path: 'music', 
            loadComponent: () => import('./pages/collections/phantasia/mobile/pages/mobile-music/mobile-music.component').then(m => m.MobileMusicComponent),
            outlet: 'right'
          },
          { 
            path: 'about', 
            loadComponent: () => import('./pages/collections/phantasia/mobile/pages/mobile-about/mobile-about.component').then(m => m.MobileAboutComponent),
            outlet: 'back'
          },
          { 
            path: 'contact', 
            loadComponent: () => import('./pages/collections/phantasia/mobile/pages/mobile-contact/mobile-contact.component').then(m => m.MobileContactComponent),
            outlet: 'left'
          },
          { 
            path: 'credits', 
            loadComponent: () => import('./pages/collections/phantasia/mobile/pages/mobile-credits/mobile-credits.component').then(m => m.MobileCreditsComponent),
            outlet: 'top'
          }
        ]
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
  }
]; 