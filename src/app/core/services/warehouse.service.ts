import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Warehouse, WarehouseFilter } from '../models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private mockWarehouses: Warehouse[] = [
    {
      id: '1',
      code: 'ALM-01',
      name: 'Almacén Principal',
      location: 'Bodega Central',
      isMain: true,
      allowSales: true,
      isActive: true,
      description: 'Almacén principal de distribución',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      code: 'ALM-02',
      name: 'Sucursal Norte',
      location: 'Zona Industrial',
      isMain: false,
      allowSales: true,
      isActive: true,
      description: 'Punto de venta y almacenamiento secundario',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  getWarehouses(filters?: Partial<WarehouseFilter>): Observable<Warehouse[]> {
    return of(this.mockWarehouses);
  }

  getWarehouseById(id: string): Observable<Warehouse> {
    const item = this.mockWarehouses.find((w) => w.id === id);
    return of(item!);
  }

  createWarehouse(warehouse: Partial<Warehouse>): Observable<Warehouse> {
    const created: Warehouse = {
      id: Date.now().toString(),
      code: warehouse.code || 'ALM-NEW',
      name: warehouse.name || 'Nuevo Almacén',
      location: warehouse.location || '',
      isMain: warehouse.isMain ?? false,
      allowSales: warehouse.allowSales ?? true,
      isActive: warehouse.isActive ?? true,
      description: warehouse.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return of(created);
  }

  updateWarehouse(id: string, warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return of({ ...warehouse, id } as Warehouse);
  }

  toggleWarehouseStatus(id: string, isActive: boolean): Observable<Warehouse> {
    const item = this.mockWarehouses.find((w) => w.id === id);
    return of({ ...item!, isActive });
  }

  deleteWarehouse(id: string): Observable<void> {
    return of(undefined);
  }
}
