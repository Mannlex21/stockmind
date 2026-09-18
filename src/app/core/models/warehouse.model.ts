/**
 * Representa un almacén o ubicación física de inventario en el ERP.
 */
export interface Warehouse {
  /** Identificador único del almacén (UUID o ID autonumérico) */
  id: string;
  /** Código corto o clave interna del almacén (ej. BOD-01, MOST-01) */
  code: string;
  /** Nombre descriptivo del almacén */
  name: string;
  /** Dirección física o ubicación interna dentro del local */
  location?: string;
  /** Indica si es el almacén principal receptor de compras por defecto */
  isMain: boolean;
  /** Habilita el almacén para realizar ventas directas en el TPV / POS */
  allowSales: boolean;
  /** Estado operativo del almacén (Activo / Inactivo) */
  isActive: boolean;
  /** Observaciones o notas adicionales sobre la gestión del almacén */
  description?: string;
  /** Capacidad estimada de almacenamiento en m² o m³ (opcional) */
  capacityLimit?: number;
  /** Total de productos/SKUs con stock en este almacén (campo calculado) */
  totalSkusCount?: number;
  /** Fecha de creación del registro */
  createdAt: Date | string;
  /** Fecha de última actualización */
  updatedAt: Date | string;
}

/**
 * Filtros de consulta para la lista de almacenes.
 */
export interface WarehouseFilter {
  query: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  allowSalesOnly: boolean;
}
