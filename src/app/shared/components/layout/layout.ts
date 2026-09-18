import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

// Directivas / Componentes de Íconos Lucide
import {
  LucideLayoutDashboard,
  LucidePackage,
  LucideWarehouse,
  LucideScan,
  LucideShoppingCart,
  LucideSettings,
  LucideMenu,
  LucideLogOut,
} from '@lucide/angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  isMobileMenuOpen = signal(false);

  // Mapeamos directamente el componente del ícono
  navItems = [
    { label: 'Panel Principal', route: '/app/dashboard', icon: LucideLayoutDashboard },
    { label: 'Inventario', route: '/app/inventory', icon: LucidePackage },
    { label: 'Almacenes', route: '/app/warehouses', icon: LucideWarehouse },
    { label: 'Escanear Factura (IA)', route: '/app/scanner', icon: LucideScan },
    { label: 'Órdenes de Compra', route: '/app/orders', icon: LucideShoppingCart },
    { label: 'Configuración', route: '/app/settings', icon: LucideSettings },
  ];

  // Exponemos los íconos estáticos
  readonly menuIcon = LucideMenu;
  readonly logoutIcon = LucideLogOut;

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((val) => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
