import { DataEntryMode } from './inventory.model';

/**
 * Estados del ciclo de vida de una orden de compra a proveedores.
 * - `draft`: Orden en borrador o preparación inicial.
 * - `sent`: Orden emitida y enviada al proveedor (en espera de recepción).
 * - `completed`: Orden surtida, recibida e ingresada al inventario.
 * - `cancelled`: Orden descartada o cancelada antes del surtido.
 */
export type OrderStatus = 'draft' | 'sent' | 'completed' | 'cancelled';

/**
 * Partida o elemento individual contenido dentro de una orden de compra.
 */
export interface PurchaseOrderItem {
  /** Identificador único del producto en el catálogo principal */
  productId: string;

  /** Nombre o descripción comercial del producto */
  productName: string;

  /** Cantidad de unidades o empaques a solicitar al proveedor */
  quantityToOrder: number;

  /** Coste unitario estimado o pactado previo a la recepción de la factura */
  estimatedCost: number;

  /** Nombre o razón social del proveedor adjudicado a esta línea */
  supplier: string;

  /** Identificador de la presentación o empaque secundario (ej. Caja, Cartera) (opcional) */
  presentationId?: string;

  /** Nombre o etiqueta descriptiva de la presentación seleccionada (opcional) */
  presentationName?: string;
}

/**
 * Encabezado y documento principal de una Orden de Compra.
 */
export interface PurchaseOrder {
  /** Identificador único del registro en la base de datos */
  id: string;

  /** Folio o código legible de seguimiento de la orden (ej. OC-2026-001) */
  orderNumber: string;

  /** Fecha de emisión o creación del documento */
  date: Date | string;

  /** Razon social o nombre del proveedor principal */
  supplier: string;

  /** Lista de partidas e insumos incluidos en el pedido */
  items: PurchaseOrderItem[];

  /** Importe monetario total estimado acumulado de la compra */
  totalCost: number;

  /** Estado actual del procesamiento de la orden */
  status: OrderStatus;

  /** Observaciones, comentarios de entrega o notas internas adicionales (opcional) */
  notes?: string;

  /** Origen de la captura (Manual, Sugerencia automática de IA o Editada) (opcional) */
  entryMode?: DataEntryMode;

  /** Marca de tiempo de creación en el sistema para auditoría (opcional) */
  createdAt?: Date | string;

  /** Marca de tiempo de la última actualización del registro (opcional) */
  updatedAt?: Date | string;
}

/**
 * Estructura de parámetros para el filtrado reactivo de órdenes de compra.
 */
export interface OrderFilter {
  /** Término de búsqueda por folio de orden o nombre de proveedor */
  search: string;

  /** Filtro por estado operativo de la orden o 'ALL' para omitir el filtro */
  status: OrderStatus | 'ALL';
}

/**
 * Resumen de indicadores clave (KPIs) y métricas acumuladas de órdenes de compra.
 */
export interface OrderStats {
  /** Cantidad total de órdenes evaluadas en el conjunto actual */
  totalOrders: number;

  /** Número de órdenes actualmente en estado de borrador */
  draftCount: number;

  /** Número de órdenes emitidas y pendientes por recibir */
  sentCount: number;

  /** Número de órdenes completadas e ingresadas satisfactoriamente */
  completedCount: number;

  /** Suma monetaria total del gasto estimado en las órdenes */
  totalEstimatedSpend: number;
}
