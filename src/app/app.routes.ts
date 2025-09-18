import { Routes } from '@angular/router';

/**
 * Consolidated application routes
 * Includes both main and Phantasia routes
 * 【✓】
 */
export const routes: Routes = [
  // Main Layout routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
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
    loadComponent: () => import('./pages/test-home/test-home.component').then(m => m.TestHomeComponent)
  },
  {
    path: 'x-api-test',
    loadComponent: () => import('./components/x-api-integration-example/x-api-integration-example.component').then(m => m.XApiIntegrationExampleComponent)
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
]; 