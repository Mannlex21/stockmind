import { Injectable, computed, inject, signal } from '@angular/core';
import { Warehouse } from '../models/warehouse.model';
import { WarehouseService } from '../services/warehouse.service';

@Injectable({
  providedIn: 'root',
})
export class WarehouseStore {
  private readonly warehouseService = inject(WarehouseService);

  // --- Estado Base (Signals) ---
  readonly warehouses = signal<Warehouse[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // --- Filtros de Búsqueda ---
  readonly searchQuery = signal('');
  readonly selectedStatus = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // --- Estado de Modales y Edición ---
  readonly isModalOpen = signal(false);
  readonly editingWarehouse = signal<Partial<Warehouse> | null>(null);

  constructor() {
    this.loadWarehouses();
  }

  // --- Cargar Datos del Servidor ---
  loadWarehouses(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo cargar la lista de almacenes.');
        this.isLoading.set(false);
        console.error('Error fetching warehouses:', err);
      },
    });
  }

  // --- Señales Computadas (Computed) ---
  readonly filteredWarehouses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.warehouses().filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(query) ||
        w.code.toLowerCase().includes(query) ||
        (w.location && w.location.toLowerCase().includes(query));

      const matchesStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && w.isActive) ||
        (status === 'INACTIVE' && !w.isActive);

      return matchesSearch && matchesStatus;
    });
  });

  readonly totalActiveWarehouses = computed(() => {
    return this.warehouses().filter((w) => w.isActive).length;
  });

  readonly posEnabledWarehouses = computed(() => {
    return this.warehouses().filter((w) => w.isActive && w.allowSales).length;
  });

  // --- Modales ---
  openModal(warehouse?: Warehouse): void {
    if (warehouse) {
      this.editingWarehouse.set(JSON.parse(JSON.stringify(warehouse)));
    } else {
      this.editingWarehouse.set({
        code: '',
        name: '',
        location: '',
        isMain: false,
        allowSales: true,
        isActive: true,
        description: '',
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingWarehouse.set(null);
  }

  // --- Persistencia CRUD con HTTP ---
  saveWarehouse(): void {
    const current = this.editingWarehouse();
    if (!current || !current.name || !current.code) return;

    this.isLoading.set(true);

    if (current.id) {
      // Edición (PUT)
      this.warehouseService.updateWarehouse(current.id, current).subscribe({
        next: (updatedWarehouse) => {
          this.warehouses.update((list) =>
            list.map((w) => (w.id === updatedWarehouse.id ? updatedWarehouse : w)),
          );
          this.isLoading.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Error al actualizar el almacén.');
          this.isLoading.set(false);
          console.error(err);
        },
      });
    } else {
      // Creación (POST)
      this.warehouseService.createWarehouse(current).subscribe({
        next: (createdWarehouse) => {
          this.warehouses.update((list) => [createdWarehouse, ...list]);
          this.isLoading.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.error.set('Error al crear el almacén.');
          this.isLoading.set(false);
          console.error(err);
        },
      });
    }
  }

  toggleStatus(id: string): void {
    const warehouse = this.warehouses().find((w) => w.id === id);
    if (!warehouse) return;

    if (warehouse.isMain && warehouse.isActive) return;

    const newStatus = !warehouse.isActive;
    this.warehouseService.toggleWarehouseStatus(id, newStatus).subscribe({
      next: (updated) => {
        this.warehouses.update((list) => list.map((w) => (w.id === id ? updated : w)));
      },
      error: (err) => console.error('Error al cambiar estado del almacén:', err),
    });
  }

  deleteWarehouse(id: string): void {
    const warehouse = this.warehouses().find((w) => w.id === id);
    if (warehouse?.isMain) {
      alert('No es posible eliminar el almacén asignado como Principal.');
      return;
    }

    this.warehouseService.deleteWarehouse(id).subscribe({
      next: () => {
        this.warehouses.update((list) => list.filter((w) => w.id !== id));
      },
      error: (err) => console.error('Error al eliminar almacén:', err),
    });
  }
}
