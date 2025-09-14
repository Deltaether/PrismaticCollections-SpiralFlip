/**
 * Lazy loading routes for heavy 3D tools
 * Reduces initial bundle size by loading these components only when needed
 */
import { Routes } from '@angular/router';

export const TOOLS_ROUTES: Routes = [
  {
    path: 'cd-cases',
    loadComponent: () => import('./cd-cases/cd-cases.component').then(m => m.CDCasesComponent)
  },
  {
    path: 'music-player',
    loadComponent: () => import('./music-player/music-player.component').then(m => m.MusicPlayerComponent)
  },
  {
    path: 'right-side-menu',
    loadComponent: () => import('./right-side-menu/right-side-menu.component').then(m => m.RightSideMenuComponent)
  }
];