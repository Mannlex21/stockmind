import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  // Estado para el menú lateral en pantallas móviles
  isMobileMenuOpen = signal(false);

  navItems = [
    { label: 'Panel Principal', route: '/app/dashboard', icon: 'dashboard' },
    { label: 'Inventario', route: '/app/inventory', icon: 'box' },
    { label: 'Escanear Factura (IA)', route: '/app/scanner', icon: 'scan' },
    { label: 'Órdenes de Compra', route: '/app/orders', icon: 'shopping-cart' },
    { label: 'Configuración', route: '/app/settings', icon: 'settings' },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((val) => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
