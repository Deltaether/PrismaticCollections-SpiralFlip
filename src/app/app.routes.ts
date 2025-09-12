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
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'collections',
    loadComponent: () => import('./pages/collections-page/new-collections.component').then(m => m.NewCollectionsComponent)
  },
  {
    path: 'socials',
    loadComponent: () => import('./pages/social-links/social-links').then(m => m.SocialLinksComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news').then(m => m.News)
  },
  {
    path: 'test-home',
    component: TestHomeComponent
  },
  
  // Phantasia Layout routes
  {
    path: 'phantasia',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'phantasia',
        pathMatch: 'full'
      },
      {
        path: 'phantasia',
        loadComponent: () => import('./pages/collections/phantasia/pages/phantasia/phantasia.component').then(m => m.PhantasiaComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/collections-page/new-collections.component').then(m => m.NewCollectionsComponent)
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
      },
      {
        path: 'phantasia2',
        loadComponent: () => import('./pages/collections/phantasia/pages/phantasia2/phantasia2').then(m => m.Phantasia2Component)
      }
    ]
  },
  
  // Direct routes for collections/phantasia (from phantasia.routes.ts)
  {
    path: 'collections/phantasia',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/pages/phantasia/phantasia.component').then(m => m.PhantasiaComponent)
      }
    ]
  },
  {
    path: 'disc-1',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/pages/disc-one/disc-one.component').then(m => m.DiscOneComponent)
      }
    ]
  },
  {
    path: 'disc-2',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/pages/disc-two/disc-two.component').then(m => m.DiscTwoComponent)
      }
    ]
  },
  {
    path: 'pv',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/pages/pv/pv.component').then(m => m.PvComponent)
      }
    ]
  },
  {
    path: 'information',
    loadComponent: () => import('./pages/collections/phantasia/layout/layout.component').then(m => m.PhantasiaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/collections/phantasia/pages/information/information.component').then(m => m.InformationComponent)
      }
    ]
  },
  
  // Mobile routes removed - Using responsive design instead
  // All components now handle mobile layouts through responsive design
  
  // For backward compatibility, redirect old paths to new structured paths
  {
    path: 'introduction',
    redirectTo: 'phantasia/phantasia',
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