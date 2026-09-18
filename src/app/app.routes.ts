import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta Pública: Landing Page
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },

  // Rutas de Autenticación
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },

  // Ruta Privada: App Principal con Layout / Sidebar
  {
    path: 'app',
    loadComponent: () => import('./shared/components/layout/layout').then((m) => m.Layout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory').then((m) => m.Inventory),
      },
      {
        path: 'scanner',
        loadComponent: () => import('./features/scanner/scanner').then((m) => m.Scanner),
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
