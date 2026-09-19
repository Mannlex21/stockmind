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
  LucideDynamicIcon,
} from '@lucide/angular';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LucideDynamicIcon, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
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

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((val) => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
