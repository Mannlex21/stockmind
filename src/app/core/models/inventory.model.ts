// 1. Tipos de unión para asegurar consistencia en estados y unidades
export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
export type OrderStatus = 'draft' | 'sent' | 'completed';
export type DataEntryMode = 'MANUAL' | 'AI_GENERATED' | 'AI_EDITED';
export type UnitOfMeasure = 'PCS' | 'KG' | 'G' | 'L' | 'ML';

export type ReturnType = 'CUSTOMER_RETURN' | 'SUPPLIER_RETURN';
export type ReturnReason = 'DAMAGED' | 'EXPIRED' | 'WRONG_ITEM' | 'CUSTOMER_REFUND';

// 2. Modelo de Presentaciones (Conversiones de empaque/venta)
export interface ProductPresentation {
  id: string;
  name: string; // Ej: "Cartera", "Caja", "Bote 500g"
  parentPresentationId?: string;
  baseConversionFactor: number; // Ej: Cartera = 24 piezas, Caja = 480 piezas
  price: number;
  sku?: string;
}

// 3. Entidad Principal de Producto
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;

  baseUnit: UnitOfMeasure; // Unidad mínima (ej. 'PCS' o 'KG')
  stock: number; // Se almacena SIEMPRE en la unidad base
  minStock: number;
  unitPrice: number; // Precio por unidad base

  presentations?: ProductPresentation[];

  supplier: string;
  lastUpdated: Date | string;

  entryMode?: DataEntryMode;
  status?: ProductStatus;
}

// 4. Registro de Devoluciones y Mermas (Trazabilidad)
export interface ReturnTransaction {
  id: string;
  productId: string;
  productName: string;
  type: ReturnType; // Devolución de Cliente o a Proveedor
  reason: ReturnReason; // Dañado, Expirado, etc.

  // Se especifica en qué presentación se devolvió (ej. 2 Carteras de Huevo)
  presentationId?: string;
  quantityReturned: number; // Cantidad devuelta en la presentación o unidad base
  baseQuantity: number; // Equivalente exacto en unidad base que se suma/resta

  restockInventory: boolean; // true: Vuelve al stock vendible | false: Pasa a Merma/Pérdida
  totalAmount: number; // Monto monetario devuelto/reembolsado
  date: Date | string;
  notes?: string;
  entryMode?: DataEntryMode; // Captura manual o detectada vía escáner/ticket IA
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantityToOrder: number;
  estimatedCost: number;
  supplier: string;
  presentationId?: string;
}

export interface PurchaseOrder {
  id: string;
  date: Date | string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: OrderStatus;
}

// 5. Modelo para la lectura e extracción de datos con Gemini IA
export interface InvoiceItemScan {
  description: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  detectedPresentation?: string;
  matchedProductId?: string;
  confidenceScore?: number;
  isManuallyVerified: boolean;
}

export interface InvoiceScanResult {
  invoiceNumber: string;
  supplierName: string;
  issueDate: string;
  totalAmount: number;
  items: InvoiceItemScan[];
  rawText?: string;
}

// 6. Resumen de métricas rápidas para el Dashboard
export interface InventoryStats {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  pendingOrders: number;
}
