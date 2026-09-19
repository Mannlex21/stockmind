import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
  // Ruta Pública: Landing Page
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.LandingComponent),
  },

  // Rutas de Autenticación
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },

  // Ruta Privada: App Principal con Layout / Sidebar
  {
    path: 'app',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/inventory').then((m) => m.InventoryComponent),
      },
      {
        path: 'warehouses',
        loadComponent: () =>
          import('./features/warehouses/warehouses').then((m) => m.WarehousesComponent),
      },
      {
        path: 'scanner',
        loadComponent: () =>
          import('./features/scanner/invoice-scanner').then((m) => m.InvoiceScanner),
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders').then((m) => m.OrdersComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings').then((m) => m.SettingsComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
